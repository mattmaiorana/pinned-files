import { App, PluginSettingTab, Setting } from "obsidian";
import type { NewTabStyle } from "./empty-tab";
import type PinnedFilesPlugin from "./main";

export interface PinnedFilesSettings {
  pinnedPaths: string[];
  openViewOnStartup: boolean;
  showSectionTitle: boolean;
  showOnNewTab: boolean;
  newTabStyle: NewTabStyle;
  newTabHeading: boolean;
  sectionTitleText: string;
  newTabHeadingText: string;
}

/** The default text for both the sidebar title and the new tab heading. */
export const DEFAULT_TITLE = "Pinned Files";

/** The title to show: the user's text, or the default when it's blank. */
export function titleText(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? DEFAULT_TITLE : trimmed;
}

export const DEFAULT_SETTINGS: PinnedFilesSettings = {
  pinnedPaths: [],
  openViewOnStartup: true,
  showSectionTitle: true,
  showOnNewTab: false,
  newTabStyle: "section",
  newTabHeading: true,
  sectionTitleText: DEFAULT_TITLE,
  newTabHeadingText: DEFAULT_TITLE,
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
      .setDesc("Show a small title above the pinned list in the sidebar.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showSectionTitle)
          .onChange(async (value) => {
            this.plugin.settings.showSectionTitle = value;
            await this.plugin.saveSettings();
            this.plugin.refreshView();
            // Redraw so the title text field shows or hides with it.
            this.display();
          })
      );

    if (this.plugin.settings.showSectionTitle) {
      new Setting(containerEl)
        .setName("Section title")
        .setDesc(`The sidebar title's text. Leave blank for "${DEFAULT_TITLE}".`)
        .addText((text) =>
          text
            .setPlaceholder(DEFAULT_TITLE)
            .setValue(this.plugin.settings.sectionTitleText)
            .onChange(async (value) => {
              this.plugin.settings.sectionTitleText = value;
              await this.plugin.saveSettings();
              this.plugin.refreshView();
            })
        );
    }

    new Setting(containerEl)
      .setName("Show pinned files on new tabs")
      .setDesc(
        "Add a button for each pinned file to the new tab page."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showOnNewTab)
          .onChange(async (value) => {
            this.plugin.settings.showOnNewTab = value;
            await this.plugin.saveSettings();
            this.plugin.updateEmptyTabActions();
            // Redraw so the new tab settings below show or hide with it.
            this.display();
          })
      );

    // The style and heading settings only matter while new tabs show pins.
    if (this.plugin.settings.showOnNewTab) {
      new Setting(containerEl)
        .setName("Show heading on new tabs")
        .setDesc("Show a heading above the pinned files on the new tab page, in either style.")
        .addToggle((toggle) =>
          toggle
            .setValue(this.plugin.settings.newTabHeading)
            .onChange(async (value) => {
              this.plugin.settings.newTabHeading = value;
              await this.plugin.saveSettings();
              this.plugin.updateEmptyTabActions();
              // Redraw so the heading text field shows or hides with it.
              this.display();
            })
        );

      if (this.plugin.settings.newTabHeading) {
        new Setting(containerEl)
          .setName("New tab heading")
          .setDesc(`The heading's text. Leave blank for "${DEFAULT_TITLE}".`)
          .addText((text) =>
            text
              .setPlaceholder(DEFAULT_TITLE)
              .setValue(this.plugin.settings.newTabHeadingText)
              .onChange(async (value) => {
                this.plugin.settings.newTabHeadingText = value;
                await this.plugin.saveSettings();
                this.plugin.updateEmptyTabActions();
              })
          );
      }

      new Setting(containerEl)
        .setName("Show as a separate list")
        .setDesc(
          "On: your pinned files as their own list below the new tab buttons. Off: one button per file."
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
    }

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
