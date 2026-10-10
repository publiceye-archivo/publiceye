# Publiceye article template

Choose Blog in the top navigation and select any synchronized issue. The existing header, mode switch, and site footer are shared with every article.

## Blogger compatibility

Publiceye is connected to the public Blogger blog at `publiceye-archive.blogspot.com`. Run `node scripts/sync-blogger.mjs` to copy its published posts into `data/blog-posts.json`. The site reads that local file, so visitors do not make requests to Blogger or Google.

Compose English text in Blogger with paragraphs, headings, links, lists, images, and blockquotes. Inline Blogger fonts, colors, sizes, and positioning are deliberately removed so Publiceye controls the design in both modes. Scripts, iframes, and embedded widgets are excluded. Custom full-width images can use `<figure class="post-wide"><img src="https://…" alt="…"><figcaption>Caption</figcaption></figure>` in Blogger's HTML editor.

The GitHub Action in `.github/workflows/sync-blogger.yml` checks the feed hourly and can also be run manually from the Actions tab. When a published post changes, it commits the refreshed JSON; GitHub Pages then rebuilds normally. No Blogger password, OAuth token, or API key is stored in the repository.
