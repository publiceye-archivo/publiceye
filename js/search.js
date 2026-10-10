function initSearch(){
  var link=document.getElementById('searchLink');
  var input=document.getElementById('searchInput');
  var wrap=document.getElementById('searchWrap');
  var mobileInput=document.getElementById('mobileSearchInput');
  var results=document.getElementById('searchResults');
  var summary=document.getElementById('searchSummary');

  function normalized(value){
    return String(value||'').toLowerCase().trim();
  }

  function renderSearchResults(value){
    var query=normalized(value);
    results.replaceChildren();

    if(!query){
      summary.textContent='Enter a word, date, title, or subject.';
      return;
    }

    var wardrobe=[];
    DECADES.forEach(function(decade,di){
      decade.items.forEach(function(item,ii){
        var haystack=[decade.id,item.year,item.desc,item.credit].join(' ').toLowerCase();
        if(haystack.indexOf(query)!==-1){
          wardrobe.push({decade:decade,di:di,item:item,ii:ii});
        }
      });
    });

    var issues=(typeof BLOG_POSTS==='undefined'?[]:BLOG_POSTS).filter(function(post){
      return [post.title,blogDate(post.published),post.labels&&post.labels.join(' '),'blog issue journal'].join(' ').toLowerCase().indexOf(query)!==-1;
    });
    var total=wardrobe.length+issues.length;
    summary.textContent=total+' result'+(total===1?'':'s')+' for “'+value.trim()+'”';

    if(!total){
      var empty=document.createElement('p');
      empty.className='search-empty';
      empty.textContent='Nothing in the archive matches this search yet.';
      results.appendChild(empty);
      return;
    }

    function addGroup(title,items,renderer){
      if(!items.length) return;
      var section=document.createElement('section');
      section.className='search-group';
      var heading=document.createElement('div');
      heading.className='search-group-heading';
      heading.innerHTML='<h2>'+title+'</h2><span>'+items.length+'</span>';
      var grid=document.createElement('div');
      grid.className='search-result-grid';
      items.forEach(function(item){ grid.appendChild(renderer(item)); });
      section.append(heading,grid);
      results.appendChild(section);
    }

    addGroup('Wardrobe',wardrobe,function(result){
      var button=document.createElement('button');
      button.type='button';
      button.className='search-result-card';
      button.innerHTML='<img src="'+result.item.img+'" alt="" loading="lazy"><span class="search-result-type">'+result.decade.id+' · '+result.item.year+'</span><strong>'+result.item.desc+'</strong>';
      button.addEventListener('click',function(){ openItemDetail(result.di,result.ii); });
      return button;
    });

    addGroup('Issues',issues,function(post){
      var card=document.createElement('a');
      card.className='search-result-card';
      card.href='#post/'+post.id;
      card.innerHTML='<img src="'+(post.image||'images/optimized/row1-3.webp')+'" alt="" loading="lazy"><span class="search-result-type">Issue · '+blogDate(post.published)+'</span><strong>'+post.title+'</strong>';
      return card;
    });
  }

  function runSearch(value){
    input.value=value;
    mobileInput.value=value;
    showPage('search');
    renderSearchResults(value);
  }

  link.addEventListener('click',function(e){
    e.stopPropagation();
    link.classList.add('hidden');
    input.classList.add('active');
    input.focus();
  });

  input.addEventListener('click',function(e){
    e.stopPropagation();
  });

  input.addEventListener('input',function(){ runSearch(input.value); });
  mobileInput.addEventListener('input',function(){ input.value=mobileInput.value; });
  mobileInput.addEventListener('keydown',function(e){
    if(e.key==='Enter'){
      e.preventDefault();
      runSearch(mobileInput.value);
      document.getElementById('mobileMenu').classList.remove('open');
      document.body.style.overflow='';
    }
  });

  document.addEventListener('click',function(e){
    if(!wrap.contains(e.target)&&input.classList.contains('active')){
      input.classList.remove('active');
      link.classList.remove('hidden');
    }
  });
}
