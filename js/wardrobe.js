function renderThumbnails(){
  var area=document.getElementById('thumbsArea');
  var html='';
  DECADES.forEach(function(d,di){
    html+='<div class="decade-section" data-decade-section="'+di+'">';
    html+='<div class="decade-section-label">'+d.id+'</div>';
    html+='<div class="thumb-grid">';
    d.items.forEach(function(item,ii){
      var active=(di===state.currentDecade&&ii===state.currentItem)?' active':'';
      html+='<div class="thumb-cell'+active+'" data-d="'+di+'" data-i="'+ii+'">';
      html+='<img src="'+thumbUrl(di,ii)+'" alt="'+d.id+' - '+item.year+'" loading="lazy">';
      html+='</div>';
    });
    html+='</div></div>';
  });
  area.innerHTML=html;
  area.querySelectorAll('.thumb-cell').forEach(function(cell){
    cell.addEventListener('click',function(){
      var di=parseInt(this.getAttribute('data-d'));
      var ii=parseInt(this.getAttribute('data-i'));
      state.currentDecade=di;
      state.currentItem=ii;
      if(window.innerWidth<=768){
        showMobileDetail(di,ii);
      } else {
        updateActiveThumb();
        renderDetail();
      }
    });
  });
}

function updateActiveThumb(){
  document.querySelectorAll('.thumb-cell').forEach(function(cell){
    var di=parseInt(cell.getAttribute('data-d'));
    var ii=parseInt(cell.getAttribute('data-i'));
    if(di===state.currentDecade&&ii===state.currentItem){
      cell.classList.add('active');
    } else {
      cell.classList.remove('active');
    }
  });
}

function renderDetail(){
  var d=DECADES[state.currentDecade];
  var item=d.items[state.currentItem];
  document.getElementById('detailYear').textContent=item.year;
  document.getElementById('detailDesc').textContent=item.desc;
  document.getElementById('detailCredit').textContent=item.credit;
  document.getElementById('featuredImg').src=item.img;
  document.getElementById('featuredImg').alt=d.id+' - '+item.year;
}

/* ── Product-detail template ──
   Every item only ever needs {year, desc, credit, img}. Everything else
   (code, line, season, gender, collection, gallery) is DERIVED here, so
   adding a new look/garment to DECADES automatically gets a full detail
   page — no new page or template has to be created by hand. An item can
   optionally define its own `gallery: [...]` array of extra photo URLs;
   without one, additional angles are derived from the primary photo's seed
   so the layout always has photos to show. */
function deriveGalleryImages(item){
  if(item.gallery&&item.gallery.length) return item.gallery;
  var m=item.img.match(/seed\/([^/]+)/);
  if(!m) return [item.img,item.img];
  var base=m[1];
  return [
    item.img.replace(base,base+'-b'),
    item.img.replace(base,base+'-c')
  ];
}

/* Condition grades, best to worst. Nothing in the archive is graded below
   "Worn" — every piece is curated, so the scale never dips into poor
   condition. */
var GRADES=[
  {name:'New, Never Worn',color:'#7cc177',desc:'Unworn and unused. Original tags, packaging, and finishing are fully intact, with no signs of handling.'},
  {name:'Excellent',color:'#b7e6a4',desc:'Worn once or twice at most. No visible wear, flaws, or fading — looks and feels essentially new.'},
  {name:'Very Good',color:'#fbf69e',desc:'Gently worn with minimal signs of use. Any flaws are minor and do not affect structure, color, or appearance.'},
  {name:'Good',color:'#fbd9af',desc:'Noticeable signs of wear consistent with its age, such as light creasing or softened material, but structurally sound throughout.'},
  {name:'Worn',color:'#d6d6d6',desc:'Visible wear from regular use, including fading, texture change, or surface marks. Fully intact and wearable.'}
];

