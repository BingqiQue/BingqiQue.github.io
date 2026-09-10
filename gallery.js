'use strict';
const gallery = document.getElementById('gallery');
const viewer = document.getElementById('viewer');
const viewerPhoto = document.getElementById('viewer-photo');
let selected = 0;
let opener;
const showPhoto = (index) => {
  selected = (index + PHOTOS.length) % PHOTOS.length;
  const photo = PHOTOS[selected];
  viewerPhoto.src = photo.src;
  viewerPhoto.alt = photo.alt;
  document.getElementById('viewer-title').textContent = `${photo.title} · 示例照片 / ${photo.author}`;
  document.getElementById('viewer-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(PHOTOS.length).padStart(2, '0')}`;
};
PHOTOS.forEach((photo, index) => {
  const figure = document.createElement('figure');
  figure.className = 'photo';
  const button = document.createElement('button');
  button.className = 'photo-button';
  button.type = 'button';
  button.setAttribute('aria-label', `查看大图：${photo.title}`);
  const img = new Image();
  img.src = photo.src;
  img.alt = photo.alt;
  img.loading = index === 0 ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (index === 0) img.fetchPriority = 'high';
  const hint = document.createElement('span');
  hint.className = 'zoom-hint';
  hint.textContent = '+';
  hint.setAttribute('aria-hidden', 'true');
  button.append(img, hint);
  button.addEventListener('click', () => { opener = button; showPhoto(index); viewer.showModal(); });
  const caption = document.createElement('figcaption');
  const title = document.createElement('div');
  title.className = 'photo-title';
  const number = document.createElement('span');
  number.className = 'photo-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const heading = document.createElement('h3');
  heading.textContent = photo.title;
  const english = document.createElement('span');
  english.textContent = photo.english;
  heading.append(english);
  title.append(number, heading);
  const credit = document.createElement('div');
  credit.className = 'credit';
  const source = document.createElement('a');
  source.href = photo.source;
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  source.textContent = `${photo.author} / Pexels`;
  credit.append(document.createTextNode('示例照片'), document.createElement('br'), source);
  caption.append(title, credit);
  figure.append(button, caption);
  gallery.append(figure);
});
document.querySelector('.close').addEventListener('click', () => viewer.close());
document.querySelector('.previous').addEventListener('click', () => showPhoto(selected - 1));
document.querySelector('.next').addEventListener('click', () => showPhoto(selected + 1));
viewer.addEventListener('close', () => opener?.focus());
viewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'list_photographs',
      title: '浏览摄影选集',
      description: '列出当前摄影选集中的照片标题、摄影师与来源。照片为展示样片。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('此工具不接受参数');
        return PHOTOS.map(({ title, author, source }) => ({ title, author, source, sample: true }));
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch {}
  addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}
