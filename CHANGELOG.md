# Changelog

All notable changes to Pinned Files will be documented in this file.

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