function getItemMeta(di,ii){
  var d=DECADES[di];
  var item=d.items[ii];
  var gender=(di+ii)%2===0?'Man':'Woman';
  var genderCode=gender==='Man'?'M':'W';
  var season=ii%2===0?'Spring-Summer':'Fall-Winter';
  var seasonCode=season==='Spring-Summer'?'SS':'FW';
  var serial=String(di*100+ii).padStart(4,'0');
  var compositions=['Jacket, Shirt, Trousers','Coat, Sweater, Trousers','Blazer, Shirt, Skirt','Dress, Belt','Jacket, Shirt, Trousers, Tie'];

  var gradeIndex=(di*3+ii*7)%GRADES.length;
  var sold=(di+ii)%3===0;
  var basePrice=Math.round((600+((di*211+ii*97)%2400))/10)*10;
  var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var soldYear=2022+((di+ii*3)%4);
  var soldMonth=months[(di*5+ii)%12];
  var soldPrice=Math.round(basePrice*(0.55+((di+ii)%5)*0.07)/10)*10;

  return {
    code:'GA_'+genderCode+'_'+seasonCode+'_'+item.year+'_'+serial,
    line:'Giorgio Armani',
    season:season,
    gender:gender,
    year:item.year,
    collection:'Giorgio Armani '+(gender==='Man'?'Menswear':'Womenswear')+' '+season+' '+item.year,
    description:item.desc,
    credit:item.credit,
    composition:compositions[(di+ii)%compositions.length],
    img:item.img,
    gallery:deriveGalleryImages(item),
    decadeId:d.id,
    grade:GRADES[gradeIndex],
    sold:sold,
    price:basePrice,
    soldPrice:soldPrice,
    soldDate:soldMonth+' '+soldYear
  };
}

function formatUSD(n){
  return '$'+n.toLocaleString('en-US');
}

function renderItemCommerce(meta){
  var actionEl=document.getElementById('itemDetailPurchaseAction');
  if(meta.sold){
    actionEl.innerHTML=
      '<div class="item-tooltip-wrap" tabindex="0">'
        +'<button class="sold-btn" type="button">Sold</button>'
        +'<div class="item-tooltip">Sold in '+meta.soldDate+' for '+formatUSD(meta.soldPrice)+'.</div>'
      +'</div>';
  }else{
    actionEl.innerHTML=
      '<button class="purchase-btn" type="button">Purchase — '+formatUSD(meta.price)+'</button>';
  }

  var gradeEl=document.getElementById('itemDetailGrade');
  gradeEl.innerHTML=
    '<span class="meta-label">Grade</span>'
    +'<span class="grade-value">'
      +'<span class="grade-swatch" style="background:'+meta.grade.color+'"></span>'
      +'<span class="item-tooltip-wrap grade-name-wrap" tabindex="0">'
        +'<span class="grade-name">'+meta.grade.name+'</span>'
        +'<div class="item-tooltip">'+meta.grade.desc+'</div>'
      +'</span>'
    +'</span>';
}

function renderItemGallery(meta){
  var el=document.getElementById('itemDetailGallery');
  var html='';
  meta.gallery.forEach(function(src,i){
    html+='<div class="item-detail-gallery-cell">'
      +'<img src="'+src+'" alt="'+meta.decadeId+' - '+meta.year+' detail view '+(i+2)+'" loading="lazy">'
      +'</div>';
  });
  el.innerHTML=html;
}

function renderItemExplore(meta,di){
  document.getElementById('itemDetailExploreTitle').innerHTML=
    'Explore our<br>'+meta.collection;
  var img=document.getElementById('itemDetailExploreImg');
  img.src=thumbUrl(di,0);
  img.alt=meta.collection;
}

function openItemDetail(di,ii){
  var meta=getItemMeta(di,ii);
  document.getElementById('itemDetailImg').src=meta.img;
  document.getElementById('itemDetailImg').alt=meta.decadeId+' - '+meta.year;
  document.getElementById('itemDetailCode').textContent=meta.code;
  document.getElementById('itemDetailLine').textContent=meta.line;
  document.getElementById('itemDetailSeason').textContent=meta.season;
  document.getElementById('itemDetailGender').textContent=meta.gender;
  document.getElementById('itemDetailYear').textContent=meta.year;
  document.getElementById('itemDetailDesc').textContent=meta.description;
  renderItemCommerce(meta);
  renderItemGallery(meta);
  renderItemExplore(meta,di);

  state.previousPage=state.currentPage;
  PAGES.concat(AUX_PAGES, ['itemDetail','article']).forEach(function(p){
    var pel=document.getElementById(pageElId(p));
    if(pel) pel.classList.toggle('active', p==='itemDetail');
  });
  var pb=document.getElementById('pageBody');
  if(pb) pb.scrollTop=0;
  window.scrollTo(0,0);
  location.hash='item-'+di+'-'+ii;
}

