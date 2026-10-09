# Changelog

All notable changes to Pinned Files will be documented in this file.

## [1.2.1] - 2026-10-09

Clears the Obsidian review findings on 1.2.0. Nothing changes in how the plugin looks or behaves, and saved settings carry over as they are.

### Changed

- **The plugin's settings now appear in Obsidian's settings search.** The settings tab uses Obsidian's declarative settings API (`getSettingDefinitions()`, 1.13+) instead of drawing itself with `display()`. Settings that depend on a toggle show and hide with it through `visible` checks and `refreshDomState()`, rather than a full redraw. Every change still saves through the plugin's own `saveSettings()`, so the Sync poll's save guard covers settings changes as before.
- The drag preview is created with `createDiv` and styled by a `.pinned-files-drag-image` class in `styles.css`, rather than `document.createElement` with inline styles.
- The new tab page's list no longer uses a `:has()` selector. The plugin sets a `pinned-files-has-section` class on Obsidian's empty-state container while the list is there, and removes it with the list.

### Development

- `npm run lint` runs Obsidian's review rules (`eslint-plugin-obsidianmd`), now a dev dependency with `eslint.config.mjs`. TypeScript moved from 4.7 to 5.x, which typescript-eslint needs.

## [1.2.0] - 2026-10-09

### Added

- **Pinned files on the new tab page.** Turn on "Show pinned files on new tabs" (`showOnNewTab`, off by default, so nothing changes until you do) and each pinned file opens from a new tab with one click, in that tab. When it's on:
  - "Show heading on new tabs" (`newTabHeading`, on by default) and "New tab heading" (`newTabHeadingText`, default "Pinned Files").
  - "Show as a separate list" (`newTabStyle`, on by default): your pinned files as their own list below Obsidian's buttons, one row per file with a pin icon and its name. Off: one pill button per file inside Obsidian's own list.
  - The related settings are hidden while "Show pinned files on new tabs" is off.
- **Your own sidebar title.** "Section title" (`sectionTitleText`, default "Pinned Files"); a blank field falls back to the default.
- **"Subtle title"** (`sectionTitleSubtle`, off by default): a smaller, quieter sidebar title shown exactly as typed, with the same spacing. Off, the title keeps its original bold, all-caps look.

### Details

- Obsidian's buttons stay centered where it places them; the list starts at their left edge and runs right as far as a name needs (up to 480 px, longer names cut off with an ellipsis). The heading is left-aligned in both styles. Hovering a pinned file shows its full path.
- With the sidebar title off, the list gets a little room above its first row.
- The new tab entries rebuild only when what's shown changes, so an unrelated layout change never interrupts a click; a pin synced before its file arrives appears once the file does (both from a Codex review). They're applied on `active-leaf-change` as well as `layout-change`, so a new tab shows them at once (about 10 ms) rather than up to a second later.

## [1.1.1] - 2026-07-09

### Fixed

- Native File Explorer pin indicators now resolve the explorer through its workspace leaves instead of the focused `activeDocument`. This keeps indicators correct when a popout window is focused (previously the observer could disconnect, pin/unpin and synced changes could target the wrong window, and stale pin badges could be left in the main explorer after disabling the plugin), and it correctly handles multiple File Explorer panes.
- The 5-second settings-reload poll now catches read failures (e.g. a partially written `data.json` during sync) and logs once instead of throwing an unhandled rejection every tick.
- A `showSectionTitle` change synced from another device now refreshes the view immediately instead of sitting half-applied until the next pin change.

### Changed

- `reorderPinnedPaths` now rejects non-permutation input (duplicate entries), hardening the reorder validation boundary.

### Notes

- No data model or vault-content behavior changes.

## [1.1.0] - 2026-06-30

### Changed

- Restored the manifest display name to "Pinned Files" (plugin `id`: `pinned-files`).

## [1.0.10] - 2026-06-30

### Changed

- Set the manifest display name to "Simple Pinned Files" (plugin `id` unchanged: `pinned-files`).

## [1.0.9] - 2026-06-30

### Changed

- Completed the rename to "Pinned Files": the plugin `id` is now `pinned-files` (and the vault install folder is `.obsidian/plugins/pinned-files/`). The plugin is published as a community plugin under the new `pinned-files` id.
- Native File Explorer pin indicators are now styled entirely from `styles.css` (a toggled `is-pinned-file` class) instead of an injected `<style>` element, per Obsidian plugin guidelines.
- In-app UI text (view title, ribbon tooltip, settings labels, command name) now uses sentence case. The store/display name remains "Pinned Files".
- The "Clear all" button uses `setDestructive()` instead of the deprecated `setWarning()`.
- Raised `minAppVersion` to `1.13.0` (required by `setDestructive`, also covers the awaited async `revealLeaf`).

### Fixed

- Awaited `workspace.revealLeaf()` calls (no longer floating promises) and gated them behind the raised `minAppVersion`.
- Use `activeDocument` instead of `document` for popout-window compatibility.
- The "Open view" command id/name no longer repeat the plugin id/name.

### Notes

- No data model or vault-content behavior changes.

