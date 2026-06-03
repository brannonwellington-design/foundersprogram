/**
 * Prefix for static assets in /public so they resolve correctly when the app is
 * served under a sub-path (e.g. /founder-program). Next.js prefixes its own
 * routes/chunks and next/link & next/image via `basePath`, but plain <img src>
 * and CSS url() are NOT auto-prefixed — route those through asset().
 *
 * IMPORTANT: keep BASE_PATH in sync with `basePath` in next.config.mjs.
 */
export const BASE_PATH = "/founder-program";

export const asset = (path: string): string => `${BASE_PATH}${path}`;
