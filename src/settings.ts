import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
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
  sectionTitleSubtle: boolean;
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
  sectionTitleSubtle: false,
  newTabHeadingText: DEFAULT_TITLE,
};

/** Keys the settings tab reads and writes. All but one are settings fields;
 * `newTabSeparateList` is a toggle view of `newTabStyle`. */
type ControlKey =
  | "openViewOnStartup"
  | "showSectionTitle"
  | "sectionTitleText"
  | "sectionTitleSubtle"
  | "showOnNewTab"
  | "newTabHeading"
  | "newTabHeadingText"
  | "newTabSeparateList";

/** Keys whose change shows or hides other settings. */
const VISIBILITY_KEYS: ReadonlySet<string> = new Set([
  "showSectionTitle",
  "showOnNewTab",
  "newTabHeading",
]);

/** Keys that only affect the new tab page; the rest affect the sidebar view. */
const NEW_TAB_KEYS: ReadonlySet<string> = new Set([
  "showOnNewTab",
  "newTabHeading",
  "newTabHeadingText",
  "newTabSeparateList",
]);

// Declarative settings (Obsidian 1.13+, which minAppVersion requires), so
// they show up in Obsidian's settings search. Every write goes through
// plugin.saveSettings(), never the default setControlValue, because its
// saveCount guard keeps the Sync poll from reading a half-written data.json.
export class PinnedFilesSettingTab extends PluginSettingTab {
  plugin: PinnedFilesPlugin;

  constructor(app: App, plugin: PinnedFilesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getControlValue(key: string): unknown {
    if (key === "newTabSeparateList") {
      return this.plugin.settings.newTabStyle === "section";
    }
    return (this.plugin.settings as unknown as Record<string, unknown>)[key];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const settings = this.plugin.settings;
    if (key === "newTabSeparateList") {
      settings.newTabStyle = value ? "section" : "buttons";
    } else {
      (settings as unknown as Record<string, unknown>)[key] = value;
    }
    await this.plugin.saveSettings();
    if (NEW_TAB_KEYS.has(key)) {
      this.plugin.updateEmptyTabActions();
    } else if (key !== "openViewOnStartup") {
      this.plugin.refreshView();
    }
    // Show or hide the settings that depend on this one.
    if (VISIBILITY_KEYS.has(key)) this.refreshDomState();
  }

  getSettingDefinitions(): SettingDefinitionItem<ControlKey>[] {
    const settings = () => this.plugin.settings;
    return [
      {
        name: "Add pinned files to sidebar on startup",
        desc: "Ensure the pinned files view is available in the left sidebar when Obsidian starts. The view will not steal focus from your active sidebar tab.",
        control: { type: "toggle", key: "openViewOnStartup" },
      },
      {
        name: "Show section title",
        desc: "Show a small title above the pinned list in the sidebar.",
        control: { type: "toggle", key: "showSectionTitle" },
      },
      {
        name: "Section title",
        desc: `The sidebar title's text. Leave blank for "${DEFAULT_TITLE}".`,
        visible: () => settings().showSectionTitle,
        control: { type: "text", key: "sectionTitleText", placeholder: DEFAULT_TITLE },
      },
      {
        name: "Subtle title",
        desc: "A smaller, quieter title shown exactly as typed. Off: the bold all-caps title.",
        visible: () => settings().showSectionTitle,
        control: { type: "toggle", key: "sectionTitleSubtle" },
      },
      {
        name: "Show pinned files on new tabs",
        desc: "Add a button for each pinned file to the new tab page.",
        control: { type: "toggle", key: "showOnNewTab" },
      },
      {
        name: "Show heading on new tabs",
        desc: "Show a heading above the pinned files on the new tab page, in either style.",
        visible: () => settings().showOnNewTab,
        control: { type: "toggle", key: "newTabHeading" },
      },
      {
        name: "New tab heading",
        desc: `The heading's text. Leave blank for "${DEFAULT_TITLE}".`,
        visible: () => settings().showOnNewTab && settings().newTabHeading,
        control: { type: "text", key: "newTabHeadingText", placeholder: DEFAULT_TITLE },
      },
      {
        name: "Show as a separate list",
        desc: "On: your pinned files as their own list below the new tab buttons. Off: one button per file.",
        visible: () => settings().showOnNewTab,
        control: { type: "toggle", key: "newTabSeparateList" },
      },
      {
        name: "Clear pinned files",
        desc: "Remove all pinned files from this list. This does not delete the files themselves.",
        render: (setting) => {
          setting.addButton((button) =>
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
        },
      },
    ];
  }
}