## [1.0.8] - 2026-06-30

### Fixed

- Fixed a "Plugin ID mismatch" error that blocked installing the plugin from the community store. The manifest `id` is the permanent community-store identifier and must remain `simple-pinned-files`; it had been changed to `pinned-files` during the display-name rename and is now restored. The user-facing display name remains "Pinned Files".

### Notes

- No data model or vault-content behavior changes.
- Only the display `name` was changed in the rename to "Pinned Files"; the plugin `id` (and therefore the vault folder `.obsidian/plugins/simple-pinned-files/`) is unchanged, so existing installs and pinned data carry over seamlessly.

## [1.0.7] - 2026-05-25

### Added

- Added desktop drag-and-drop reordering for pinned files within the Pinned Files view.
- Added a text-only drag preview while reordering pinned files.

### Changed

- Improved drag-and-drop visuals with a straight drop indicator line.
- Improved drag-and-drop reliability by using the last visible drop target when the drop event lands in a row gap or just outside a row.
- Refined section title styling and spacing.
- Made the "Show section title" setting enabled by default for fresh installs.
- Refined pinned view row/title alignment while keeping hover and active backgrounds inset.

### Documentation

- Updated future plans to note deferred mobile/touch reorder and keyboard-accessible reorder work.

### Notes

- No data model or vault-content behavior changes.
- Drag-and-drop reordering is currently desktop-only.

## [1.0.6] - 2026-05-24

### Added

- Added an optional setting to show a small "Pinned Files" section title above the pinned list.

### Changed

- Refined Pinned Files view spacing for a tighter, more compact sidebar layout.
- Updated future plans with notes on possible naming, sidebar layout limitations, and deferred workspace-sizing experiments.

### Notes

- No data model or vault-content behavior changes.

## [1.0.5] - 2026-05-20

### Fixed

- Tightened sync/live-reload race handling by re-checking `saveCount` after loading plugin data from disk.

### Added

- Added a GitHub Actions release workflow for future tagged releases.
- The release workflow builds the plugin, verifies release assets, checks that the tag matches `manifest.json`, uploads `manifest.json`, `main.js`, and `styles.css`, and generates GitHub artifact attestations.

### Documentation

- Updated release-process documentation for future Claude Code sessions.
- Added future-plan notes from the final pre-submission code review.

## [1.0.4] - 2026-05-20

### Changed

- Replaced the `builtin-modules` package in the build configuration with Node's built-in `builtinModules` from `node:module`.
- Removed placeholder-like README wording flagged by the Obsidian plugin checker.
- Reworded manual installation paths to avoid angle-bracket placeholders.

### Notes

- No plugin behavior changes.

## [1.0.3] - 2026-05-20

### Changed

- Updated the plugin description for Obsidian community plugin checker compliance.
- Added a README screenshot showing the plugin UI.
- Aligned package metadata with the public plugin description.

### Notes

- No plugin behavior changes.

## [1.0.2] - 2026-05-12

### Fixed

- Hardened sync/live-reload behavior by replacing the boolean save guard with a save refcount, preventing polling reloads from reading stale data during overlapping saves.
- Prevented in-flight reload polling from re-creating native File Explorer pin indicator styles after plugin unload.
- Switched pinned row click and context-menu handling to event delegation so mid-click refreshes cannot destroy row listeners and lose the click.
- Added defensive normalization for externally loaded pinned paths, dropping non-string entries and deduping while preserving order.
- Updated documentation to match current UI behavior: basename-only rows, full-path tooltip, Unpin-only context menu, and native file-row styling.

### Technical

- Added `normalizePinnedPaths()` for load/reload safety.
- Replaced `saving` boolean with `saveCount`.
- Added `unloaded` guard for reload cleanup safety.
- Moved pinned-row click/contextmenu logic to stable view-level listeners.

## [1.0.1] - 2026-05-11

### Fixed

- Added sync-aware live reload for pinned file settings.
- The plugin now periodically checks its own `data.json` for external changes, such as updates from Obsidian Sync.
- Synced pin/unpin changes from another device now update the Pinned Files view and native File Explorer pin indicators without requiring a plugin reload or Obsidian restart.
- The external reload path is read-only and does not call `saveData`, avoiding sync loops.

### Technical

- Added a lightweight 5-second polling mechanism using `loadData`.
- Added order-sensitive `pinnedPaths` comparison.
- Added `saving`/`reloading` guards to avoid races between local saves and external reload checks.
- Documented Obsidian Sync compatibility in `README.md` and `CLAUDE.md`.

## [1.0.0] - 2026-05-11

### Added

- Initial stable release.
- Standalone Pinned Files sidebar view.
- Pin/unpin current file command.
- Native File Explorer context menu item: Pin file / Unpin file.
- Compact native-style pinned file rows.
- One-click open from pinned rows.
- Right-click pinned row menu with Unpin.
- Rename/delete handling for pinned files and parent folders.
- CSS-only native File Explorer pin indicators.
- Lucide-style pin icons.
- Obsidian-native full-path tooltips.
- Safer startup behavior that can add the view to the sidebar without stealing focus.
