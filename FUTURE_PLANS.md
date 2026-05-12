# Future Plans

Possible future improvements for Simple Pinned Files. These are **not commitments for any specific version** — just notable ideas to consider later.

## Near-term polish

- Consider removing or reducing pin/unpin Notice messages if they feel too noisy during normal use.
- Consider making the native File Explorer pin indicator optional in settings.
- Consider adding a setting to choose where the Pinned Files view opens by default, or simply rely on Obsidian workspace behavior.
- Consider improving missing-file handling, such as showing a clearer "missing file" state with an Unpin action.

## Pin management

- Add drag-and-drop reordering of pinned files.
- Add keyboard-accessible reorder controls as an alternative to drag-and-drop.
- Add a command to clear all pinned files, in addition to the settings button.
- Consider adding pinned groups/sections later, but avoid overcomplicating the plugin.

## Drag-and-drop pinning

Allow dragging a file from Obsidian's native File Explorer into the Pinned Files view to automatically pin that file.

Behavior:

- Drag a file row from the native File Explorer.
- Drop it anywhere in the Pinned Files view.
- Plugin extracts the file path.
- Plugin adds it to `pinnedPaths` if it is a `TFile` and not already pinned.
- View refreshes immediately.

Important implementation notes:

- Do not mutate or interfere with Obsidian's native File Explorer DOM.
- Do not implement custom file dragging in the native File Explorer.
- Only listen for drop events in our own Pinned Files view.
- Make sure this does not break normal click/right-click behavior.
- Carefully inspect Obsidian drag event data before implementing.
- This should be a focused enhancement, not part of the v1.0.0 release.

## Visual/UI ideas

- Continue matching Obsidian native file row styling as closely as practical.
- Consider making the pin icon even subtler or only visible on hover/active.
- Consider adding optional compact/dense mode only if needed.
- Consider adding a small count or empty-state hint, but avoid adding visual clutter.
- Consider improving accessibility labels for pinned rows and actions.

## Tooltip ideas

- Keep using Obsidian's `setTooltip` if it remains reliable.
- Consider making tooltip delay configurable only if there is a real need.
- Consider showing parent folder instead of full path in the tooltip if full path feels too long.

## Native File Explorer indicator ideas

- Keep the current CSS-only managed style approach.
- If Obsidian changes the native File Explorer selectors in the future, update the selector targeting.
- Consider adding a graceful warning or setting if native indicators cannot be applied.
- Avoid `MutationObserver` and DOM mutation unless absolutely necessary.

## Things to avoid unless intentionally revisiting architecture

- Do not rebuild Obsidian's File Explorer.
- Do not add sidebar layout/orchestration to this plugin.
- Do not add search to this plugin unless there is a clear reason.
- Do not use frontmatter/bookmarks as the source of truth without careful design.
- Do not introduce Svelte/React for this small plugin.
- Do not combine this plugin with the separate sidebar organization/styling project too early.

## Possible separate companion project

A separate sidebar organization/styling project may eventually handle:

- Labeled sidebar navigation inspired by Minimal Theme.
- Stacking native Search / Pinned Files / File Explorer views.
- Hiding or simplifying File Explorer toolbar buttons.
- Making the left sidebar feel calmer and more unified.

Keep that work separate from Simple Pinned Files unless there is a strong reason to merge later.
