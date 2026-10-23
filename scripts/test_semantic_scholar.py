"""Run with python3 -m unittest discover -s scripts -p 'test_*.py'."""
import copy, importlib.util, json, unittest
from datetime import date
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('scholar',Path(__file__).with_name('refresh_semantic_scholar.py'))
scholar=importlib.util.module_from_spec(spec);spec.loader.exec_module(scholar)
CONFIG={'members':[{'name':'Known Member','bindings':[{'authorId':'verified-id'}]}]}
PAPER={'paperId':'paper-a','title':'EEG and psychosis','authors':[{'authorId':'verified-id','name':'K. Member'}], 'publicationDate':'2026-06-01','year':2026,'externalIds':{'DOI':'10.1234/test'},'venue':'Journal','url':'https://www.semanticscholar.org/paper/paper-a','citationCount':2,'influentialCitationCount':1}
def normalize(papers,ids=None):return scholar.normalize({'ids':ids or [p['paperId'] for p in papers],'results':papers},CONFIG,date(2026,10,23))
class ScholarTests(unittest.TestCase):
 def test_dates_use_a_rolling_window_not_calendar_year(self):
  papers=[]
  for n,d in enumerate(['2025-10-22','2025-10-23','2026-10-23','2026-10-24',None]):
   p=copy.deepcopy(PAPER);p.update(paperId=str(n),publicationDate=d,externalIds={});papers.append(p)
  out=normalize(papers);self.assertEqual({p['id'] for p in out['papers'] if p['recent']},{'1','2'});self.assertNotIn('3',{p['id'] for p in out['papers']})
 def test_same_surname_is_not_an_identity_match(self):
  p=copy.deepcopy(PAPER);p['authors'][0]['authorId']='other-id';self.assertEqual(normalize([p])['papers'],[])
 def test_duplicate_doi_is_one_paper(self):
  other=copy.deepcopy(PAPER);other['paperId']='duplicate';self.assertEqual(len(normalize([PAPER,other])['papers']),1)
 def test_abstracts_and_corrections_are_not_recommendations(self):
  for title in ['139. EEG and psychosis','Corrigendum to EEG and psychosis','Response to EEG and psychosis']:
   p=copy.deepcopy(PAPER);p['title']=title;self.assertEqual(normalize([p])['recentRecommendations'],[])
 def test_preprint_is_explicit_and_has_lower_recommendation_signal(self):
  p=copy.deepcopy(PAPER);p['externalIds']['DOI']='10.1101/2026.123';r=normalize([p])['papers'][0];self.assertTrue(r['preprint']);self.assertLess(r['recommendationScore'],normalize([PAPER])['papers'][0]['recommendationScore'])
 def test_failed_api_refresh_preserves_saved_snapshot(self):
  with TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'data').mkdir();(root/'data/semantic-scholar-config.json').write_text(json.dumps({**CONFIG,'seedIds':['DOI:test']}));out=root/'data/semantic-scholar-publications.json';out.write_text('previous-good-snapshot')
   with patch.object(scholar,'ROOT',root),patch.object(scholar,'request',side_effect=RuntimeError('API unavailable')):
    with self.assertRaises(RuntimeError):scholar.refresh(date(2026,10,23))
   self.assertEqual(out.read_text(),'previous-good-snapshot')
if __name__=='__main__':unittest.main()
