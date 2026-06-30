const PINNED_CLASS = "is-pinned-file";

// Pin indicators in the native File Explorer are styled entirely from
// `styles.css` (`.nav-file-title.is-pinned-file`). This module only toggles the
// `is-pinned-file` class on the matching explorer rows — it never injects a
// <style> element or generates CSS at runtime.

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
