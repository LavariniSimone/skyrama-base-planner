# Skyrama Base Planner

Desktop app (Electron) for planning the layout of a Skyrama base on a grid: define building and boost types, place them on the map with drag & drop and instantly see the bonuses that boosts apply to nearby buildings.

## Features

### Grid
- Square grid, side length configurable from the menu (from 20 to 56 cells).
- Zoom with the mouse wheel, pan by dragging the background, double-click to reset the zoom.
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
- The «Planes» button in the top right opens the catalog of Skyrama planes with costs, rewards, price and unlock level.
- Tabs filter by type (All, Small, Medium, Large, Cargo, Searama, Helirama); flight duration and sort order (Level, XP, Aircoins, Goods) are chosen from the dropdowns.
- «Top» badges are computed on the planes currently listed (selected type tab and flight duration, regardless of sort order): each badge goes to the listed plane with the highest XP, Aircoins, Aircoins per passenger (passenger planes) or Goods (cargo planes). In case of a tie the badge goes to all of them; no badge is shown when no listed plane has a positive value.
- Icons are downloaded on first use as for presets; without a connection the cards show the initials.

### Inventory and placement
- The inventory is a compact, collapsible panel at the bottom; the collapsed state is remembered. The Airside, Landside and Decoration tabs filter the types, shown on a single row that scrolls horizontally, also with the mouse wheel. Each type is a card with icon and name: hovering shows its stats (size, effects and placed cards); under the name, boosts show their effect value (e.g. «-5% service» or «+10 passengers») and a counter shows how many are placed (with a limit: «n/max»). The popup also shows the costs, Aircoins and Aircash on separate lines.
- Clicking a card opens the type editor, where category and deletion are managed. The «+» button creates a new type.
- Drag an inventory card onto the grid as many times as needed: each valid drop creates a new placed card, up to the preset's limit if any (beyond which dragging is blocked with a warning); a preview shows whether the position is valid (no overlaps and nothing outside the edges).
- If a loaded or imported layout exceeds the limits, the cards are kept but highlighted and reported with a message; they are not removed.
- Cards on the grid are moved by dragging them and rotated with the right mouse button. While dragging (from the grid or from the inventory) the right button also rotates the card in hand; Esc cancels the drag, and dropping outside the grid cancels it too. While dragging, getting close to the edges of the zoomed grid scrolls the view in that direction, faster the closer you are to the edge. Scrolling only starts once the card in hand has entered the grid area, not while bringing it from the inventory or at the start of the drag.
- Hovering a card shows a popup with icon and details; for boosts the effect area is also highlighted.
- **Remove mode**: a click removes the card from the grid.
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

## Windows build

```bash
npm run dist
```

Generates both the NSIS installer and the portable version in the `dist/` folder.

## Disclaimer

Amateur fan project, not affiliated with or endorsed by the owners of Skyrama. Names, images and trademarks belong to their respective owners. Images are not included in this repository: they are downloaded at runtime from the original sources and saved in the app's local cache. The code license does not apply to those images and trademarks.
