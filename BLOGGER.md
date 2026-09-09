# Publiceye article template

Open `index.html#post/sample` to preview the article, or choose Blog in the top navigation and select the sample article. The existing header, mode switch, and site footer are shared with every article.

The sample uses the SSENSE reference title with original placeholder prose and supplied archive images. It does not reproduce the source article or claim those images depict Japanese Breakfast. Replace the sample with your own content before publishing.

## Blogger compatibility

`article.js` exposes `PubliceyeArticles.showBloggerPost(post)`. Pass it a Blogger API v3 Post object. It maps `title`, `labels`, `author.displayName`, `published`, and `content` into the shared template. Every imported article gets the same typography, image treatment, header, and footer.

Compose English text in Blogger with paragraphs, headings, links, lists, images, and blockquotes. Inline Blogger fonts, colors, sizes, and positioning are deliberately removed so Publiceye controls the design in both modes. Scripts, iframes, and embedded widgets are excluded. Custom full-width images can use `<figure class="post-wide"><img src="https://…" alt="…"><figcaption>Caption</figcaption></figure>` in Blogger's HTML editor.

This delivery is the post template and adapter, not a connected Blogger feed or Blogger XML theme. No blog address or credentials have been supplied. The next integration step is fetching the public blog's posts and passing the selected post to this adapter. Live post IDs are held in memory for now; restoring live articles after a reload requires fetching that post by ID. The local sample link already works on reload.
