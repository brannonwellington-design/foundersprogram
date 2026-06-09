/** Split copy on whitespace for word-level masks. */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Group word elements by visual line using offsetTop.
 * `wordEls` must be in the same order as `words`.
 */
export function groupWordsIntoLines(
  wordEls: HTMLElement[],
  words: string[],
): string[] {
  if (!wordEls.length) return [];

  const groups: string[][] = [];
  let current: string[] = [];
  let lastTop = -1;

  wordEls.forEach((el, i) => {
    const top = el.offsetTop;
    if (lastTop !== -1 && Math.abs(top - lastTop) > 1) {
      groups.push(current);
      current = [];
    }
    current.push(words[i] ?? el.textContent ?? "");
    lastTop = top;
  });

  if (current.length) groups.push(current);
  return groups.map((g) => g.join(" "));
}

/** Default clip — room for descenders (display type, nav links). */
export const MASK_CLIP =
  "inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom";

/** Tighter clip for labels, names, and single-line UI copy. */
export const MASK_CLIP_TIGHT = "inline-block overflow-hidden";

export const MASK_CLIP_BLOCK =
  "block overflow-hidden pb-[0.12em] -mb-[0.12em]";

export const MASK_CLIP_BLOCK_TIGHT = "block overflow-hidden";
