(function () {
  const categories = Array.isArray(window.LifeLabsCategories) ? window.LifeLabsCategories : [];
  const offers = Array.isArray(window.LifeLabsOffers) ? window.LifeLabsOffers : [];

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function cleanText(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  function getOfferHref(offer) {
    const directLink = cleanText(offer.href);
    if (directLink) return directLink;
    return '/' + cleanText(offer.slug).replace(/^\/+|\/+$/g, '') + '/';
  }

  function getExternalLinkAttrs(href) {
    return /^https?:\/\//i.test(href) ? ' rel="nofollow sponsored noopener noreferrer"' : '';
  }

  function getOfferImage(offer) {
    const directImage = cleanText(offer.image || offer.imageUrl);
    if (directImage) return directImage;
    return 'ofertas/' + cleanText(offer.category) + '/' + cleanText(offer.slug) + '/assets/img/imagens/productimage.png';
  }

  function categoryButton(category, className, pressedAttr) {
    const active = category.id === 'all';
    const icon = '<span aria-hidden="true" class="page_categoryPillIcon__9HpEF"><svg aria-hidden="true" fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="18">' + category.icon + '</svg></span>';
    return '<button ' + pressedAttr + '="' + String(active) + '" class="' + className + '" type="button" data-filter="' + escapeHtml(category.id) + '">' + icon + escapeHtml(category.label) + '</button>';
  }

  function renderCategories() {
    const pinnedFilter = document.querySelector('#pinned-filter');
    const categoryStrip = document.querySelector('#category-strip');
    const mobileMenu = document.querySelector('#mobile-category-menu');

    if (!categories.length) return;

    if (pinnedFilter) {
      pinnedFilter.innerHTML = categoryButton(categories[0], 'page_categoryPill__6e0Jv page_categoryPillAll__3WpVz', 'aria-pressed');
    }

    if (categoryStrip) {
      categoryStrip.innerHTML = categories.slice(1).map(function (category) {
        return '<li>' + categoryButton(category, 'page_categoryPill__6e0Jv', 'aria-pressed') + '</li>';
      }).join('');
    }

    if (mobileMenu) {
      mobileMenu.innerHTML = categories.map(function (category) {
        return '<li><button class="page_categorySelectOption__BuVNz" type="button" data-filter="' + escapeHtml(category.id) + '" aria-selected="' + String(category.id === 'all') + '"><span class="page_categorySelectOptionLabel__V2eOU">' + escapeHtml(category.label) + '</span></button></li>';
      }).join('');
    }
  }

  function renderOffers() {
    const grid = document.querySelector('#offers-grid');
    if (!grid) return;

    grid.innerHTML = offers.map(function (offer) {
      const href = getOfferHref(offer);
      const linkAttrs = getExternalLinkAttrs(href);
      const image = getOfferImage(offer);
      const fallbackImage = cleanText(offer.fallbackImage) || 'assets/img/products/main/monjarim-card (1).svg';
      const badge = cleanText(offer.badge);
      const badgeMarkup = badge ? '    <div aria-hidden="true" class="lifelabs-cardBadge">' + escapeHtml(badge) + '</div>' : '';

      return [
        '<article class="page_storeCard__44TrQ lifelabs-product-card" data-image-treatment="plain" data-category="' + escapeHtml(offer.category) + '" data-search="' + escapeHtml(offer.search) + '">',
        '  <div class="page_storeMedia__E1Nu9">',
        '    <span class="page_storeImageFrame__tyb7e" style="background-image: url(' + escapeHtml(image) + ');"><img alt="' + escapeHtml(offer.name) + '" decoding="async" loading="eager" src="' + escapeHtml(image) + '" data-fallback-src="' + escapeHtml(fallbackImage) + '" width="520" height="390"></span>',
        badgeMarkup,
        '  </div>',
        '  <div class="page_storeBody__sOzSU">',
        '    <span class="lifelabs-cardCategory">' + escapeHtml(offer.categoryLabel) + '</span>',
        '    <h3 class="page_storeName___wboy"><a aria-label="Abrir página do produto ' + escapeHtml(offer.name) + '" class="page_storeCardLink__r7LA8" href="' + escapeHtml(href) + '"' + linkAttrs + '><span class="page_storeNameText__D7mG1">' + escapeHtml(offer.name) + '</span></a></h3>',
        '    <p class="page_storeDesc__Joqf9">' + escapeHtml(offer.description) + '</p>',
        '    <span aria-hidden="true" class="page_storeCta__RnP_m">Conhecer produto</span>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');

    grid.querySelectorAll('img[data-fallback-src]').forEach(function (image) {
      image.addEventListener('error', function () {
        if (image.dataset.fallbackSrc && image.src.indexOf(image.dataset.fallbackSrc) === -1) {
          image.src = image.dataset.fallbackSrc;
          if (image.parentElement) {
            image.parentElement.style.backgroundImage = 'url(' + image.dataset.fallbackSrc + ')';
          }
        }
      });
    });
  }

  renderCategories();
  renderOffers();
})();
