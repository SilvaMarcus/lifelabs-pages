
(function () {
  const root = document.querySelector('.ep-native-xj5ote');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('.page_storeCard__44TrQ[data-category]'));
  const search = root.querySelector('#offer-search');
  const empty = root.querySelector('#empty-state');
  const filterButtons = Array.from(root.querySelectorAll('[data-filter]'));
  const mobileButton = root.querySelector('.page_categorySelectButton__3_gJl');
  const mobileMenu = root.querySelector('#mobile-category-menu');
  const mobileLabel = root.querySelector('#mobile-category-current');
  let currentFilter = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function setPressed(filter) {
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      if (button.hasAttribute('aria-pressed')) button.setAttribute('aria-pressed', String(active));
      if (button.hasAttribute('aria-selected')) button.setAttribute('aria-selected', String(active));
    });
  }

  function applyFilters() {
    const query = normalize(search ? search.value : '');
    let visible = 0;

    cards.forEach((card) => {
      const category = normalize(card.dataset.category);
      const text = normalize(`${card.dataset.search || ''} ${card.textContent || ''}`);
      const matchesCategory = currentFilter === 'all' || normalize(currentFilter) === category;
      const matchesSearch = !query || text.includes(query);
      const show = matchesCategory && matchesSearch;
      card.dataset.hidden = show ? 'false' : 'true';
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'all';
      setPressed(currentFilter);
      if (mobileLabel) mobileLabel.textContent = button.textContent.trim() || 'Categorias';
      if (mobileMenu) mobileMenu.hidden = true;
      if (mobileButton) mobileButton.setAttribute('aria-expanded', 'false');
      applyFilters();
    });
  });

  if (search) search.addEventListener('input', applyFilters);

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', () => {
      const expanded = mobileButton.getAttribute('aria-expanded') === 'true';
      mobileButton.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });
  }

  root.addEventListener('click', async (event) => {
    const coupon = event.target.closest('.page_couponRow__WYUce');
    if (!coupon) return;
    event.preventDefault();
    const code = coupon.querySelector('.page_storeCoupon__MttAJ')?.textContent?.trim() || '';
    try { if (code) await navigator.clipboard.writeText(code); } catch (_) {}
    coupon.dataset.copied = 'true';
    setTimeout(() => { delete coupon.dataset.copied; }, 1600);
  });

  const backTop = root.querySelector('.page_backToTop__Vv_xw');
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  applyFilters();
})();
