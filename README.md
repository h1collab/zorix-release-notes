# Zorix Release Notes

Static GitHub Pages release-notes site. No build step required.

## Files

- `index.html` — layout, styling, filtering/search UI
- `releases.js` — release-note data only
- `rss.xml` — RSS feed
- `.nojekyll` — GitHub Pages compatibility

## Add a release

Edit `releases.js` and add an object to `window.ZORIX_RELEASES`. Example:

```js
{
  date: '2026-08-30',
  cat: 'Platform',
  status: 'Released',
  title: 'Release title',
  body: 'Release description.',
  bullets: ['Optional detail']
}
```

GitHub Pages will load `releases.js` directly. You normally do not need to edit `index.html` when adding release notes.
