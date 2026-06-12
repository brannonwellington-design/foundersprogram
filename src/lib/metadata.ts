/** Production origin for absolute metadata URLs (Open Graph, Twitter, canonical). */
export const SITE_URL = "https://listenlabs.ai";

/**
 * App path on the main domain (empty in local dev). Keep in sync with
 * `BASE_PATH` / `NEXT_PUBLIC_BASE_PATH`.
 */
export const SITE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/founder-program";

export const SITE_TITLE = "Listen Future Founder Program";

export const SITE_DESCRIPTION =
  "A cohort program for exceptional talent at the beginning of their founding journey. When anyone can build, knowing what to build is everything.";

export const SITE_DESCRIPTION_SHORT =
  "A cohort program for exceptional talent at the beginning of their founding journey.";

/**
 * Landscape social share image (1200×630) — center crop of the hero art.
 * `basePath` is not auto-applied to metadata image URLs, so include SITE_PATH.
 */
export const SHARE_IMAGE = {
  path: `${SITE_PATH}/images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
} as const;
