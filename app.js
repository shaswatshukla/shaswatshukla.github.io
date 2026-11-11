const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');
function setMenu(open) {
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => { if (!event.target.closest('.site-nav')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

const themeToggle = document.getElementById('theme-toggle');
function renderTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.textContent = dark ? 'Light theme' : 'Dark theme';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).backgroundColor;
}
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
  renderTheme();
});
renderTheme();

const previews = [
  {name:'WageLens', description:'Payroll & salary screening', image:'assets/wagelens.jpg', href:'https://wagelens.vercel.app/'},
  {name:'BiasCheck', description:'News framing, inspected', image:'assets/biascheck.jpg', href:'https://biascheck-news.netlify.app/'},
  {name:'Open Atlas', description:'Conferences, fellowships & research', image:'assets/open-atlas.jpg', href:'https://openatlas-discover.netlify.app/'}
];
const previewTabs = [...document.querySelectorAll('[data-preview]')];
function choosePreview(index, focus = false) {
  const item = previews[index];
  previewTabs.forEach((button, i) => {
    button.setAttribute('aria-selected', String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
  document.getElementById('preview-image').src = item.image;
  document.getElementById('preview-image').alt = `${item.name} interface`;
  document.getElementById('preview-title').textContent = item.name;
  document.getElementById('preview-description').textContent = item.description;
  document.getElementById('preview-link').href = item.href;
  document.getElementById('preview-link').setAttribute('aria-label', `Explore ${item.name}: ${item.description}`);
  document.getElementById('preview-index').textContent = `0${index + 1} / 03`;
  document.getElementById('preview-panel').setAttribute('aria-labelledby', previewTabs[index].id);
  if (focus) previewTabs[index].focus();
}
previewTabs.forEach((button, index) => {
  button.addEventListener('click', () => choosePreview(index));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % previews.length;
    if (event.key === 'ArrowLeft') next = (index + previews.length - 1) % previews.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = previews.length - 1;
    if (next !== undefined) { event.preventDefault(); choosePreview(next, true); }
  });
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('.work-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.group !== filter;
      if (!card.hidden) count++;
    });
    document.querySelector('.work-grid').classList.toggle('is-filtered', filter !== 'all');
    document.querySelector('.work-grid').classList.toggle('is-research', filter === 'research');
    document.querySelector('.result-count').textContent = `${count} projects`;
  });
});
