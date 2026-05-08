import { App, PluginSettingTab, Setting } from "obsidian";
import type SimplePinnedFilesPlugin from "./main";

export interface SimplePinnedFilesSettings {
  pinnedPaths: string[];
  openViewOnStartup: boolean;
}

export const DEFAULT_SETTINGS: SimplePinnedFilesSettings = {
  pinnedPaths: [],
  openViewOnStartup: true,
};

export class SimplePinnedFilesSettingTab extends PluginSettingTab {
  plugin: SimplePinnedFilesPlugin;

  constructor(app: App, plugin: SimplePinnedFilesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Open view on startup")
      .setDesc("Automatically reveal the Pinned Files view when Obsidian starts.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.openViewOnStartup)
          .onChange(async (value) => {
            this.plugin.settings.openViewOnStartup = value;
            await this.plugin.saveSettings();
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
          .setWarning()
          .onClick(async () => {
            this.plugin.settings.pinnedPaths = [];
            await this.plugin.saveSettings();
            this.plugin.refreshView();
            this.plugin.updateExplorerStyles();
          })
      );
  }
}
