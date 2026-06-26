(function(){
  'use strict';
  var affiliateUrl='COLE-SEU-LINK-DE-AFILIADO-AQUI';
  var params=new URLSearchParams(window.location.search);
  var allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
  function withParams(url){
    if(!url || url.indexOf('COLE-SEU-LINK')>-1) return url;
    var clean=new URL(url, window.location.href);
    allowed.forEach(function(key){ if(params.has(key)) clean.searchParams.set(key, params.get(key)); });
    return clean.toString();
  }
  document.querySelectorAll('[data-affiliate-link]').forEach(function(a){
    a.href=withParams(affiliateUrl);
    a.setAttribute('rel','nofollow sponsored noopener');
  });

  document.querySelectorAll('[data-ba-slider]').forEach(function(slider){
    var wrap=slider.querySelector('[data-ba-before-wrap]');
    var beforeImg=slider.querySelector('[data-ba-before]');
    var handle=slider.querySelector('[data-ba-handle]');
    var dragging=false;
    function setPos(clientX){
      var r=slider.getBoundingClientRect();
      var pct=Math.max(2,Math.min(98,((clientX-r.left)/r.width)*100));
      wrap.style.width=pct+'%';
      handle.style.left=pct+'%';
      beforeImg.style.width=(100/pct*100)+'%';
    }
    function start(e){dragging=true;slider.setPointerCapture && slider.setPointerCapture(e.pointerId);setPos(e.clientX);e.preventDefault();}
    function move(e){if(!dragging)return;setPos(e.clientX);e.preventDefault();}
    function end(){dragging=false;}
    slider.addEventListener('pointerdown',start);
    slider.addEventListener('pointermove',move);
    slider.addEventListener('pointerup',end);
    slider.addEventListener('pointercancel',end);
    setTimeout(function(){var r=slider.getBoundingClientRect();setPos(r.left+r.width/2);},100);
  });

  var modal=document.querySelector('[data-benefit-modal]');
  var modalTitle=document.querySelector('[data-benefit-title]');
  var modalText=document.querySelector('[data-benefit-text]');
  document.querySelectorAll('[data-benefit]').forEach(function(btn){
    btn.addEventListener('click',function(){
      modalTitle.textContent=btn.dataset.title || '';
      modalText.textContent=btn.dataset.text || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden','false');
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(function(btn){btn.addEventListener('click',closeModal);});
  if(modal){modal.addEventListener('click',function(e){if(e.target===modal) closeModal();});}
  document.addEventListener('keydown',function(e){if(e.key==='Escape') closeModal();});
  function closeModal(){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');}

  var sticky=document.querySelector('[data-sticky-cta]');
  if(sticky){
    window.addEventListener('scroll',function(){
      sticky.classList.toggle('is-visible', window.scrollY>560);
    },{passive:true});
  }
})();
