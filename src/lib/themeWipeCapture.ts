const APP_ROOT_ID = "app-root";

/** Freeze fixed/sticky nodes to their viewport position inside the wipe shell. */
function alignSnapshotToViewport(
  source: HTMLElement,
  snapshot: HTMLElement,
  shell: HTMLElement,
) {
  const position = getComputedStyle(source).position;
  if (position === "fixed" || position === "sticky") {
    const rect = source.getBoundingClientRect();
    snapshot.style.visibility = "hidden";
    const overlay = snapshot.cloneNode(true) as HTMLElement;
    overlay.style.visibility = "visible";
    overlay.style.position = "fixed";
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.margin = "0";
    overlay.style.bottom = "auto";
    overlay.style.right = "auto";
    const zIndex = getComputedStyle(source).zIndex;
    if (zIndex !== "auto") overlay.style.zIndex = zIndex;
    shell.appendChild(overlay);
    return;
  }

  for (let i = 0; i < source.children.length; i++) {
    const sourceChild = source.children[i];
    const snapshotChild = snapshot.children[i];
    if (
      sourceChild instanceof HTMLElement &&
      snapshotChild instanceof HTMLElement
    ) {
      alignSnapshotToViewport(sourceChild, snapshotChild, shell);
    }
  }
}

/**
 * Clone the live page into a wipe shell so the outgoing theme stays visible
 * while the incoming theme is revealed underneath.
 */
export function mountThemeWipeSnapshot(
  shell: HTMLElement,
  from: "light" | "dark",
) {
  const root = document.getElementById(APP_ROOT_ID);
  if (!root) return () => {};

  shell.setAttribute("data-theme", from);
  shell.style.pointerEvents = "none";

  const scrollY = window.scrollY;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const clone = root.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.style.pointerEvents = "none";

  const scroller = document.createElement("div");
  scroller.style.cssText = `position:absolute;left:0;width:100%;top:${-scrollY}px`;
  scroller.style.pointerEvents = "none";
  scroller.appendChild(clone);
  shell.appendChild(scroller);

  alignSnapshotToViewport(root, clone, shell);

  return () => {
    document.body.style.overflow = previousOverflow;
    shell.replaceChildren();
  };
}

export { APP_ROOT_ID };
