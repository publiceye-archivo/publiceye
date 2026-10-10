/* ── Hero Eye Morph Animation ── */
function initHeroEyeMorph() {
  var gsap = window.gsap;
  var MorphSVGPlugin = window.MorphSVGPlugin;

  if (typeof gsap === 'undefined' || typeof MorphSVGPlugin === 'undefined') {
    return;
  }

  gsap.registerPlugin(MorphSVGPlugin);

  var oSvg = document.getElementById('heroOSvg');
  var textLeft = document.getElementById('heroTextLeft');
  var textRight = document.getElementById('heroTextRight');
  var startPaths = document.getElementById('startPaths');

  if (!oSvg || !textLeft || !textRight || !startPaths) return;

  var isEye = false;
  var animating = false;
  var morphDuration = 0.6;

  // Store the original eye path BEFORE gsap.set overwrites it
  var eyeOriginalPath = document.getElementById('start0').getAttribute('d');

  // Set initial state: morph #start0 to look like the circle (#end0)
  // This makes the SVG look like the letter "o"
  gsap.set("#start0", { morphSVG: "#end0" });

  function triggerBlink(callback) {
    startPaths.classList.add('blinking');
    setTimeout(function() {
      startPaths.classList.remove('blinking');
      if (callback) callback();
    }, 400);
  }

  function morphToEye() {
    if (isEye || animating) return;
    animating = true;
    isEye = true;

    // 1. Slide text apart to give room for the eye
    textLeft.classList.add('spread');
    textRight.classList.add('spread');

    // 2. Morph from circle (o) to eye shape
    gsap.to("#start0", {
      duration: morphDuration,
      morphSVG: eyeOriginalPath,
      ease: "power3.inOut",
      onComplete: function() {
        animating = false;
        // 3. After morph completes, blink once, then morph back
        setTimeout(function() {
          triggerBlink(function() {
            setTimeout(function() {
              morphToO();
            }, 250);
          });
        }, 400);
      }
    });
  }

  function morphToO() {
    if (!isEye || animating) return;
    animating = true;

    // 1. Slide text back together AT THE SAME TIME as the morph
    textLeft.classList.remove('spread');
    textRight.classList.remove('spread');

    // 2. Morph from eye back to circle (o)
    gsap.to("#start0", {
      duration: morphDuration,
      morphSVG: "#end0",
      ease: "power3.inOut",
      onComplete: function() {
        isEye = false;
        animating = false;
      }
    });
  }

  // Repeating cycle: wait -> morph to eye -> blink -> morph back -> wait -> repeat
  function scheduleCycle() {
    setTimeout(function() {
      morphToEye();
      // Schedule next cycle after this one completes (~2.5s total)
      setTimeout(scheduleCycle, 3500);
    }, 6000);
  }

  scheduleCycle();
}

