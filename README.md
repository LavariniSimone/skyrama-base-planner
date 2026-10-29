# Skyrama Base Planner

Desktop app (Electron) for planning the layout of a Skyrama base on a grid: define building and boost types, place them on the map with drag & drop and instantly see the bonuses that boosts apply to nearby buildings.

## Features

### Grid
- Square grid, side length configurable from the menu (from 20 to 56 cells).
- Zoom with the mouse wheel, drag the background to move the grid freely, even beyond its edges, double-click to reset the zoom. When the grid is not fully visible and centered, a button above Settings (bottom left) brings back the full, centered view.
- When the grid is resized, cards that no longer fit are automatically removed from the grid.

### Types
Each type has a name, a category (Airside, Landside, Decoration), a size in cells (up to 30×30) and an optional icon, and can be one of two kinds:

- **Building**
  - *Plane service*: shows the service time reduction received from boosts.
  - *Passengers*: has a number of passengers and how many minutes it takes to generate them; shows the total passengers, bonuses included.
- **Boost**
  - Effect on *Service time reduction* (in %) or on *Passenger bonus* (additional passengers).
  - Effect *radius* in cells (0 = no effect, 1 = adjacent cells).

### Presets
- From a type's dialog, «Choose from presets» offers the standard Skyrama objects (Airside, Landside, Decoration) with size, effects and icon already filled in.
- Icons are not included in the repository: they are downloaded on first use and stored locally; without a connection the cards have no icon.
- Each preset can show its cost in Aircoins and/or Aircash and a maximum number of placeable cards (e.g. Weatherstation 3, First Aid Station 4, Fire Station 2, Weather Balloon 5). Reward decorations (earned per continent) have no cost and are limited to 1.
- On startup and on import, types with a preset icon are automatically realigned to the preset data: any manual changes to these types are overwritten. Custom types without an icon have no costs or limits.

### Planes
- The «Planes» button in the top left opens the catalog of Skyrama planes. Each card lists flight time, service time, cost, rewards and price as icon rows with the value next to each icon (hover an icon to see what it stands for); the unlock level is a chip at the top left and planes that can be owned only once show a «Max 1» chip at the top right.
- The type buttons (Small, Medium, Large, Cargo, Searama, Helirama) can be combined to show several types at once; «All» clears the selection. Flight duration and sort order (Level, XP, Aircoins, Goods) are chosen from the dropdowns.
- «My level» hides the planes unlocked above the entered level (empty shows all; planes without an unlock level, such as Construction Hall and reward planes, always stay visible). «Aircoins only» keeps only the planes sold for Aircoins. The star next to a plane's name adds it to or removes it from your favorites, and «Favorites only» lists only those. The filters and the favorites are remembered between sessions.
- «Top» badges are computed on the planes currently listed (selected types, flight duration, level and Aircoins filter, regardless of sort order): each badge goes to the listed plane with the highest XP, Aircoins, Aircoins per passenger (passenger planes) or Goods (cargo planes). In case of a tie the badge goes to all of them; no badge is shown when no listed plane has a positive value.
- Icons are downloaded on first use as for presets; without a connection the cards show the initials.

### Main goals
- The «Goals» button in the top left opens the 166 main goals of the official FAQ as cards in a horizontal row (scroll with the wheel or drag the bar): each card shows the title, the tasks and the rewards, with the plane icon next to the planes mentioned. Search and «Required planes» sit next to the title; close the dialog with the × at the top right or by clicking outside it.
- A progress bar shows how many goals are completed. The current goal has a highlighted border: «Complete» moves to the next goal, «Back» returns to the previous one. «Set as current» on any other card, completed ones included, makes it the current goal. When every goal is completed, «Back to last goal» undoes it. Progress is saved on the local machine.
- «Search goals» filters the cards by title, tasks and rewards: all the words must match, ignoring case and accents (e.g. «tete» finds «Tête-à-Tariq»), and a number such as «43» or «#43» also matches the goal with that number. Esc clears the field; the search is reset every time the dialog opens, and neither the progress bar nor «Required planes» depend on it.
- «Required planes» lists the plane models needed by the remaining goals, in order of first use, with level, price, the goal where each is first needed and how many goals use it. If a remaining goal gives the plane as a reward before it is needed, a «Reward from #n» label is shown. For tasks that accept any plane of a type, the plane purchasable with Aircoins with the lowest unlock level (the cheapest in case of a tie, excluding planes limited to one) is suggested when no listed model already covers that type.

