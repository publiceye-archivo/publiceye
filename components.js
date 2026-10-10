(function () {
  'use strict';

  var footerPages = ['privacy', 'cookies', 'submissions', 'terms', 'contact', 'authors', 'extras'];

  var infoPages = {
    privacy: {
      title: 'Data Policy',
      intro: 'Publiceye is designed to be read without being watched. We do not track visitors, collect personal data, use cookies, build profiles, or algorithmically serve content.',
      sections: [
        ['No tracking or analytics', 'There are no analytics pixels, advertising trackers, fingerprinting scripts, or visitor profiles on Publiceye. We do not measure individual reading behavior or follow visitors across the web.'],
        ['No cookies or accounts', 'Publiceye does not set cookies, require an account, or store browsing preferences on a server. The archive is available without signing in or identifying yourself.'],
        ['No algorithmic feed', 'Content is selected, edited, and arranged by people. It is not personalized or ranked using data from visitors, advertisers, data brokers, social platforms, or other outside suppliers.'],
        ['Direct communication only', 'The only personal information Publiceye receives is information you deliberately send by email. It is used only to respond to that communication and is never sold or used to build a profile.'],
        ['External links', 'Links may lead to independent websites with their own practices. Publiceye does not transmit visitor profiles to those sites and is not responsible for what they collect after you choose to leave the archive.']
      ]
    },
    cookies: {
      title: 'Cookie Policy',
      intro: 'Publiceye does not use cookies.',
      sections: [
        ['How the site works', 'The archive is a static website. It does not set first-party cookies, use advertising cookies, or store visitor profiles.'],
        ['Third-party links', 'If you choose to leave Publiceye through an external link, the destination website may have its own cookie practices. Publiceye does not control those independent sites.'],
        ['Future changes', 'If a feature that requires cookies is ever proposed, this policy will be updated before that feature is introduced.']
      ]
    },
    submissions: {
      title: 'Submissions',
      intro: 'Publiceye welcomes material that adds context to the histories of fashion, film, music, objects, and visual culture.',
      sections: [
        ['What to send', 'Send a short description of the material, its approximate date, origin, creator or publisher, and why it belongs in the archive. Low-resolution reference images are enough for an initial review.'],
        ['Rights and attribution', 'Only submit material you own or are authorized to share. Include known credits and rights information. Submission does not guarantee publication or transfer ownership to Publiceye.'],
        ['Review', 'Every submission is reviewed for relevance, provenance, and available context. We may follow up for more information before deciding whether to catalogue or publish it.']
      ],
      action: ['Start a submission', 'mailto:publiceye.archive@gmail.com?subject=Publiceye%20submission']
    },
    terms: {
      title: 'Terms and Conditions',
      intro: 'By using Publiceye.blog, you agree to use the archive respectfully and lawfully.',
      sections: [
        ['Editorial material', 'Unless otherwise stated, Publiceye’s original writing, design, and catalogue information may not be republished commercially without permission.'],
        ['Third-party material', 'Images, marks, and referenced works remain the property of their respective rights holders. Their appearance is for archival, critical, and educational context and does not imply endorsement.'],
        ['Accuracy and availability', 'Archive records are revised as new information becomes available. Publiceye does not guarantee that every record is complete, error-free, or continuously available.'],
        ['Requests', 'For corrections, credit updates, rights questions, or removal requests, use the contact page and identify the relevant page or object.']
      ]
    },
    contact: {
      title: 'Contact Us',
      intro: 'For editorial questions, submissions, rights, corrections, and collaborations.',
      sections: [],
      contacts: [
        ['Email', 'publiceye.archive@gmail.com', 'mailto:publiceye.archive@gmail.com'],
        ['Submissions', 'publiceye.archive@gmail.com', 'mailto:publiceye.archive@gmail.com?subject=Publiceye%20submission']
      ]
    },
    authors: {
      title: 'Authors',
      intro: 'The people contributing research, writing, images, and editorial perspective to Publiceye.',
      sections: [
        ['Christian Piazzi', 'Contributor to Publiceye’s editorial archive. Full biography forthcoming.'],
        ['Isabella Hernandez', 'Contributor to Publiceye’s editorial archive. Full biography forthcoming.'],
        ['Isabella Messina', 'Contributor to Publiceye’s editorial archive. Full biography forthcoming.'],
        ['Ted Koller', 'Contributor to Publiceye’s editorial archive. Full biography forthcoming.']
      ]
    },
    extras: {
      title: 'Extras',
      intro: '',
      sections: [],
      links: [
        ['tedkoller.com', 'https://tedkoller.com/']
      ]
    }
  };

  function renderAbout() {
    var mount = document.getElementById('aboutPageMount');
    if (!mount) return;
    mount.innerHTML = `
      <section class="about-page">
        <h1 class="about-headline">We keep the record of how style was <em>made</em>, <em>worn</em>, and <em>remembered</em>.</h1>
        <div class="about-body">
          <div class="about-col">
            <p>Publiceye is an independent archive of fashion, film, music, objects, and design. We collect the evidence that conventional histories overlook: labels, contact sheets, press clippings, garments, advertisements, recordings, and the stories surrounding them.</p>
            <p>The archive is built to be seen. Material is researched, restored, credited, and placed back into context for designers, researchers, and anyone curious about how visual culture travels through time.</p>
          </div>
          <figure class="about-col about-feature">
            <img src="images/home/grid-6.png" alt="Archive material in context" loading="lazy" />
            <figcaption>Objects are preserved alongside the circumstances that gave them meaning.</figcaption>
          </figure>
        </div>

        <section class="about-callout">
          <p>Have an object, image, or story that belongs in the record?</p>
          <a href="#submissions" data-page-link="submissions">Make a submission</a>
        </section>
      </section>`;
  }

  function renderInfoPages() {
    document.querySelectorAll('[data-info-page]').forEach(function (mount) {
      var key = mount.getAttribute('data-info-page');
      var page = infoPages[key];
      if (!page) return;
      var sections = (page.sections || []).map(function (section) {
        return '<section class="info-section"><h2>' + section[0] + '</h2><p>' + section[1] + '</p></section>';
      }).join('');
      var contacts = (page.contacts || []).map(function (contact) {
        return '<a class="contact-line" href="' + contact[2] + '"><span>' + contact[0] + '</span><strong>' + contact[1] + '</strong></a>';
      }).join('');
      var links = (page.links || []).map(function (link) {
        var internal = link[2]
          ? ' data-page-link="' + link[2] + '"'
          : (link[1] === '#' ? ' aria-disabled="true"' : ' target="_blank" rel="noreferrer"');
        return '<a class="extras-link" href="' + link[1] + '"' + internal + '><span>' + link[0] + '</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7"/></svg></a>';
      }).join('');
      var action = page.action
        ? '<a class="info-action" href="' + page.action[1] + '">' + page.action[0] + '</a>'
        : '';
      if (key === 'extras') {
        mount.innerHTML = '<main class="info-page info-page--extras"><nav class="extras-links" aria-label="External links">' + links + '</nav></main>';
        return;
      }
      mount.innerHTML = '<main class="info-page info-page--' + key + '"><h1>' + page.title + '</h1><p class="info-intro">' + page.intro + '</p><div class="info-sections">' + sections + '</div><div class="contact-list">' + contacts + '</div>' + action + '<p class="info-updated">Last updated September 30, 2026</p></main>';
    });
  }

  function renderFooter() {
    var mount = document.getElementById('siteFooterMount');
    if (!mount) return;
    mount.innerHTML = `
      <footer class="footer">
        <div class="footer-row">
          <div class="footer-cell"><a href="#privacy" data-page-link="privacy">Data Policy</a></div>
          <div class="footer-cell"><a href="#submissions" data-page-link="submissions">Submissions</a></div>
          <div class="footer-cell"><a href="#authors" data-page-link="authors">Authors</a></div>
          <div class="footer-cell"><a href="#extras" data-page-link="extras">Extras</a></div>
        </div>
        <div class="footer-row">
          <div class="footer-cell"><a href="#contact" data-page-link="contact">Contact Us</a></div>
          <div class="footer-cell"><a href="#home" data-page-link="home">Publiceye.blog</a></div>
          <div class="footer-cell"><span>&#169;2027 Publiceye</span></div>
          <div class="footer-cell">
            <div class="footer-icons">
              <a href="https://www.instagram.com/publiceye.archive/" target="_blank" rel="noreferrer" aria-label="Publiceye on Instagram"><svg viewBox="-1 -1 26 26" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947C21.732 2.699 19.311.273 14.949.073 13.668.014 13.259 0 12 0zm0 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
              <a href="https://github.com/publiceye-archivo" target="_blank" rel="noreferrer" aria-label="Publiceye on GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.29-5.27-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.39-5.28 5.68.42.36.79 1.06.79 2.14v3.28c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7z"/></svg></a>
              <span class="footer-no-ai" title="No AI use" aria-label="No AI use"><img src="images/no-ai-use.png" alt="No AI use" /></span>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function bindPageLinks(showPage) {
    document.querySelectorAll('[data-page-link]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var page = link.getAttribute('data-page-link');
        history.pushState(null, '', '#' + page);
        showPage(page);
      });
    });
  }

  renderAbout();
  renderInfoPages();
  renderFooter();
  document.querySelectorAll('a[aria-disabled="true"]').forEach(function (link) {
    link.addEventListener('click', function (event) { event.preventDefault(); });
  });

  window.PubliceyeComponents = {
    footerPages: footerPages,
    bindPageLinks: bindPageLinks
  };
})();
