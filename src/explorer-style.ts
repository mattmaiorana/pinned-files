const PINNED_CLASS = "is-pinned-file";

// Toggles the `is-pinned-file` class on native File Explorer rows within the
// given explorer view containers; the indicator styling lives in styles.css.
// Containers are resolved from the file-explorer leaves (not the focused
// `activeDocument`) so indicators stay correct when a popout window is focused.

export function applyExplorerPinIndicators(
  containers: HTMLElement[],
  paths: string[]
): void {
  const pinned = new Set(paths);
  for (const container of containers) {
    const nodes = container.querySelectorAll<HTMLElement>(
      ".nav-file-title[data-path]"
    );
    nodes.forEach((node) => {
      const path = node.getAttribute("data-path");
      node.classList.toggle(PINNED_CLASS, path !== null && pinned.has(path));
    });
  }
}

export function removeExplorerPinIndicators(containers: HTMLElement[]): void {
  for (const container of containers) {
    const nodes = container.querySelectorAll<HTMLElement>(
      `.nav-file-title.${PINNED_CLASS}`
    );
    nodes.forEach((node) => node.classList.remove(PINNED_CLASS));
  }
}
