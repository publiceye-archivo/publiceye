/* Shared post template. Blogger API v3 posts can be passed to
   PubliceyeArticles.showBloggerPost(post). No account or API key required
   for the local sample; a live data connection is configured separately. */
(function () {
  'use strict';
  var sample = {
    title: 'How Japanese Breakfast Found Herself in Seoul',
    category: 'Music',
    subtitle: 'On music, memory, and the places we return to.',
    author: 'Publiceye',
    date: '',
    content: '<figure class="post-wide"><img src="images/optimized/row1-3.webp" alt="Musician beside a railway track"><figcaption>From the Publiceye image archive. Sample imagery.</figcaption></figure>' +
      '<p class="post-sample-note">Layout study. Original sample copy and archive imagery; not the SSENSE article.</p>' +
      '<p>Some records become inseparable from the places where we first heard them. A song carries a street, a season, a room. Years later, the opening notes can bring that whole scene back into focus.</p>' +
      '<p>Listening is a kind of collecting. We keep fragments of a voice, the space between instruments, the sound of a crowd before the first song. Together, they form a personal archive: less a complete history than a record of what stayed with us.</p>' +
      '<p>A city can work in the same way. Familiar streets accumulate new meanings each time we return. The place changes, and so do we. What once passed unnoticed becomes the detail we remember most clearly.</p>' +
      '<blockquote>A song can become a place we return to.</blockquote>' +
      '<p>To make something from those memories is to choose what deserves another look. The smallest detail can carry the most weight: a handwritten note, a photograph, a melody recorded before it disappears.</p>' +
      '<figure class="post-wide"><img src="images/optimized/row1-4.webp" alt="A distant range of snow-covered mountains" loading="lazy"><figcaption>Landscape study. From the Publiceye image archive.</figcaption></figure>' +
      '<h2>The things that stay</h2><p>An archive does not have to settle the meaning of an object. Sometimes its purpose is simply to keep the object available, to let someone encounter it again under different circumstances.</p>' +
      '<p>Music invites that kind of return. A recording stays still while the listener moves through life. We come back to the same sound with different questions, and discover something we could not have heard before.</p>' +
      '<p>What remains is not only the work itself, but the attention we give it. Looking, listening, returning: small acts that allow a familiar thing to become new again.</p>'
  };

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

  var posts = {sample: sample};
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
    registerPreview: function (issue) {
      // Existing mock entries stay explicitly identified as layout previews.
      posts[issue.id] = {
        title: issue.title,
        subtitle: '',
        content: '<figure class="post-wide"><img src="'+issue.image+'" alt="Publiceye archive image"><figcaption>From the Publiceye image archive.</figcaption></figure>'+
          '<p class="post-sample-note">Sample issue. Article text has not been added yet.</p>'
      };
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




