import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BLOG_HOST = process.env.BLOGGER_HOST || 'publiceye-archive.blogspot.com';
const OUTPUT = resolve(process.env.BLOGGER_OUTPUT || 'data/blog-posts.json');
const feedUrl = `https://${BLOG_HOST}/feeds/posts/default?alt=json&max-results=100`;

const response = await fetch(feedUrl);
if (!response.ok) throw new Error(`Blogger feed returned ${response.status}`);
const feed = await response.json();

function text(value) {
  return value && typeof value.$t === 'string' ? value.$t : '';
}

function firstImage(html) {
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
}

const posts = (feed.feed?.entry || []).map((entry) => {
  const content = text(entry.content) || text(entry.summary);
  const alternate = (entry.link || []).find((link) => link.rel === 'alternate');
  const id = text(entry.id).split('.post-').pop();
  return {
    id,
    title: text(entry.title) || 'Untitled',
    content,
    published: text(entry.published),
    updated: text(entry.updated),
    url: alternate?.href || '',
    image: firstImage(content),
    labels: (entry.category || []).map((category) => category.term).filter(Boolean),
    author: { displayName: text(entry.author?.[0]?.name) }
  };
});

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify({ source: feedUrl, syncedAt: new Date().toISOString(), posts }, null, 2)}\n`);
console.log(`Synced ${posts.length} Blogger post${posts.length === 1 ? '' : 's'} to ${OUTPUT}`);
