/* Edit this roster to add approved biographies and local portrait paths.
   Portraits: e.g. "assets/people/judy-ford.jpg". Leave null until supplied.
   All biography placeholders are intentional; no personal bios are inferred. */
window.LAB_PEOPLE = [
  {name: 'Daniel Mathalon', role: 'Co-Director', group: 'Directors'},
  {name: 'Judith Ford', role: 'Co-Director', group: 'Directors', bio: 'From the archived lab website (for review): Judith Ford’s research focused on psychosis, particularly auditory verbal hallucinations. Her work used neurophysiological methods to investigate how the brain predicts self-generated sensations and whether altered prediction mechanisms contribute to hallucinations, including studies of neural responses to self-generated sounds.'},
  {name: 'Susanna Fryer', role: 'Associate Director', group: 'Directors'},
  {name: 'Samantha Abram', role: 'Principal Investigator', group: 'Principal Investigators'},
  {name: 'Michael Jacob', role: 'Principal Investigator', group: 'Principal Investigators'},
  {name: 'Jessica Hua', role: 'Principal Investigator', group: 'Principal Investigators'},
  {name: 'Maria Kryza-Lacombe', role: 'Principal Investigator', group: 'Principal Investigators'},
  {name: 'Jessica Mow', role: 'Postdoctoral Fellow', group: 'Postdoctoral Fellows'},
  {name: 'Carlos Carrasco', role: 'Postdoctoral Fellow', group: 'Postdoctoral Fellows'},
  {name: 'Maya Wong', role: 'Postdoctoral Fellow', group: 'Postdoctoral Fellows'},
  {name: 'Wendy Torrens', role: 'Postdoctoral Fellow', group: 'Postdoctoral Fellows'},
  {name: 'Juliette Kyner', role: 'CRC / RA', group: 'Staff & collaborators'},
  {name: 'Zoe Rygg', role: 'CRC / RA', group: 'Staff & collaborators'},
  {name: 'Olivia Dance', role: 'CRC / RA', group: 'Staff & collaborators'},
  {name: 'Paul Betancourt', role: 'Lab Manager', group: 'Staff & collaborators'},
  {name: 'Spero Nicholas', role: 'Computational Research Engineer', group: 'Staff & collaborators', provisional: true},
  {name: 'Brian Roach', role: 'Consultant', group: 'Staff & collaborators'},
  {name: 'TBD', role: 'Volunteers', group: 'Volunteers'}
].map(person => ({portrait: null, bio: null, ...person}));
