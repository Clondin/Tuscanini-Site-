/** A kosher.com episode whose video is served from the public JW Player CDN. */
export interface KosherVideo {
  jw: string;
  title: string;
  /** The episode page on kosher.com. */
  url: string;
  /** Seconds. */
  duration: number;
  /** Progressive mp4 (up to 720p) on cdn.jwplayer.com. */
  mp4: string;
  date: string;
}

const JW = "https://cdn.jwplayer.com/";

export function kosherVideoPosterUrl(jw: string, width = 720): string {
  return `${JW}v2/media/${jw}/poster.jpg?width=${width}`;
}

export function kosherVideoHlsUrl(jw: string): string {
  return `${JW}manifests/${jw}.m3u8`;
}

export function formatVideoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export const KOSHER_COM_HOME = "https://www.kosher.com/";
