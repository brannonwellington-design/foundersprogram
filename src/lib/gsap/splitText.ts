/** Split copy on whitespace for word-level masks. */
export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/** Join words, using a non-breaking space for the last pair when glued after orphan pull. */
function joinLineWords(words: string[], orphanGlue: boolean): string {
  if (words.length <= 1) return words[0] ?? "";
  if (!orphanGlue) return words.join(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join("\u00a0");
  return head ? `${head} ${tail}` : tail;
}

/**
 * Group word elements by visual line using offsetTop.
 * `wordEls` must be in the same order as `words`.
 *
 * Trailing single-word lines are merged onto the previous line with a
 * non-breaking space so orphans like "company." stay with the line above.
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

  const orphanGlued = new Set<number>();
  while (groups.length > 1 && groups[groups.length - 1].length === 1) {
    const [orphan] = groups.pop()!;
    groups[groups.length - 1].push(orphan);
    orphanGlued.add(groups.length - 1);
  }

  return groups.map((g, i) => joinLineWords(g, orphanGlued.has(i)));
}

/** Default clip — room for descenders (display type, nav links). */
export const MASK_CLIP =
  "inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom";

/** Tighter clip for labels, names, and single-line UI copy. */
export const MASK_CLIP_TIGHT = "inline-block overflow-hidden";

export const MASK_CLIP_BLOCK =
  "block overflow-hidden pb-[0.12em] -mb-[0.12em]";

export const MASK_CLIP_BLOCK_TIGHT = "block overflow-hidden";
