// Kosher.com episodes sponsored by Tuscanini ("Sponsored by Tuscanini" on the episode page), newest first.
// From the kosher.com Developer API (episodes search, cached 2026-10-22) and the public JW Player media
// feed (cdn.jwplayer.com/v2/media/<id>) for the 720p mp4 file and duration. Public fields only.
import type { KosherVideo } from "../lib/kosherVideo";

/** [JW media id, title, episode page on kosher.com, seconds, mp4 file on cdn.jwplayer.com/videos/, date] */
const rows: [string, string, string, number, string, string][] = [
["r3IPO2uo", "3 Ways to Enjoy Tuna (Without Drowning It in Mayo) with Jack", "https://www.kosher.com/video/3-ways-to-enjoy-tuna-on-chol-hamoed-without-drowning-it-in-mayo/", 130, "r3IPO2uo-tmb8rlSH.mp4", "2026-09-23"],
["o3JF7jV5", "You’ve Probably Been Using Capers Wrong with Jack", "https://www.kosher.com/video/youve-probably-been-using-capers-wrong-with-jack/", 129, "o3JF7jV5-tmb8rlSH.mp4", "2026-08-03"],
["3k9XNGyL", "The Secrets to Better Pasta", "https://www.kosher.com/video/the-secrets-to-better-pasta/", 470, "3k9XNGyL-tmb8rlSH.mp4", "2026-07-06"],
["dLhTsPjy", "The Creamiest Risotto with Shushy Turin", "https://www.kosher.com/video/creamy-risotto-with-shushy-turin/", 198, "dLhTsPjy-tmb8rlSH.mp4", "2026-05-20"],
["Ba2IGCNQ", "Bassie’s Steak with Chili Balsamic Glazed Mushrooms", "https://www.kosher.com/video/bassies-steak-with-chili-balsamic-glazed-mushrooms/", 249, "Ba2IGCNQ-tmb8rlSH.mp4", "2026-04-27"],
["Ds9CG52C", "The Ingredient That Goes on Anything with Jack", "https://www.kosher.com/video/the-ingredient-that-goes-onnything/", 137, "Ds9CG52C-tmb8rlSH.mp4", "2025-11-04"],
["MfM3hE8l", "How to Make Better Pizza with Jack", "https://www.kosher.com/video/how-to-make-better-pizza-with-jack/", 207, "MfM3hE8l-tmb8rlSH.mp4", "2025-09-09"],
["VsW3VR4d", "The Great Flour Showdown", "https://www.kosher.com/video/the-great-flour-showdown/", 808, "VsW3VR4d-tmb8rlSH.mp4", "2025-09-07"],
["lPboFVrB", "Back-to-School Overnight Oats", "https://www.kosher.com/video/back-to-school-overnight-oats/", 289, "lPboFVrB-tmb8rlSH.mp4", "2024-09-02"],
["0z7tGv1C", "Ruhama’s Moroccan Roasted Carrots", "https://www.kosher.com/video/ruhamas-moroccan-roasted-carrots/", 101, "0z7tGv1C-tmb8rlSH.mp4", "2024-04-15"],
["RExEcjCC", "The Finishing Touch with Mike Gershkovich", "https://www.kosher.com/video/the-finishing-touch-with-mike/", 192, "RExEcjCC-tmb8rlSH.mp4", "2024-04-03"],
];

export const tuscaniniKosherVideos: KosherVideo[] = rows.map(([jw, title, url, duration, mp4, date]) => ({
  jw,
  title,
  url,
  duration,
  mp4: `https://cdn.jwplayer.com/videos/${mp4}`,
  date,
}));
