'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
});
const grid = document.querySelector('#people-grid');
const search = document.querySelector('#people-search');
let activeFilter = 'all';
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function renderPeople() {
  const query = search.value.trim().toLocaleLowerCase();
  const people = window.LAB_PEOPLE.filter(person =>
    (activeFilter === 'all' || person.group === activeFilter) &&
    `${person.name} ${person.role} ${person.group}`.toLocaleLowerCase().includes(query)
  );
  grid.replaceChildren();
  for (const person of people) {
    const card = element('article', 'person-card');
    const portrait = element('div', 'portrait');
    if (person.portrait) {
      const img = element('img'); img.src = person.portrait; img.alt = `Portrait of ${person.name}`; img.loading = 'lazy'; portrait.append(img);
    } else {
      const initials = person.name === 'TBD' ? '+' : person.name.split(' ').map(part => part[0]).join('');
      const monogram = element('span', 'monogram', initials); monogram.setAttribute('aria-hidden', 'true');
      portrait.append(monogram, element('span', 'portrait-caption', 'PORTRAIT TO COME'));
    }
    const body = element('div', 'person-body');
    body.append(element('h3', '', person.name), element('p', 'person-role', person.role));
    if (person.provisional) body.append(element('span', 'provisional', 'Provisional title'));
    const detail = element('details', 'person-bio');
    const summary = element('summary', '', 'Biography');
    summary.append(element('span', '', '+'));
    summary.setAttribute('aria-label', `Biography of ${person.name === 'TBD' ? 'volunteers (to be determined)' : person.name}`);
    detail.append(summary, element('p', '', person.bio || (person.name === 'TBD' ? 'Volunteer names, portraits, and biographies will be added once confirmed.' : 'Biography to come. An approved introduction, research interests, and links will be added here.')));
    body.append(detail); card.append(portrait, body); grid.append(card);
  }
  if (!people.length) grid.append(element('p', 'empty-results', 'No matching lab members. Try another name or select Everyone.'));
  document.querySelector('#people-count').textContent = `${people.length} ${people.length === 1 ? 'entry' : 'entries'}${activeFilter === 'all' ? ' · Full lab directory' : ` · ${activeFilter}`}`;
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected); filter.setAttribute('aria-pressed', String(selected));
  });
  renderPeople();
}));
search.addEventListener('input', renderPeople);
renderPeople();
// Keep the current section visible in navigation without moving keyboard focus.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, {rootMargin: '-15% 0px -65% 0px'});
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