### Inventory and placement
- The inventory is a compact, collapsible panel at the bottom; the collapsed state is remembered. The Airside, Landside and Decoration tabs filter the types, shown on a single row that scrolls horizontally, also with the mouse wheel. Each type is a card with icon and name: hovering the info icon in its top-right corner (or focusing the card with the keyboard) shows its stats (size, effects and placed cards); under the name, boosts show their effect value (e.g. «-5% service» or «+10 passengers») and a counter shows how many are placed (with a limit: «n/max»). The popup also shows the costs, Aircoins and Aircash on separate lines.
- The six-dot handle at the top left of each inventory card reorders the types inside the current tab: drag it along the row (the row scrolls near its edges, Esc cancels) or press Alt+Left / Alt+Right on a focused card. The order is saved and included in the exports; the rest of the card still places it on the grid.
- Clicking a card opens the type editor, where category and deletion are managed. The «+» button creates a new type.
- Drag an inventory card onto the grid as many times as needed: each valid drop creates a new placed card, up to the preset's limit if any (beyond which dragging is blocked with a warning); a preview shows whether the position is valid (no overlaps and nothing outside the edges).
- If a loaded or imported layout exceeds the limits, the cards are kept but highlighted and reported with a message; they are not removed.
- Cards on the grid are moved by dragging them and rotated with the middle mouse button. While dragging (from the grid or from the inventory) the middle button also rotates the card in hand; Esc cancels the drag, and dropping outside the grid cancels it too. While dragging, getting close to the edges of the zoomed grid scrolls the view in that direction, faster the closer you are to the edge. Scrolling only starts once the card in hand has entered the grid area, not while bringing it from the inventory or at the start of the drag. Scrolling stops once the edge of the grid is visible.
- **Selection**: clicking a card on the grid selects it (highlighted outline); Ctrl/Cmd+click or Shift+click adds or removes a card from the selection. Shift+drag on an empty area draws a selection rectangle that selects every card it touches (add Ctrl/Cmd to keep the current selection). Clicking an empty cell, or pressing Esc, clears the selection; Ctrl/Cmd+A selects all the placed cards.
- Right-clicking a placed card opens a menu with «Rotate» and «Delete»; if the card belongs to a multiple selection the menu acts on the whole selection («Rotate selection» around the clicked cell, all or nothing, and «Delete N selected»). The menu is closed with Esc, a click outside or Tab, and is not available in remove mode or while dragging.
- **Group move and rotation**: dragging a selected card moves the whole selection keeping the relative positions; the middle mouse button rotates the group clockwise while dragging. The drop is all-or-nothing: if any card would overlap another or leave the grid, the move is cancelled. Dragging an unselected card selects and moves only that one.
- Delete or Backspace removes the selected cards from the grid without confirmation; with two or more cards selected, a «Remove N selected» button in the toolbar does the same (not available in the isometric view or in remove mode).
- Hovering a card shows a popup with icon and details; for boosts the effect area is also highlighted.
- **Remove mode** (red trash button next to «+» in the inventory header): a click removes the card from the grid.
- **Isometric view**: the «2D / Isometric» switch in the top right shows the base with the object icons, with zoom (wheel, double-click to reset) and pan as in 2D; it is read-only and hides inventory and menu, drag & drop and removal are available in the 2D view.
- **Remove ...**: removes from the grid in one go all buildings with plane service, those with passengers, or the boosts.

### Data
- The state is saved automatically on the local machine.
- From the menu you can export and import the configuration as a JSON file (`skyrama-base-planner.json`).

## Requirements

- Node.js with npm

## Development

```bash
npm install
npm start
```

Watch mode (reloads the window whenever a file in `src/` changes; F5 / Ctrl+R reload, F12 toggles DevTools):

```bash
npm run dev
```

## Windows build

```bash
npm run dist
```

Generates both the NSIS installer and the portable version in the `dist/` folder.

## Disclaimer

Amateur fan project, not affiliated with or endorsed by the owners of Skyrama. Names, images and trademarks belong to their respective owners. Images are not included in this repository: they are downloaded at runtime from the original sources and saved in the app's local cache. The code license does not apply to those images and trademarks.
