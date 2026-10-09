import { App, TFile, WorkspaceLeaf, setIcon } from "obsidian";

// Pinned files as actions on Obsidian's empty "new tab" page, beside its own
// "New note", "New base", and "Go to file". Each one opens the file in that tab.
// The page is Obsidian's view of type "empty"; its actions are pill buttons in
// `.empty-state-action-list`, and ours copy their classes so they look native.

const ACTION_CLASS = "pinned-files-empty-action";

function actionList(leaf: WorkspaceLeaf): HTMLElement | null {
  return leaf.view.containerEl.querySelector<HTMLElement>(
    ".empty-state-action-list"
  );
}

export function removeEmptyTabActions(app: App): void {
  for (const leaf of app.workspace.getLeavesOfType("empty")) {
    const list = actionList(leaf);
    if (!list) continue;
    list.querySelectorAll(`.${ACTION_CLASS}`).forEach((el) => el.remove());
    delete list.dataset.pinnedFiles;
  }
}

export function applyEmptyTabActions(app: App, pinnedPaths: string[]): void {
  for (const leaf of app.workspace.getLeavesOfType("empty")) {
    const list = actionList(leaf);
    if (!list) continue;
    const files = pinnedPaths
      .map((path) => app.vault.getAbstractFileByPath(path))
      .filter((f): f is TFile => f instanceof TFile);
    // Rebuild only when the set of files shown changes, so an unrelated
    // layout change never destroys a button mid-click or drops its focus.
    const signature = files.map((f) => f.path).join("\n");
    if (list.dataset.pinnedFiles === signature) continue;
    list.dataset.pinnedFiles = signature;
    list.querySelectorAll(`.${ACTION_CLASS}`).forEach((el) => el.remove());
    for (const file of files) {
      const action = list.createDiv({
        cls: `text-icon-button tappable mod-pill empty-state-action ${ACTION_CLASS}`,
        // The full path disambiguates two pins with the same name.
        attr: { tabindex: "0", role: "button", "aria-label": file.path, title: file.path },
      });
      setIcon(action.createSpan({ cls: "text-button-icon" }), "pin");
      action.createSpan({ cls: "text-button-label", text: file.basename });
      const open = () => void leaf.openFile(file);
      action.addEventListener("click", open);
      action.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          open();
        }
      });
    }
  }
}