function init(){
  render();
  renderBlog();
  loadBlogPosts();
  initSearch();
  initItemDetail();
  applyTheme('light');

  // Set the initial active page
  var initialHash=location.hash.replace(/^#/,'');
  if(PAGES.concat(AUX_PAGES).indexOf(initialHash)!==-1){
    state.currentPage=initialHash;
  }
  showPage(state.currentPage);
  if(window.PubliceyeComponents){
    window.PubliceyeComponents.bindPageLinks(showPage);
  }
  initArticle();

  window.addEventListener('popstate',function(){
    var page=location.hash.replace(/^#/,'');
    if(PAGES.concat(AUX_PAGES).indexOf(page)!==-1){
      showPage(page);
    }
  });

  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){
      if(state.themeMode==='system'){
        applyTheme('system');
      }
    });
  }

  // The actual scroll container flips between #pageBody (desktop) and
  // <body> itself (mobile, see getScrollWrapper) — always bind to whichever
  // one really scrolls rather than a fixed window/element split.
  var boundScrollTarget=null;

  function onScroll(){
  updateStickyDecadeTitle();
  }

  function bindScrollListener(){
    var target=getScrollWrapper();
    if(boundScrollTarget===target) return;
    if(boundScrollTarget) boundScrollTarget.removeEventListener('scroll',onScroll);
    target.addEventListener('scroll',onScroll,{passive:true});
    boundScrollTarget=target;
  }

  bindScrollListener();

  window.addEventListener('resize',function(){
  bindScrollListener();
  setupSmoothScroll();
  });

  setupSmoothScroll();

  document.getElementById('decadeToggle').addEventListener('click',function(e){
    e.stopPropagation(); // header row handles it; stop double-fire
  });

  document.getElementById('modeBtn').addEventListener('click',function(e){
    e.stopPropagation();
    state.modeOpen=!state.modeOpen;
    state.dropdownOpen=false;
    state.pagesOpen=false;
    render();
  });

  document.getElementById('pagesBtn').addEventListener('click',function(e){
    e.stopPropagation();
    state.pagesOpen=!state.pagesOpen;
    state.modeOpen=false;
    state.dropdownOpen=false;
    render();
  });

  /* ── Decade header row click (title + button both toggle dropdown) ── */
  document.getElementById('decadeHeader').addEventListener('click',function(){
    state.dropdownOpen=!state.dropdownOpen;
    state.modeOpen=false;
    render();
  });

  /* ── Hamburger / mobile menu ── */
  document.getElementById('hamburgerBtn').addEventListener('click',function(){
    document.getElementById('mobileMenu').classList.add('open');
    document.body.style.overflow='hidden';
    renderMobileMenu();
  });

  document.getElementById('mobileMenuClose').addEventListener('click',function(){
    document.getElementById('mobileMenu').classList.remove('open');
    document.body.style.overflow='';
  });

  document.getElementById('mobileDetailBack').addEventListener('click',closeMobileDetail);

  var eyeContainer=document.getElementById('logoEye');
  if(eyeContainer){
    createEyeLogo(eyeContainer,68);
  }

  /* ── Logo brand morph animation ── */
  (function(){
    var text1=document.getElementById('morphText1');
    var text2=document.getElementById('morphText2');
    var header=document.getElementById('siteHeader');
    if(!text1||!text2||!header) return;

    var morphTime=1.2;
    // progress: 0 = hidden (blank), 1 = fully revealed ("Publiceye")
    var progress=0;
    var targetProgress=0;
    var time=Date.now();
    var rafId=null;

    // text1 always = blank space, text2 always = "Publiceye"
    // We just control their opacity/blur based on progress
    text1.textContent='\u00A0';
    text2.textContent='Publiceye';

    function applyProgress(p){
      var fClamp=Math.max(p,0.001);
      var inv=Math.max(1-p,0.001);

      // text2 = "Publiceye" fades in as p goes to 1
      text2.style.filter='blur('+Math.min(8/fClamp-8,100)+'px)';
      text2.style.opacity=String(Math.pow(fClamp,0.4)*100)+'%';

      // text1 = blank fades out as p goes to 1
      text1.style.filter='blur('+Math.min(8/inv-8,100)+'px)';
      text1.style.opacity=String(Math.pow(inv,0.4)*100)+'%';
    }

    // Initial state: fully hidden
    applyProgress(0);

    function animate(){
      rafId=requestAnimationFrame(animate);

      var now=Date.now();
      var dt=(now-time)/1000;
      time=now;

      var speed=dt/morphTime;

      if(targetProgress>progress){
        progress=Math.min(progress+speed, targetProgress);
      } else {
        progress=Math.max(progress-speed, targetProgress);
      }

      applyProgress(progress);

      // Stop when we've reached the target
      if(Math.abs(progress-targetProgress)<0.001){
        progress=targetProgress;
        applyProgress(progress);
        cancelAnimationFrame(rafId);
        rafId=null;
      }
    }

    function setTarget(t){
      targetProgress=t;
      time=Date.now();
      if(!rafId){
        rafId=requestAnimationFrame(animate);
      }
    }

    header.addEventListener('mouseenter',function(){
      setTarget(1);
    });

    header.addEventListener('mouseleave',function(){
      setTarget(0);
    });
  })();
  /* ── End logo brand morph ── */

  /* ── Init hero eye morph ── */
  initHeroEyeMorph();

  document.addEventListener('click',function(e){
    if(!e.target.closest('.mode-wrap')){
      state.modeOpen=false;
      document.getElementById('modeBtn').className='mode-btn';
      document.getElementById('modeDropdown').className='mode-dropdown';
    }
    if(!e.target.closest('.pages-wrap')){
      state.pagesOpen=false;
      document.getElementById('pagesBtn').className='pages-btn';
      document.getElementById('pagesDropdown').className='pages-dropdown';
    }
    if(!e.target.closest('.decade-header')&&!e.target.closest('.decade-dropdown')){
      state.dropdownOpen=false;
      document.getElementById('decadeToggle').className='decade-toggle';
      document.getElementById('decadeDropdown').className='decade-dropdown';
    }
  });
}



document.addEventListener('DOMContentLoaded',init);
