/**
 * Season Pass availability window.
 *
 * The Season Pass subscription window closes on May 20 (IST) each year. After
 * the cutoff, suggestive / promotional surfaces (popup, cart banner, product
 * nudges, variety-grid tile) are hidden automatically. Explicit surfaces
 * (Home card, /maas page) still render but show a "season is over" state.
 *
 * Change SEASON_PASS_CUTOFF when the year rolls over.
 */

// 2026-05-20 23:59 IST (UTC+05:30) — end of day in India, gives the full day.
export const SEASON_PASS_CUTOFF = new Date("2026-05-20T23:59:00+05:30");

export function isSeasonPassActive(now = new Date()) {
  return now.getTime() < SEASON_PASS_CUTOFF.getTime();
}

/** Year shown on "season over" surfaces (home card, MaaS banner, etc). */
export const SEASON_OVER_YEAR = SEASON_PASS_CUTOFF.getFullYear();

/**
 * Human-readable cutoff label for UI ("20 May 2026, 11:59 PM IST").
 * Uses IST irrespective of the viewer's timezone so the displayed deadline
 * matches the business's actual closing moment.
 */
export const SEASON_PASS_CUTOFF_LABEL = formatInIST(SEASON_PASS_CUTOFF);

function formatInIST(d) {
  // Intl lets us pin the formatter to Asia/Kolkata even if the user is abroad.
  const date = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(d);
  return `${date} · ${time} IST`;
}

/**
 * Returns { days, hours, minutes } remaining until the cutoff, or null if past.
 * Consumed by the MaaS page countdown banner.
 */
export function timeUntilCutoff(now = new Date()) {
  const ms = SEASON_PASS_CUTOFF.getTime() - now.getTime();
  if (ms <= 0) return null;
  const days    = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours   = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return { days, hours, minutes };
}