function closeItemDetail(){
  showPage(state.previousPage||'wardrobe');
  if(location.hash.indexOf('#item-')===0){
    history.replaceState(null,'',location.pathname+location.search);
  }
}

function initItemDetail(){
  document.getElementById('viewDetailsBtn').addEventListener('click',function(){
    openItemDetail(state.currentDecade,state.currentItem);
  });
  document.getElementById('itemDetailBack').addEventListener('click',closeItemDetail);
  document.getElementById('itemDetailExploreBtn').addEventListener('click',function(){
    var di=state.currentDecade;
    showPage('wardrobe');
    state.currentDecade=di;
    render();
    setTimeout(function(){ scrollToDecadeSection(di); },50);
  });

  // Deep-link support: #item-<decadeIdx>-<itemIdx>
  var m=location.hash.match(/^#item-(\d+)-(\d+)$/);
  if(m){
    var di=parseInt(m[1]),ii=parseInt(m[2]);
    if(DECADES[di]&&DECADES[di].items[ii]){
      state.currentDecade=di;
      state.currentItem=ii;
      state.previousPage='wardrobe';
      openItemDetail(di,ii);
    }
  }
}

function updateStickyDecadeTitle(){
  var sections=document.querySelectorAll('[data-decade-section]');
  var stickyEl=document.getElementById('decadeHeaderSticky');
  var stickyBottom=stickyEl.getBoundingClientRect().bottom;

  var currentVisibleIdx=0;
  sections.forEach(function(section){
    var rect=section.getBoundingClientRect();
    if(rect.top<stickyBottom+50){
      currentVisibleIdx=parseInt(section.getAttribute('data-decade-section'));
    }
  });

  if(currentVisibleIdx!==state.visibleDecade){
    state.visibleDecade=currentVisibleIdx;
    document.getElementById('decadeTitle').textContent=DECADES[currentVisibleIdx].id;
  }
}

function render(){
  document.getElementById('decadeTitle').textContent=DECADES[state.currentDecade].id;
  state.visibleDecade=state.currentDecade;

  var toggleEl=document.getElementById('decadeToggle');
  toggleEl.className='decade-toggle'+(state.dropdownOpen?' open':'');

  var ddEl=document.getElementById('decadeDropdown');
  ddEl.className='decade-dropdown'+(state.dropdownOpen?' open':'');

  var modeBtnEl=document.getElementById('modeBtn');
  modeBtnEl.className='mode-btn'+(state.modeOpen?' open':'');

  var modeDdEl=document.getElementById('modeDropdown');
  modeDdEl.className='mode-dropdown'+(state.modeOpen?' open':'');

  var pagesBtnEl=document.getElementById('pagesBtn');
  pagesBtnEl.className='pages-btn'+(state.pagesOpen?' open':'');
  document.getElementById('pagesBtnLabel').textContent=state.currentPage==='article'?'blog':state.currentPage;

  var pagesDdEl=document.getElementById('pagesDropdown');
  pagesDdEl.className='pages-dropdown'+(state.pagesOpen?' open':'');

  renderDecadeDropdown();
  renderModeDropdown();
  renderPagesDropdown();
  renderThumbnails();
  renderDetail();
}

function showMobileDetail(di,ii){
  var d=DECADES[di];
  var item=d.items[ii];
  var body=document.getElementById('mobileDetailBody');
  body.innerHTML='<img src="'+item.img+'" alt="'+d.id+' - '+item.year+'">'
    +'<div class="detail-year">'+item.year+'</div>'
    +'<div class="detail-desc">'+item.desc+'</div>'
    +'<div class="detail-credit">'+item.credit+'</div>'
    +'<button class="detail-view-btn" id="mobileViewDetailsBtn"><span>View full details</span><svg class="details-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true" focusable="false"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></button>';
  document.getElementById('mobileDetail').classList.add('open');
  document.body.style.overflow='hidden';

  document.getElementById('mobileViewDetailsBtn').addEventListener('click',function(){
    openItemDetail(di,ii);
  });
}

function closeMobileDetail(){
  document.getElementById('mobileDetail').classList.remove('open');
  document.body.style.overflow='';
}
