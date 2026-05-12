import { ItemView, Menu, setIcon, setTooltip, TFile, WorkspaceLeaf } from "obsidian";
import type SimplePinnedFilesPlugin from "./main";

export const VIEW_TYPE_PINNED_FILES = "simple-pinned-files-view";

export class PinnedFilesView extends ItemView {
  plugin: SimplePinnedFilesPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: SimplePinnedFilesPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_PINNED_FILES;
  }

  getDisplayText(): string {
    return "Pinned Files";
  }

  getIcon(): string {
    return "pin";
  }

  async onOpen(): Promise<void> {
    this.plugin.viewInstances.add(this);
    this.registerDomEvent(this.contentEl, "click", (evt) =>
      this.handleContentClick(evt)
    );
    this.registerDomEvent(this.contentEl, "contextmenu", (evt) =>
      this.handleContentContextMenu(evt)
    );
    this.render();
  }

  async onClose(): Promise<void> {
    this.plugin.viewInstances.delete(this);
    this.contentEl.empty();
  }

  render(): void {
    const container = this.contentEl;
    container.empty();
    container.addClass("simple-pinned-files-view");

    const list = container.createDiv({ cls: "simple-pinned-files-list" });

    const paths = this.plugin.settings.pinnedPaths;
    if (paths.length === 0) {
      list.createDiv({
        cls: "simple-pinned-files-empty",
        text: "No pinned files yet. Right-click a file and choose “Pin file”, or use the “Pin/unpin current file” command.",
      });
      return;
    }

    const activePath = this.app.workspace.getActiveFile()?.path;

    for (const path of paths) {
      const abstract = this.app.vault.getAbstractFileByPath(path);
      const file = abstract instanceof TFile ? abstract : null;

      const row = list.createDiv({ cls: "simple-pinned-files-row" });
      row.dataset.path = path;
      if (path === activePath) row.addClass("is-active");
      if (!file) row.addClass("is-missing");

      row.createDiv({
        cls: "simple-pinned-files-title",
        text: this.rowText(path, file),
      });

      const iconEl = row.createDiv({ cls: "simple-pinned-files-pin-icon" });
      setIcon(iconEl, "pin");

      setTooltip(row, path, { delay: 1000, placement: "top" });
    }
  }

  updateActiveStates(): void {
    const activePath = this.app.workspace.getActiveFile()?.path;
    const rows = this.contentEl.querySelectorAll<HTMLElement>(
      ".simple-pinned-files-row"
    );
    rows.forEach((row) => {
      if (row.dataset.path === activePath) row.addClass("is-active");
      else row.removeClass("is-active");
    });
  }

  private rowFromEvent(evt: MouseEvent): HTMLElement | null {
    const target = evt.target as HTMLElement | null;
    if (!target) return null;
    const row = target.closest<HTMLElement>(".simple-pinned-files-row");
    if (!row || !this.contentEl.contains(row)) return null;
    return row;
  }

  private handleContentClick(evt: MouseEvent): void {
    const row = this.rowFromEvent(evt);
    if (!row) return;
    if (row.classList.contains("is-missing")) return;
    const path = row.dataset.path;
    if (!path) return;
    void this.plugin.openPinned(path, evt);
  }

  private handleContentContextMenu(evt: MouseEvent): void {
    const row = this.rowFromEvent(evt);
    if (!row) return;
    const path = row.dataset.path;
    if (!path) return;
    evt.preventDefault();
    const menu = new Menu();
    menu.addItem((item) =>
      item
        .setTitle("Unpin")
        .setIcon("pin-off")
        .onClick(async () => {
          await this.plugin.unpinPath(path);
        })
    );
    menu.showAtMouseEvent(evt);
  }

  private rowText(path: string, file: TFile | null): string {
    if (file) return file.basename || file.name;
    const last = path.split("/").pop() ?? path;
    const dot = last.lastIndexOf(".");
    return dot > 0 ? last.slice(0, dot) : last;
  }
}
