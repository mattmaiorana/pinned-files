const PINNED_CLASS = "is-pinned-file";

// Toggles the `is-pinned-file` class on native File Explorer rows; the
// indicator styling lives in styles.css.

export function applyExplorerPinIndicators(paths: string[]): void {
  const pinned = new Set(paths);
  const nodes = activeDocument.querySelectorAll<HTMLElement>(
    ".nav-file-title[data-path]"
  );
  nodes.forEach((node) => {
    const path = node.getAttribute("data-path");
    const shouldPin = path !== null && pinned.has(path);
    node.classList.toggle(PINNED_CLASS, shouldPin);
  });
}

export function removeExplorerPinIndicators(): void {
  const nodes = activeDocument.querySelectorAll<HTMLElement>(
    `.nav-file-title.${PINNED_CLASS}`
  );
  nodes.forEach((node) => node.classList.remove(PINNED_CLASS));
}
