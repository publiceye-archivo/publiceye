/* ── Smooth momentum scrolling, site-wide ──
   Above 768px the layout scrolls a custom container (#pageBody), not the
   window. Below 768px, <body> itself switches to overflow:auto and
   becomes the scroll container (the window/<html> never actually scrolls
   at that breakpoint — see the mobile rules on .page-body/body). Lenis is
   pointed at whichever element is the real scroll container so mouse-wheel
   input gets eased momentum everywhere; touch input is left alone
   (syncTouch:false) so real touchscreens keep their native feel. The
   instance is torn down and recreated whenever this boundary is crossed
   (e.g. on resize) since the scroll target itself changes. */
var lenisInstance=null;
var lenisIsDesktopMode=null;

function getScrollWrapper(){
  return window.innerWidth>768?document.getElementById('pageBody'):document.body;
}

function setupSmoothScroll(){
  if(typeof Lenis==='undefined') return;
  var wrapper=getScrollWrapper();
  if(!wrapper) return;

  var isDesktop=window.innerWidth>768;
  if(lenisInstance && lenisIsDesktopMode===isDesktop) return;

  if(lenisInstance){
    lenisInstance.destroy();
    lenisInstance=null;
  }

  lenisIsDesktopMode=isDesktop;
  lenisInstance=new Lenis({
    wrapper:wrapper,
    content:wrapper,
    smoothWheel:true,
    syncTouch:false,
    // lerp (continuous exponential smoothing) — not duration/easing — is
    // the right mode for wheel-driven momentum. duration/easing replays a
    // fixed tween on every wheel tick, which stutters/fights itself under
    // rapid continuous scrolling; lerp blends each new tick into the
    // current velocity, which is what reads as smooth. duration/easing
    // are still used, separately, for the explicit scrollTo() jumps below.
    lerp:0.12,
    wheelMultiplier:1
  });

  requestAnimationFrame(function raf(time){
    if(!lenisInstance) return;
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  });

  observePageContentForLenis();
}

/* Lenis is given the same element as both `wrapper` and `content`
   (#pageBody), so its own internal ResizeObserver watches #pageBody's own
   box — which stays a fixed viewport height — and never notices that the
   actual scrollable height changed underneath it. That leaves Lenis's
   cached scroll limit stale after any content swap (page navigation,
   decade selection, item detail render), silently capping wheel-driven
   scroll at whatever height happened to exist when Lenis was constructed.
   Watching every .page-view panel directly (they flip from
   display:none, height 0, to their real rendered height whenever shown
   or re-rendered) and asking Lenis to recompute its dimensions on every
   such change keeps it in sync with reality without needing every render
   call site to remember to do it manually. */
var lenisResizeObserver=null;
function observePageContentForLenis(){
  if(typeof ResizeObserver==='undefined') return;
  if(lenisResizeObserver){ lenisResizeObserver.disconnect(); }
  lenisResizeObserver=new ResizeObserver(function(){
    if(lenisInstance) lenisInstance.resize();
  });
  document.querySelectorAll('.page-view').forEach(function(el){
    lenisResizeObserver.observe(el);
  });
}

function getScrollTop(){
  var wrapper=getScrollWrapper();
  return wrapper?wrapper.scrollTop:0;
}

function thumbUrl(decadeIdx,itemIdx){
  return 'https://picsum.photos/seed/t'+decadeIdx+'-'+itemIdx+'/400/500';
}

function applyTheme(mode){
  state.themeMode=mode;
  var body=document.body;

  if(mode==='dark'){
    body.classList.add('dark');
  } else if(mode==='system'){
    var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(prefersDark){
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  } else {
    body.classList.remove('dark');
  }

  updateModeDropdown();
}

function updateModeDropdown(){
  var options=document.querySelectorAll('.mode-option');
  options.forEach(function(opt){
    if(opt.getAttribute('data-mode')===state.themeMode){
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });
}

function renderModeDropdown(){
  var el=document.getElementById('modeDropdown');
  var html='';
  MODES.forEach(function(m){
    html+='<div class="mode-option'+(m===state.themeMode?' active':'')+'" data-mode="'+m+'">'+m+'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.mode-option').forEach(function(opt){
    opt.addEventListener('click',function(e){
      e.stopPropagation();
      var mode=this.getAttribute('data-mode');
      applyTheme(mode);
      state.modeOpen=false;
      document.getElementById('modeBtn').className='mode-btn';
      document.getElementById('modeDropdown').className='mode-dropdown';
    });
  });
}
