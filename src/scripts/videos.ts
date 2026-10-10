export type Video = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoUrl: string;
};

const FEED = 'https://yt.tsojka.com/youtube_playlist.json';

export async function loadVideos(): Promise<Video[]> {
  const res = await fetch(FEED);
  if (!res.ok) throw new Error(`Feed ${res.status}`);
  const data: Video[] = await res.json();
  return data.filter((v) => v.thumbnail && v.videoUrl);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });

const thumb = (v: Video, size: 'hq' | 'maxres' = 'hq') =>
  v.videoId ? `https://i.ytimg.com/vi/${encodeURIComponent(v.videoId)}/${size}default.jpg` : v.thumbnail;

export function videoCard(v: Video, i = 0, featured = false): string {
  const src = featured ? thumb(v, 'maxres') : thumb(v);
  const fallback = esc(v.thumbnail);
  return `
  <a class="vcard${featured ? ' vcard--featured' : ''}" href="${esc(v.videoUrl)}" target="_blank" rel="noopener noreferrer"
     data-cursor-text="Play" style="--d:${i % 6}">
    <span class="vcard-media">
      <img src="${esc(src)}" alt="" loading="lazy" decoding="async"
           ${featured ? `onerror="this.onerror=null;this.src='${fallback}'"` : ''} />
      <span class="vcard-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
    </span>
    <span class="vcard-body">
      <span class="vcard-meta mono">${featured ? '<span class="vcard-new">Neu</span>' : ''}${fmtDate(v.publishedAt)}</span>
      <span class="vcard-title">${esc(v.title)}</span>
    </span>
  </a>`;
}
