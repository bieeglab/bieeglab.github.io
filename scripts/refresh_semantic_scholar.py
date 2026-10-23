#!/usr/bin/env python3
"""Refresh the website's static Semantic Scholar snapshot; never request from visitors.

python3 scripts/refresh_semantic_scholar.py --as-of 2026-10-23
Add --discover to also scan the explicitly verified author IDs for new papers.
Use --offline to rebuild from the saved response. Set SEMANTIC_SCHOLAR_API_KEY
in the environment if your API quota requires one; it is never saved or emitted.
A failed refresh preserves the last successful snapshot. Review before publishing.
"""
import argparse
from datetime import date
from pathlib import Path
import json, math, os, re, time
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
ROOT=Path(__file__).resolve().parents[1]
FIELDS='title,authors,year,publicationDate,externalIds,abstract,tldr,citationCount,influentialCitationCount,url,venue,publicationTypes'
API='https://api.semanticscholar.org/graph/v1/'

def request(path, payload=None):
    headers={'User-Agent':'BIEEGL-publication-library/1.0'}
    key=os.environ.get('SEMANTIC_SCHOLAR_API_KEY')
    if key: headers['x-api-key']=key
    body=None
    if payload is not None:
        headers['Content-Type']='application/json'; body=json.dumps(payload).encode()
    for attempt in range(3):
        try:
            with urlopen(Request(API+path,data=body,headers=headers),timeout=45) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code not in (429,500,502,503,504) or attempt==2:
                raise RuntimeError(f'Semantic Scholar HTTP {error.code}; previous snapshot preserved') from None
            time.sleep(min(int(error.headers.get('Retry-After','3')),10)*(attempt+1))

def window_start(as_of):
    # Same calendar day one year earlier (including leap-day handling).
    try:return as_of.replace(year=as_of.year-1)
    except ValueError:return as_of.replace(year=as_of.year-1,day=28)

def domains(paper):
    text=(paper.get('title','')+' '+(paper.get('abstract') or '')).lower()
    result=[]
    if re.search(r'fmri|functional magnetic|magnetic resonance|brain.imag|neuroimag|\bmri\b|bold|hemodynamic|haemodynamic|cortical thickness|gray matter|grey matter|hippocampal volume|morphometr|connectiv|brain age|cortico.?limbic',text):result.append('brain-imaging')
    if re.search(r'\beeg\b|electroencephalo|event.related|\berp\b|\bp300\b|\bp3b\b|oddball|mismatch negativity|electrophysiolog|microstate|neural oscill|spectral attractor',text):result.append('electrophysiology')
    if re.search(r'psychosis|psychotic|schizophren|depress|cogniti|clinical|hallucinat|mental health|neuropsycholog|anhedoni|suicid|reward|attention|memory',text):result.append('clinical-neuroscience')
    return result

def rank(paper):
    # Explainable recommendation signal, not a claim of scientific quality.
    return round(min(len(paper['labMembers']),6)*3 + (6 if paper['labLeadAuthor'] else 0)
        + min(len(paper['domains']),3)*2 + min(math.log1p(paper['citationCount'])*2,6)
        + min(paper['influentialCitationCount'],3) - (4 if paper['preprint'] else 0),3)

