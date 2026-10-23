'use strict';
// Translate text nodes without replacing elements, links, or event handlers.
const pageTitleSource = document.title;
let activeLanguage = 'en';
try { const saved = localStorage.getItem('bieegl-language'); if (['en', 'es', 'zh-Hans', 'hi', 'ar'].includes(saved)) activeLanguage = saved; } catch {}
const sourceText = new WeakMap();
const sourceAttributes = new WeakMap();
function translateText(value) {
  const key = value.trim();
  if (activeLanguage === 'en') return value;
  let translated = window.LAB_TRANSLATIONS[key]?.[activeLanguage];
  const count = key.match(/^(\d+) entr(?:y|ies)(?: · (.*))?$/);
  if (count) {
    const suffix = count[2] === 'Full lab directory' ? ({es: 'Directorio completo', 'zh-Hans': '完整团队名录', vi: 'Danh sách đầy đủ thành viên', hi: 'सभी सदस्यों की सूची', ar: 'دليل المختبر الكامل'}[activeLanguage]) : (window.LAB_TRANSLATIONS[count[2]]?.[activeLanguage] || count[2]);
    translated = ['hi', 'ar'].includes(activeLanguage) ? `${window.LAB_TRANSLATIONS['{count} members'][activeLanguage].replace('{count}', count[1])}${suffix ? ' · ' + suffix : ''}` : activeLanguage === 'vi' ? `${count[1]} thành viên${suffix ? ' · ' + suffix : ''}` : activeLanguage === 'es' ? `${count[1]} ${count[1] === '1' ? 'miembro' : 'miembros'}${suffix ? ' · ' + suffix : ''}` : `${count[1]} 位成员${suffix ? ' · ' + suffix : ''}`;
  }
  if (key.startsWith('Biography of ')) translated = ['hi', 'ar'].includes(activeLanguage) ? window.LAB_TRANSLATIONS['Biography of {name}'][activeLanguage].replace('{name}', key.slice(13)) : activeLanguage === 'vi' ? `Tiểu sử của ${key.slice(13)}` : activeLanguage === 'es' ? `Biografía de ${key.slice(13)}` : `${key.slice(13)}的个人简介`;
  if (key === 'Biography of volunteers (to be determined)') translated = ['hi', 'ar'].includes(activeLanguage) ? window.LAB_TRANSLATIONS[key][activeLanguage] : activeLanguage === 'vi' ? 'Tiểu sử tình nguyện viên (chưa xác định)' : activeLanguage === 'es' ? 'Biografía del voluntariado (por confirmar)' : '志愿者个人简介（待确认）';
  if (key.startsWith('Portrait of ')) translated = ['hi', 'ar'].includes(activeLanguage) ? window.LAB_TRANSLATIONS['Portrait of {name}'][activeLanguage].replace('{name}', key.slice(12)) : activeLanguage === 'vi' ? `Ảnh của ${key.slice(12)}` : activeLanguage === 'es' ? `Retrato de ${key.slice(12)}` : `${key.slice(12)}的照片`;
  if (key.startsWith('View profile of ')) translated = window.LAB_TRANSLATIONS['View profile of {name}']?.[activeLanguage]?.replace('{name}', key.slice(16));
  return translated ? value.replace(key, translated) : value;
}
function applyTranslations() {
  document.documentElement.lang = activeLanguage;
  document.documentElement.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script, style, select, .monogram, [data-original-language]')) continue;
    if (!sourceText.has(node)) sourceText.set(node, node.nodeValue);
    node.nodeValue = translateText(sourceText.get(node));
  }
  document.querySelectorAll('[aria-label], [placeholder], img[alt]').forEach(node => {
    if (!sourceAttributes.has(node)) sourceAttributes.set(node, Object.fromEntries(['aria-label', 'placeholder', 'alt'].filter(attr => node.hasAttribute(attr)).map(attr => [attr, node.getAttribute(attr)])));
    for (const [attr, text] of Object.entries(sourceAttributes.get(node))) node.setAttribute(attr, translateText(text));
  });
  document.title = translateText(pageTitleSource);
  document.querySelectorAll('[data-localized]').forEach(node => {
    node.lang = activeLanguage;
    node.dir = activeLanguage === 'ar' ? 'rtl' : 'ltr';
  });
}
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
  if (!grid) { applyTranslations(); return; }
  const query = search.value.trim().toLocaleLowerCase();
  const people = window.LAB_PEOPLE.filter(person =>
    (activeFilter === 'all' || person.group === activeFilter) &&
    `${person.name} ${person.role} ${person.group} ${translateText(person.role)} ${translateText(person.group)}`.toLocaleLowerCase().includes(query)
  );
  grid.replaceChildren();
  for (const person of people) {
    const card = element('article', 'person-card');
    const portrait = element(person.profile ? 'a' : 'div', 'portrait');
    if (person.profile) { portrait.href = person.profile; portrait.setAttribute('aria-label', `View profile of ${person.name}`); }
    if (person.portrait) {
      portrait.classList.add('has-photo');
      const img = element('img'); img.src = person.portrait; img.alt = `Portrait of ${person.name}`; img.loading = 'lazy'; portrait.append(img);
    } else {
      const initials = person.name === 'TBD' ? '+' : person.name.split(' ').map(part => part[0]).join('');
      const monogram = element('span', 'monogram', initials); monogram.setAttribute('aria-hidden', 'true');
      portrait.append(monogram, element('span', 'portrait-caption', 'PORTRAIT TO COME'));
    }
    const body = element('div', 'person-body');
    const title = element('h3');
    if (person.profile) { const link = element('a', '', person.name); link.href = person.profile; title.append(link); } else title.textContent = person.name;
    body.append(title, element('p', 'person-role', person.role));
    if (person.draft) body.append(element('span', 'draft-badge', 'Draft biography'));
    if (person.provisional) body.append(element('span', 'provisional', 'Provisional title'));
    const detail = element('details', 'person-bio');
    const summary = element('summary', '', 'Biography');
    summary.append(element('span', '', '+'));
    summary.setAttribute('aria-label', `Biography of ${person.name === 'TBD' ? 'volunteers (to be determined)' : person.name}`);
    detail.append(summary, element('p', '', person.bio || (person.name === 'TBD' ? 'Volunteer names, portraits, and biographies will be added once confirmed.' : 'Biography to come. An approved introduction, research interests, and links will be added here.')));
    detail.querySelector('p').setAttribute('data-localized', '');
    body.append(detail);
    if (person.profile) { const link = element('a', 'person-profile-link', 'View profile'); link.href = person.profile; body.append(link); }
    card.append(portrait, body); grid.append(card);
  }
  if (!people.length) grid.append(element('p', 'empty-results', 'No matching lab members. Try another name or select Everyone.'));
  document.querySelector('#people-count').textContent = `${people.length} ${people.length === 1 ? 'entry' : 'entries'}${activeFilter === 'all' ? ' · Full lab directory' : ` · ${activeFilter}`}`;
  applyTranslations();
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected); filter.setAttribute('aria-pressed', String(selected));
  });
  renderPeople();
}));
search?.addEventListener('input', renderPeople);
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

