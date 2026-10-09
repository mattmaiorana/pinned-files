import { App, TFile, WorkspaceLeaf, setIcon } from "obsidian";

// Pinned files on Obsidian's empty "new tab" page (leaves of type "empty"), in
// one of two styles:
// - "buttons": a pill per file inside `.empty-state-action-list`, beside
//   "New note", "New base", and "Go to file", copying their classes so they
//   look native.
// - "section": a "Pinned Files" list placed after that action list, one row
//   per file (the full path shows on hover).
// Each opens its file in that same tab.

export type NewTabStyle = "buttons" | "section";

const ACTION_CLASS = "pinned-files-empty-action";
const SECTION_CLASS = "pinned-files-new-tab-section";
// Set on the section's parent (Obsidian's .empty-state-container) while the
// section is there, so styles.css can lay the container out without `:has`.
const HAS_SECTION_CLASS = "pinned-files-has-section";

function actionList(leaf: WorkspaceLeaf): HTMLElement | null {
  return leaf.view.containerEl.querySelector<HTMLElement>(
    ".empty-state-action-list"
  );
}

function clear(list: HTMLElement): void {
  list.querySelectorAll(`.${ACTION_CLASS}`).forEach((el) => el.remove());
  list.parentElement
    ?.querySelectorAll(`.${SECTION_CLASS}`)
    .forEach((el) => el.remove());
  list.parentElement?.removeClass(HAS_SECTION_CLASS);
  delete list.dataset.pinnedFiles;
}

function makeActivatable(el: HTMLElement, open: () => void): void {
  el.addEventListener("click", open);
  el.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      open();
    }
  });
}

export function removeEmptyTabActions(app: App): void {
  for (const leaf of app.workspace.getLeavesOfType("empty")) {
    const list = actionList(leaf);
    if (list) clear(list);
  }
}

export function applyEmptyTabActions(
  app: App,
  pinnedPaths: string[],
  style: NewTabStyle,
  heading: string | null
): void {
  const showHeading = heading !== null;
  for (const leaf of app.workspace.getLeavesOfType("empty")) {
    const list = actionList(leaf);
    if (!list) continue;
    const files = pinnedPaths
      .map((path) => app.vault.getAbstractFileByPath(path))
      .filter((f): f is TFile => f instanceof TFile);
    // Rebuild only when what's shown changes, so an unrelated layout change
    // never destroys a button mid-click or drops its focus.
    const signature = `${style}\n${heading ?? ""}\n` + files.map((f) => f.path).join("\n");
    if (list.dataset.pinnedFiles === signature) continue;
    clear(list);
    list.dataset.pinnedFiles = signature;
    if (files.length === 0) continue;

    if (style === "section") {
      // Created through the list's own parent so it belongs to that window's
      // document (a new tab can be in a popout), then placed right after it.
      const parent = list.parentElement;
      if (!parent) continue;
      const section = parent.createDiv({ cls: SECTION_CLASS });
      list.after(section);
      parent.addClass(HAS_SECTION_CLASS);
      if (showHeading) {
        section.createDiv({ cls: "pinned-files-new-tab-title", text: heading ?? "" });
      }
      for (const file of files) {
        const row = section.createDiv({
          cls: "pinned-files-new-tab-row",
          // The full path disambiguates two pins with the same name.
          attr: { tabindex: "0", role: "button", "aria-label": file.path, title: file.path },
        });
        setIcon(row.createSpan({ cls: "pinned-files-new-tab-icon" }), "pin");
        row.createSpan({ cls: "pinned-files-new-tab-name", text: file.basename });
        makeActivatable(row, () => void leaf.openFile(file));
      }
      continue;
    }

    if (showHeading) {
      list.createDiv({
        cls: `pinned-files-new-tab-title ${ACTION_CLASS}`,
        text: heading ?? "",
      });
    }
    for (const file of files) {
      const action = list.createDiv({
        cls: `text-icon-button tappable mod-pill empty-state-action ${ACTION_CLASS}`,
        attr: { tabindex: "0", role: "button", "aria-label": file.path, title: file.path },
      });
      setIcon(action.createSpan({ cls: "text-button-icon" }), "pin");
      action.createSpan({ cls: "text-button-label", text: file.basename });
      makeActivatable(action, () => void leaf.openFile(file));
    }
  }
}
