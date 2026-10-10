function renderPagesDropdown(){
  var el=document.getElementById('pagesDropdown');
  var html='';
  PAGES.forEach(function(p){
    html+='<div class="page-option'+(p===state.currentPage || (p==='blog' && state.currentPage==='article')?' active':'')+'" data-page="'+p+'">'+p+'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.page-option').forEach(function(opt){
    opt.addEventListener('click',function(e){
      e.stopPropagation();
      showPage(this.getAttribute('data-page'));
    });
  });
}

function pageElId(page){
  return 'page'+page.charAt(0).toUpperCase()+page.slice(1);
}

function showPage(page){
  if(page!=='article' && state.currentPage==='article' && location.hash.indexOf('#post/')===0){
    history.replaceState(null,'','#'+page);
    document.title='Publiceye';
  }
  state.currentPage=page;

  if(page!=='search'){
    var searchInput=document.getElementById('searchInput');
    var searchLink=document.getElementById('searchLink');
    if(searchInput) searchInput.classList.remove('active');
    if(searchLink) searchLink.classList.remove('hidden');
  }

  PAGES.concat(AUX_PAGES, ['itemDetail','article']).forEach(function(p){
    var el=document.getElementById(pageElId(p));
    if(el){ el.classList.toggle('active', p===page); }
  });

  // Sync labels (desktop + mobile)
  var deskLabel=document.getElementById('pagesBtnLabel');
  if(deskLabel) deskLabel.textContent=page==='article'?'blog':page;
  var mobLabel=document.getElementById('mobilePagesLabel');
  if(mobLabel) mobLabel.textContent=page==='article'?'blog':page;

  // Close the pages dropdown
  state.pagesOpen=false;
  document.getElementById('pagesBtn').className='pages-btn';
  document.getElementById('pagesDropdown').className='pages-dropdown';

  // Close the mobile menu if open
  var mobileMenu=document.getElementById('mobileMenu');
  if(mobileMenu && mobileMenu.classList.contains('open')){
    mobileMenu.classList.remove('open');
    document.body.style.overflow='';
  }

  // Scroll back to top on navigation, on whichever element actually scrolls
  if(lenisInstance){
    lenisInstance.scrollTo(0,{immediate:true});
  } else {
    getScrollWrapper().scrollTop=0;
  }
  window.scrollTo(0,0);

  renderPagesDropdown();
}

var BLOG_POSTS=[];

function blogDate(value){
  var date=new Date(value);
  return isNaN(date.getTime())?'':date.toLocaleDateString('en-US',{month:'short',year:'numeric'});
}

function renderBlog(){
  var el=document.getElementById('blogList');
  if(!el) return;
  el.replaceChildren();
  var issues=BLOG_POSTS;
  if(!issues.length){
    var empty=document.createElement('p');
    empty.className='search-empty';
    empty.textContent='No issues have been published yet.';
    el.appendChild(empty);
    return;
  }
  issues.forEach(function(post,i){
    var card=document.createElement('a');
    card.className='issue-card';
    card.href='#post/'+post.id;
    var image=document.createElement('img');
    image.className='issue-cover';
    image.src=post.image||'images/optimized/row1-3.webp';
    image.alt='';
    image.loading=i<3?'eager':'lazy';
    image.decoding='async';
    var caption=document.createElement('div');
    caption.className='issue-caption';
    var text=document.createElement('div');
    var title=document.createElement('h2');
    title.className='issue-title';
    title.textContent=post.title;
    var date=document.createElement('p');
    date.className='issue-date';
    var label=document.createElement('span');
    label.textContent='Issue';
    var month=document.createElement('span');
    month.textContent=blogDate(post.published||post.date);
    date.append(label,month);
    text.append(title);
    caption.append(text,date);
    card.append(image,caption);
    el.appendChild(card);
  });
}

function loadBlogPosts(){
  return fetch('data/blog-posts.json',{cache:'no-cache'})
    .then(function(response){
      if(!response.ok) throw new Error('Blog data unavailable');
      return response.json();
    })
    .then(function(data){
      BLOG_POSTS=Array.isArray(data.posts)?data.posts:[];
      if(window.PubliceyeArticles) window.PubliceyeArticles.registerPosts(BLOG_POSTS);
      renderBlog();
      return BLOG_POSTS;
    })
    .catch(function(){
      BLOG_POSTS=[];
      renderBlog();
      return BLOG_POSTS;
    });
}

function renderMobileMenu(){
  /* Pages mobile dropdown */
  var mPagesBtn=document.getElementById('mobilePagesBtn');
  var mPagesItems=document.getElementById('mobilePagesItems');
  var mPagesLabel=document.getElementById('mobilePagesLabel');
  if(!mPagesBtn||!mPagesItems) return;

  mPagesLabel.textContent=state.currentPage==='article'?'blog':state.currentPage;

  // Toggle
  mPagesBtn.onclick=function(){
    var isOpen=mPagesItems.classList.contains('open');
    mPagesItems.className='mobile-dropdown-items'+(isOpen?'':' open');
    mPagesBtn.className='mobile-dropdown-btn'+(isOpen?'':' open');
  };

  // Build page options
  var pHtml='';
  PAGES.forEach(function(p){
    pHtml+='<div class="mobile-dropdown-item'+(p===state.currentPage || (p==='blog' && state.currentPage==='article')?' active':'')+'" data-page="'+p+'">'+p+'</div>';
  });
  mPagesItems.innerHTML=pHtml;
  mPagesItems.querySelectorAll('.mobile-dropdown-item').forEach(function(opt){
    opt.addEventListener('click',function(){
      mPagesItems.className='mobile-dropdown-items';
      mPagesBtn.className='mobile-dropdown-btn';
      showPage(this.getAttribute('data-page'));
    });
  });

  /* Mode mobile dropdown */
  var mModeBtn=document.getElementById('mobileModeBtn');
  var mModeItems=document.getElementById('mobileModeItems');
  var mModeBtnLabel=document.getElementById('mobileModeBtnLabel');
  if(!mModeBtn||!mModeItems) return;

  mModeBtnLabel.textContent=state.themeMode;

  mModeBtn.onclick=function(){
    var isOpen=mModeItems.classList.contains('open');
    mModeItems.className='mobile-dropdown-items'+(isOpen?'':' open');
    mModeBtn.className='mobile-dropdown-btn'+(isOpen?'':' open');
  };

  var mHtml='';
  MODES.forEach(function(m){
    mHtml+='<div class="mobile-dropdown-item'+(m===state.themeMode?' active':'')+'" data-mode="'+m+'">'+m+'</div>';
  });
  mModeItems.innerHTML=mHtml;
  mModeItems.querySelectorAll('.mobile-dropdown-item').forEach(function(opt){
    opt.addEventListener('click',function(){
      var mode=this.getAttribute('data-mode');
      applyTheme(mode);
      mModeBtnLabel.textContent=mode;
      mModeItems.className='mobile-dropdown-items';
      mModeBtn.className='mobile-dropdown-btn';
      renderModeDropdown();
    });
  });
}

function renderDecadeDropdown(){
  var el=document.getElementById('decadeDropdown');
  var html='';
  DECADES.forEach(function(d,i){
    html+='<div class="decade-option'+(i===state.currentDecade?' active':'')+'" data-idx="'+i+'">'+d.id+'</div>';
  });
  el.innerHTML=html;
  el.querySelectorAll('.decade-option').forEach(function(opt){
    opt.addEventListener('click',function(){
      state.currentDecade=parseInt(this.getAttribute('data-idx'));
      state.currentItem=0;
      state.dropdownOpen=false;
      render();
      scrollToDecadeSection(state.currentDecade);
    });
  });
}

function scrollToDecadeSection(idx){
  var section=document.querySelector('[data-decade-section="'+idx+'"]');
  if(section){
    var stickyHeight=document.getElementById('decadeHeaderSticky').offsetHeight;
    var container=document.getElementById('pageBody');
    var offset;
    if(window.innerWidth>768){
      offset=section.offsetTop-stickyHeight;
      if(lenisInstance){
        lenisInstance.scrollTo(offset,{duration:1.1});
      } else {
        container.scrollTo({top:offset,behavior:'smooth'});
      }
    } else {
      offset=section.getBoundingClientRect().top+document.body.scrollTop-stickyHeight-60;
      if(lenisInstance){
        lenisInstance.scrollTo(offset,{duration:1.1});
      } else {
        document.body.scrollTo({top:offset,behavior:'smooth'});
      }
    }
  }
}
