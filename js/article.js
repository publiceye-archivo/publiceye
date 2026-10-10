/* Shared article template. Blogger posts are synchronized into a local JSON
   file at build time, so reading an issue never contacts Blogger directly. */
(function () {
  'use strict';
  function safeUrl(value) {
    try {
      var url = new URL(value, location.href);
      return /^(https?:|file:)$/.test(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  }

  // Rebuild permitted editorial markup; discard scripts, embeds, styles,
  // event handlers, and arbitrary attributes from imported Blogger HTML.
  function cleanContent(html) {
    var parsed = new DOMParser().parseFromString(html || '', 'text/html');
    var allowed = /^(P|BR|STRONG|B|EM|I|U|S|H2|H3|H4|BLOCKQUOTE|UL|OL|LI|FIGURE|FIGCAPTION|IMG|A|DIV|SPAN|HR)$/;
    function copy(node) {
      if (node.nodeType === 3) return document.createTextNode(node.textContent);
      if (node.nodeType !== 1 || /^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|FORM|SVG|MATH|LINK|META)$/.test(node.tagName)) return document.createDocumentFragment();
      var el = allowed.test(node.tagName) ? document.createElement(node.tagName.toLowerCase()) : document.createDocumentFragment();
      if (node.tagName === 'IMG') {
        var src = safeUrl(node.getAttribute('src') || '');
        if (!src) return document.createDocumentFragment();
        el.src = src;
        el.alt = node.getAttribute('alt') || '';
        el.loading = 'lazy';
      }
      if (node.tagName === 'A') {
        var href = safeUrl(node.getAttribute('href') || '');
        if (href) el.href = href;
        el.rel = 'noopener noreferrer';
      }
      if (node.tagName === 'FIGURE' && node.classList.contains('post-wide')) el.className = 'post-wide';
      if (node.tagName === 'P' && node.classList.contains('post-sample-note')) el.className = 'post-sample-note';
      Array.from(node.childNodes).forEach(function (child) { el.appendChild(copy(child)); });
      return el;
    }
    var fragment = document.createDocumentFragment();
    Array.from(parsed.body.childNodes).forEach(function (node) { fragment.appendChild(copy(node)); });
    return fragment;
  }

  function render(post) {
    var root = document.getElementById('journalPost');
    root.innerHTML = '<nav class="post-nav" aria-label="Article navigation"><a class="back-link" href="#blog"><svg class="back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true" focusable="false"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg><span>Journal</span></a></nav>' +
      '<article><header class="post-header"><h1 id="postTitle" tabindex="-1"></h1><p class="post-deck" id="postDeck"></p><div class="post-credits" id="postCredits"><time id="postDate"></time></div></header><div class="post-body" id="postBody"></div></article>';
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postDeck').textContent = post.subtitle || '';
    document.getElementById('postDeck').hidden = !post.subtitle;
    var time = document.getElementById('postDate');
    var date = new Date(post.date);
    time.hidden = !post.date || isNaN(date.getTime());
    document.getElementById('postCredits').hidden = time.hidden;
    if (!time.hidden) {
      time.dateTime = date.toISOString();
      time.textContent = date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    }
    document.getElementById('postBody').appendChild(cleanContent(post.content));
    var firstImage = root.querySelector('img');
    if (firstImage) { firstImage.loading = 'eager'; firstImage.fetchPriority = 'high'; }
    showPage('article');
    document.title = post.title + ' — Publiceye';
    document.getElementById('postTitle').focus({preventScroll: true});
    if (typeof lenisInstance !== 'undefined' && lenisInstance) lenisInstance.resize();
  }

  var posts = {};
  function route() {
    if (location.hash.indexOf('#post/') === 0) {
      var id = location.hash.slice(6);
      if (posts[id]) render(posts[id]);
      else {
        showPage('blog');
      }
    } else if (location.hash === '#blog') showPage('blog');
  }
  window.PubliceyeArticles = {
    registerPosts: function (incoming) {
      (incoming || []).forEach(function (post) {
        posts[String(post.id)] = {
          title: post.title || 'Untitled',
          subtitle: post.subtitle || '',
          category: (post.labels || ['Journal'])[0],
          author: post.author && post.author.displayName,
          date: post.published,
          content: post.content || ''
        };
      });
      route();
    },
    showBloggerPost: function (post) {
      var id = encodeURIComponent(String(post.id));
      posts[id] = {
        title: post.title || 'Untitled',
        category: (post.labels || ['Journal'])[0],
        author: post.author && post.author.displayName,
        date: post.published,
        content: post.content || ''
      };
      if (location.hash === '#post/' + id) route();
      else location.hash = 'post/' + id;
    }
  };
  window.initArticle = function () {
    // Track the real header height across breakpoints and font/zoom changes.
    var header = document.querySelector('.header');
    function syncHeaderHeight() {
      if (header) document.documentElement.style.setProperty('--site-header-height', header.getBoundingClientRect().height + 'px');
    }
    syncHeaderHeight();
    if (header && window.ResizeObserver) new ResizeObserver(syncHeaderHeight).observe(header);
    else window.addEventListener('resize', syncHeaderHeight);
    window.addEventListener('hashchange', route);
    route();
  };
})();