const languageSelect = document.querySelector('#language-select');
languageSelect.value = activeLanguage;
languageSelect.addEventListener('change', () => {
  activeLanguage = languageSelect.value;
  try { localStorage.setItem('bieegl-language', activeLanguage); } catch {}
  renderPeople();
  closeMenu();
});

// Every section's first content line lands below the measured sticky header.
const stickyHeader = document.querySelector('.site-header');
const anchorTargets = [...document.querySelectorAll('main section[id], main #about')];
let anchorScrollSpace;
if (anchorTargets.length) {
  anchorScrollSpace = document.createElement('div');
  anchorScrollSpace.className = 'anchor-scroll-space';
  anchorScrollSpace.setAttribute('aria-hidden', 'true');
  document.body.append(anchorScrollSpace);
}
function updateAnchorOffsets() {
  if (!stickyHeader || !anchorTargets.length) return;
  const pageOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const headerHeight = stickyHeader.getBoundingClientRect().height;
  for (const target of anchorTargets) {
    const inset = parseFloat(getComputedStyle(target).paddingTop) || 0;
    target.style.scrollMarginTop = `${headerHeight - pageOffset - inset + 24}px`;
  }
  // Allow the final section to reach the same position without the page-end clamp.
  const contact = document.querySelector('#contact');
  const footer = document.querySelector('footer');
  if (contact && footer && anchorScrollSpace) {
    const contentTop = contact.getBoundingClientRect().top + window.scrollY + (parseFloat(getComputedStyle(contact).paddingTop) || 0);
    const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
    anchorScrollSpace.style.height = `${Math.max(0, contentTop - headerHeight - 24 + window.innerHeight - footerBottom)}px`;
  }
}
updateAnchorOffsets();
window.addEventListener('resize', updateAnchorOffsets);
if ('ResizeObserver' in window && stickyHeader) {
  new ResizeObserver(updateAnchorOffsets).observe(stickyHeader);
}
window.addEventListener('load', () => {
  updateAnchorOffsets();
  // Direct links from profile pages use the same framing once images have loaded.
  const target = anchorTargets.find(section => `#${section.id}` === window.location.hash);
  if (target) target.scrollIntoView({block: 'start', behavior: 'auto'});
});
if (document.fonts) document.fonts.ready.then(updateAnchorOffsets);
languageSelect.addEventListener('change', updateAnchorOffsets);
