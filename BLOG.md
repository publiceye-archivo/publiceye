# Publiceye issues

Issues are stored entirely in this repository. There is no Blogger connection, API key, feed, synchronization job, or external content service.

## Add an issue

1. Copy `blog/issues/_template.html` and rename it with a short lowercase slug, for example `designing-the-future.html`.
2. Write the article body in that HTML file. Do not include `<html>`, `<head>`, or `<body>` tags.
3. Add one matching object to the `posts` array in `blog/issues.json`.

Example:

```json
{
  "posts": [
    {
      "id": "designing-the-future",
      "title": "Designing the Future",
      "subtitle": "An optional deck beneath the headline.",
      "published": "2026-11-02",
      "image": "images/issues/designing-the-future-cover.webp",
      "labels": ["Design"],
      "author": "Publiceye",
      "contentFile": "blog/issues/designing-the-future.html"
    }
  ]
}
```

The `id` must be unique. `image` controls the issue thumbnail, while `contentFile` points to the article HTML. The order in `issues.json` is the order shown on the Blog page.

## Supported article markup

The shared article design supports paragraphs, headings (`h2`–`h4`), links, lists, blockquotes, images, figures, captions, horizontal rules, and basic emphasis. Scripts, iframes, inline styles, event handlers, and embedded widgets are removed before display so every issue follows Publiceye’s CSS.

Preview through a local web server such as VS Code Live Server. Browser security prevents JSON and HTML `fetch()` calls when `index.html` is opened directly with a `file://` URL.