def normalize(raw, config, as_of):
    owners={b['authorId']:m['name'] for m in config['members'] for b in m['bindings']}
    excluded=set(config.get('excludedIds',[])); seen={}; omitted=[]
    for requested,paper in zip(raw['ids'],raw['results']):
        if not paper or requested in excluded:
            omitted.append({'requestedId':requested,'reason':'not indexed or explicitly excluded'});continue
        authors=paper.get('authors') or []
        members=sorted({owners[a['authorId']] for a in authors if a.get('authorId') in owners})
        tags=domains(paper)
        if not members or not tags:
            omitted.append({'requestedId':requested,'reason':'no verified lab author or domain match'});continue
        pubdate=paper.get('publicationDate');year=paper.get('year')
        if (pubdate and pubdate>as_of.isoformat()) or (year and year>as_of.year):continue
        ext=paper.get('externalIds') or {};doi=ext.get('DOI','')
        preprint=bool(re.search(r'10\.(?:1101|64898)/',doi)) or any(x in (paper.get('venue') or '').lower() for x in ['biorxiv','medrxiv','arxiv'])
        title=paper['title'].rstrip('.')
        record={'id':paper['paperId'],'title':title,'journal':paper.get('venue') or ('Preprint' if preprint else 'Journal not supplied'),
            'year':year,'date':pubdate,'doi':doi,'url':'https://doi.org/'+doi if doi else paper['url'],
            'semanticScholarUrl':paper['url'],'authors':[a['name'] for a in authors], 'labMembers':members,
            'labLeadAuthor':bool(authors and (authors[0].get('authorId') in owners or authors[-1].get('authorId') in owners)),
            'domains':tags,'citationCount':paper.get('citationCount') or 0,'influentialCitationCount':paper.get('influentialCitationCount') or 0,
            'preprint':preprint,'automatedSummary':(paper.get('tldr') or {}).get('text'),
            'recommendationEligible':not re.match(r'^(?:\d+[. ]|corrigendum|erratum|response to|reply to|comment on)',title,re.I) and not any(t in (paper.get('publicationTypes') or []) for t in ['Letter','Editorial','Conference']),
            'recent':bool(pubdate and window_start(as_of).isoformat()<=pubdate<=as_of.isoformat()),
            'sources':[API+'paper/'+paper['paperId']+'?fields='+FIELDS]}
        record['recommendationScore']=rank(record)
        # PMID/DOI aliases can resolve to different graph records for the same DOI.
        canonical=next((old for old in seen.values() if record['doi'] and old['doi'].lower()==record['doi'].lower()),None)
        if canonical:
            canonical['labMembers']=sorted(set(canonical['labMembers']+record['labMembers']))
            canonical['labLeadAuthor']=canonical['labLeadAuthor'] or record['labLeadAuthor']
            canonical['recommendationScore']=rank(canonical)
        else:seen[record['id']]=record
    papers=sorted(seen.values(),key=lambda p:(p['date'] or '',p['title']),reverse=True)
    recent=sorted([p for p in papers if p['recent'] and p['recommendationEligible']],key=lambda p:(p['recommendationScore'],p['date'],p['id']),reverse=True)
    return {'updated':as_of.isoformat(),'windowStart':window_start(as_of).isoformat(),'windowEnd':as_of.isoformat(),
        'source':'Semantic Scholar Academic Graph API','discovery':raw.get('discovery',False),
        'coverage':'Verified author IDs and source-checked seed publications; not a complete bibliography.',
        'recommendationMethod':'Lab author count (capped at six), lab first/last authorship, domain coverage, capped citation signals; preprints receive a separate flag and a four-point adjustment. These are review candidates, not a quality ranking.',
        'recentRecommendations':[p['id'] for p in recent[:6]],'papers':papers,'omitted':omitted}

def refresh(as_of, offline=False, discover=False):
    config=json.loads((ROOT/'data/semantic-scholar-config.json').read_text());cache=ROOT/'.cache/semantic-scholar/seed-response.json'
    if offline:
        raw=json.loads(cache.read_text())
    else:
        ids=list(dict.fromkeys(config['seedIds']))
        records=request('paper/batch?'+urlencode({'fields':FIELDS}),{'ids':ids})
        if not isinstance(records,list) or len(records)!=len(ids):raise RuntimeError('Incomplete batch response; previous snapshot preserved')
        raw={'ids':ids,'results':records,'discovery':False}
        if discover:
            known={p['paperId'] for p in records if p};candidates=set()
            for aid in dict.fromkeys(b['authorId'] for m in config['members'] for b in m['bindings']):
                offset=0
                while True:
                    page=request('author/'+aid+'/papers?'+urlencode({'limit':1000,'offset':offset,'fields':'title,year,publicationDate'}))
                    if 'data' not in page:raise RuntimeError('Incomplete author response; previous snapshot preserved')
                    for p in page['data']:
                        if p.get('publicationDate') and window_start(as_of).isoformat()<=p['publicationDate']<=as_of.isoformat() and p['paperId'] not in known:candidates.add(p['paperId'])
                    if 'next' not in page:break
                    offset=page['next']
                    if offset>=10000:raise RuntimeError('Author pagination cap reached; previous snapshot preserved')
                time.sleep(1)
            for start in range(0,len(candidates),100):
                new=sorted(candidates)[start:start+100]
                result=request('paper/batch?'+urlencode({'fields':FIELDS}),{'ids':new})
                if not isinstance(result,list) or len(result)!=len(new):raise RuntimeError('Incomplete discovery batch; previous snapshot preserved')
                raw['ids']+=new;raw['results']+=result
            raw['discovery']=True
    output=normalize(raw,config,as_of)
    if not output['papers']:raise RuntimeError('Empty bibliography; previous snapshot preserved')
    # Build everything before replacing the last known good output.
    text=json.dumps(output,ensure_ascii=False,indent=2)+'\n'
    cache.parent.mkdir(parents=True,exist_ok=True)
    if not offline:cache.write_text(json.dumps(raw,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'data/semantic-scholar-publications.json').write_text(text)
    print(f"Saved {len(output['papers'])} unique domain-matched lab papers; {sum(p['recent'] for p in output['papers'])} within {output['windowStart']}–{output['windowEnd']}.")

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--as-of',type=date.fromisoformat,default=date.today());parser.add_argument('--offline',action='store_true');parser.add_argument('--discover',action='store_true');args=parser.parse_args()
    refresh(args.as_of,args.offline,args.discover)
