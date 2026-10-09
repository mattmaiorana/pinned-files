import { App, PluginSettingTab, Setting } from "obsidian";
import type { NewTabStyle } from "./empty-tab";
import type PinnedFilesPlugin from "./main";

export interface PinnedFilesSettings {
  pinnedPaths: string[];
  openViewOnStartup: boolean;
  showSectionTitle: boolean;
  showOnNewTab: boolean;
  newTabStyle: NewTabStyle;
}

export const DEFAULT_SETTINGS: PinnedFilesSettings = {
  pinnedPaths: [],
  openViewOnStartup: true,
  showSectionTitle: true,
  showOnNewTab: true,
  newTabStyle: "section",
};

export class PinnedFilesSettingTab extends PluginSettingTab {
  plugin: PinnedFilesPlugin;

  constructor(app: App, plugin: PinnedFilesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Add pinned files to sidebar on startup")
      .setDesc(
        "Ensure the pinned files view is available in the left sidebar when Obsidian starts. The view will not steal focus from your active sidebar tab."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.openViewOnStartup)
          .onChange(async (value) => {
            this.plugin.settings.openViewOnStartup = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Show section title")
      .setDesc('Show a small "pinned files" label above the pinned list.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showSectionTitle)
          .onChange(async (value) => {
            this.plugin.settings.showSectionTitle = value;
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
      );

    new Setting(containerEl)
      .setName("Show pinned files on new tabs")
      .setDesc(
        "Add a button for each pinned file to the new tab page, beside New note and Go to file."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showOnNewTab)
          .onChange(async (value) => {
            this.plugin.settings.showOnNewTab = value;
            await this.plugin.saveSettings();
            this.plugin.updateEmptyTabActions();
          })
      );

    new Setting(containerEl)
      .setName("Show as a pinned section")
      .setDesc(
        "On: a separate pinned list below the new tab buttons, with each file's folder. Off: one button per file alongside New note and Go to file."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.newTabStyle === "section")
          .onChange(async (value) => {
            this.plugin.settings.newTabStyle = value ? "section" : "buttons";
            await this.plugin.saveSettings();
            this.plugin.updateEmptyTabActions();
          })
      );

    new Setting(containerEl)
      .setName("Clear pinned files")
      .setDesc(
        "Remove all pinned files from this list. This does not delete the files themselves."
      )
      .addButton((button) =>
        button
          .setButtonText("Clear all")
          .setDestructive()
          .onClick(async () => {
            this.plugin.settings.pinnedPaths = [];
            await this.plugin.saveSettings();
            this.plugin.refreshView();
            this.plugin.updateExplorerStyles();
          })
      );
  }
}
