# Simple Pinned Files

A small Obsidian plugin that adds a standalone Pinned Files view for quickly accessing important files and notes.

## Features

- Custom Pinned Files sidebar view
- Pin/unpin current file command
- File Explorer context menu item: Pin file / Unpin file
- Pinned rows show the file basename; the full vault path appears in an Obsidian tooltip after a short hover
- One-click open from pinned list
- Right-click pinned row menu: Unpin
- Handles rename/delete of pinned files and folders
- Native File Explorer pin indicators using CSS-only decoration

## Non-goals / intentional simplicity

- Does not replace or rebuild Obsidian's File Explorer
- Does not manage sidebar layout
- Does not implement search
- Does not use frontmatter or bookmarks as the source of truth
- Does not use Svelte/React

## Screenshots

_Screenshots can be added here in a future release._

## Installation

### From a GitHub release

Each release on GitHub includes the three files Obsidian needs:

- `manifest.json`
- `main.js`
- `styles.css`

To install manually:

1. Create the folder `<vault>/.obsidian/plugins/simple-pinned-files/` in your vault.
2. Download `manifest.json`, `main.js`, and `styles.css` from the latest [release](../../releases) and place them in that folder.
3. In Obsidian → Settings → Community plugins, enable **Simple Pinned Files**.

### From source

1. Clone this repository.
2. Run `npm install`.
3. Run `npm run build`.
4. Copy `manifest.json`, `main.js`, and `styles.css` into:
   ```
   <vault>/.obsidian/plugins/simple-pinned-files/
   ```
5. Enable the plugin in Obsidian → Settings → Community plugins.

## Settings

- **Add Pinned Files to sidebar on startup** — when enabled, the Pinned Files view is added to the left sidebar at Obsidian startup. The view will not steal focus from your active sidebar tab.
- **Clear pinned files** — removes every entry from the pinned list. This does not delete the files themselves; it only clears the plugin's record of which files are pinned.

## Basic usage

- Open command palette → **Open Simple Pinned Files**
- Right-click a file in the File Explorer → **Pin file** / **Unpin file**
- Single-click a pinned row to open the file; Cmd/Ctrl-click to open in a new tab
- Right-click a pinned row in the Pinned Files view → **Unpin**

## Obsidian Sync compatibility

The plugin's pin list lives in its own `data.json`, which Obsidian Sync replicates between devices. The plugin polls its own `data.json` every 5 seconds and, if an external change is detected (e.g. a synced update from another device), reloads the pinned list, refreshes the view, and updates the native File Explorer pin indicators — no plugin reload or Obsidian restart required. The reload path is read-only; local pin/unpin remains the only operation that writes to `data.json`.

## Data safety

This plugin is deliberately conservative about what it touches:

- It **does not** create, delete, rename, move, or modify any notes, attachments, folders, frontmatter, or bookmarks.
- It **does not** modify Obsidian's native File Explorer DOM. Pin indicators are added via a single managed `<style>` element using `pointer-events: none`, so native click/right-click/drag behavior is unaffected.
- The only persistent write is the plugin's own settings file at `<vault>/.obsidian/plugins/simple-pinned-files/data.json` via Obsidian's `saveData()` API.
- Vault rename and delete event handlers are listeners that update the in-memory list of pinned path strings. They never originate a vault mutation.
- The plugin makes no network requests, spawns no child processes, and reads no files outside its own settings data.

## Development

- `npm run dev` — watch-mode build
- `npm run build` — production build (type-checks then bundles)

## Status

v1.0.2 — stable. See [CHANGELOG.md](CHANGELOG.md) for release notes and [FUTURE_PLANS.md](FUTURE_PLANS.md) for ideas under consideration.

## License

[MIT](LICENSE) © Matt Maiorana
