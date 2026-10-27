const STORAGE_KEY = 'griglia-card:v1';
const MAX_GRID = 50;
const MAX_TYPE_SIZE = 30;
const MAX_RADIUS = 20;
const MIN_CELL = 8;
const ZOOM_MAX_CELL = 24;
const ZOOM_SPEED = 0.0015;
const PAN_THRESHOLD = 4;
const DEFAULT_COLOR = '#4a90e2';
const MSG_DURATION = 4000;
const MAX_DEPOSIT = 999;
const ICONS = {
  add: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>`,
  remove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2.4"><path d="M5 12h14"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2"><path d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"/></svg>`,
  delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" stroke-width="2"><path d="M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20"/></svg>`
};

const $ = id => document.getElementById(id);
const board = $('board');
const grid = $('grid');
const preview = $('preview');
const area = $('area');
const invList = $('invList');
const msgBox = $('msg');
const dialog = $('typeDialog');
const typeForm = $('typeForm');
const menuToggle = $('menuToggle');
const menuPanel = $('menuPanel');
const removeMenuToggle = $('removeMenuToggle');
const removeMenu = $('removeMenu');

let state;
let cellSize = 32;
let zoom = 1;
let baseCell = MIN_CELL;
let minCell = MIN_CELL;
const offset = { x: 0, y: 0 };
let pan = null;
const wheel = { delta: 0, x: 0, y: 0, frame: 0 };
let drag = null;
let removeMode = false;
let menuOpen = false;
let editingId = null;
let msgTimer = null;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function toInt(value, min, max, fallback = min) {
  if (value === '' || value == null) return fallback;
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function toAmount(value, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.min(max, Math.max(0, n)) * 100) / 100;
}

function formatNumber(n) {
  return String(Math.round(n * 100) / 100);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function movedMessage(count) {
  if (count === 0) return undefined;
  return count === 1 ? '1 card spostata in deposito' : `${count} card spostate in deposito`;
}

function defaultState() {
  return { version: 1, grid: { cols: 20, rows: 15 }, types: [], instances: [] };
}

function sanitizeType(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const kind = raw.kind === 'potenziamento' ? 'potenziamento' : 'edificio';
  const isBuilding = kind === 'edificio';
  const hotel = isBuilding && Boolean(raw.hotel);
  const effetto = !isBuilding && (raw.effetto === 'piazzole' || raw.effetto === 'hotel') ? raw.effetto : '';
  const quantita = effetto === 'hotel' ? Math.round(toAmount(raw.quantita, 1e6)) : effetto ? toAmount(raw.quantita, 1e6) : 0;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
    name: String(raw.name ?? '').trim().slice(0, 40) || 'Senza nome',
    color: /^#[0-9a-f]{6}$/i.test(raw.color) ? raw.color : DEFAULT_COLOR,
    w: toInt(raw.w, 1, MAX_TYPE_SIZE),
    h: toInt(raw.h, 1, MAX_TYPE_SIZE),
    kind,
    piazzola: isBuilding && Boolean(raw.piazzola),
    hotel,
    residenti: hotel ? toInt(raw.residenti, 0, 1e6, 0) : 0,
    minuti: hotel ? toInt(raw.minuti, 1, 1e5, 1) : 0,
    effetto,
    quantita,
    raggio: isBuilding ? 0 : toInt(raw.raggio, 0, MAX_RADIUS, 0)
  };
}

function sanitize(raw) {
  if (!raw || typeof raw !== 'object' || !raw.grid || typeof raw.grid !== 'object') return null;
  if (!Array.isArray(raw.types) || !Array.isArray(raw.instances)) return null;
  const types = [];
  const typeIds = new Set();
  for (const item of raw.types) {
    const type = sanitizeType(item);
    if (!type || typeIds.has(type.id)) continue;
    typeIds.add(type.id);
    types.push(type);
  }
  const instances = [];
  const instanceIds = new Set();
  for (const item of raw.instances) {
    if (!item || !typeIds.has(item.typeId)) continue;
    const id = typeof item.id === 'string' && item.id && !instanceIds.has(item.id) ? item.id : uid();
    instanceIds.add(id);
    const placed = Number.isInteger(item.x) && Number.isInteger(item.y) && item.x >= 0 && item.y >= 0;
    instances.push({ id, typeId: item.typeId, x: placed ? item.x : null, y: placed ? item.y : null, rot: placed && Boolean(item.rot) });
  }
  const grid = raw.grid;
  return {
    version: 1,
    grid: { cols: toInt(grid.cols, 1, MAX_GRID, 20), rows: toInt(grid.rows, 1, MAX_GRID, 15) },
    types,
    instances
  };
}

function loadState() {
  let loaded = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) loaded = sanitize(JSON.parse(raw));
  } catch {
    loaded = null;
  }
  state = loaded ?? defaultState();
  normalizePlacements();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showMsg('Impossibile salvare i dati nel browser');
  }
}

function showMsg(text) {
  msgBox.textContent = text;
  msgBox.classList.add('visible');
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => msgBox.classList.remove('visible'), MSG_DURATION);
}

function commit(msg) {
  saveState();
  render();
  if (msg) showMsg(msg);
}

function typeOf(id) {
  return state.types.find(t => t.id === id);
}

function instanceOf(id) {
  return state.instances.find(i => i.id === id);
}

function isPlaced(inst) {
  return inst.x !== null;
}

function sizeOf(type, rot) {
  return rot ? { w: type.h, h: type.w } : { w: type.w, h: type.h };
}

function rectOf(inst) {
  return { x: inst.x, y: inst.y, ...sizeOf(typeOf(inst.typeId), inst.rot) };
}

function unplace(inst) {
  inst.x = null;
  inst.y = null;
  inst.rot = false;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function inBounds(rect) {
  return rect.x >= 0 && rect.y >= 0 && rect.x + rect.w <= state.grid.cols && rect.y + rect.h <= state.grid.rows;
}

function canPlace(size, x, y, ignoreId) {
  const rect = { x, y, w: size.w, h: size.h };
  if (!inBounds(rect)) return false;
  return !state.instances.some(i => isPlaced(i) && i.id !== ignoreId && overlaps(rectOf(i), rect));
}

function normalizePlacements() {
  const accepted = [];
  let moved = 0;
  for (const inst of state.instances) {
    if (!isPlaced(inst)) continue;
    const rect = rectOf(inst);
    if (inBounds(rect) && !accepted.some(other => overlaps(other, rect))) {
      accepted.push(rect);
    } else {
      unplace(inst);
      moved++;
    }
  }
  return moved;
}

function effectArea(type, rect) {
  return { x: rect.x - type.raggio, y: rect.y - type.raggio, w: rect.w + 2 * type.raggio, h: rect.h + 2 * type.raggio };
}

function bonusOf(inst, effetto) {
  const target = rectOf(inst);
  let total = 0;
  for (const other of state.instances) {
    if (!isPlaced(other)) continue;
    const type = typeOf(other.typeId);
    if (type.kind === 'potenziamento' && type.effetto === effetto && overlaps(effectArea(type, rectOf(other)), target)) {
      total += type.quantita;
    }
  }
  return total;
}

function piazzolaBonus(inst) {
  return typeOf(inst.typeId).piazzola ? bonusOf(inst, 'piazzole') : 0;
}

function addCopies(typeId, count) {
  for (let i = 0; i < count; i++) {
    state.instances.push({ id: uid(), typeId, x: null, y: null, rot: false });
  }
  commit();
}

function removeCopies(typeId, count) {
  const free = state.instances.filter(i => i.typeId === typeId && !isPlaced(i));
  const ids = new Set(free.slice(0, count).map(i => i.id));
  state.instances = state.instances.filter(i => !ids.has(i.id));
  commit();
}

function setDeposit(typeId, count) {
  const free = state.instances.filter(i => i.typeId === typeId && !isPlaced(i)).length;
  if (count > free) addCopies(typeId, count - free);
  else if (count < free) removeCopies(typeId, free - count);
  else renderInventory();
}

function saveType(data, id) {
  const type = sanitizeType({ ...data, id: id ?? uid() });
  const index = state.types.findIndex(t => t.id === type.id);
  if (index >= 0) state.types[index] = type;
  else state.types.push(type);
  commit(movedMessage(normalizePlacements()));
}

function deleteType(id) {
  const type = typeOf(id);
  const copies = state.instances.filter(i => i.typeId === id).length;
  const suffix = copies === 0 ? '' : copies === 1 ? ' e la sua copia' : ` e le sue ${copies} copie`;
  if (!confirm(`Eliminare "${type.name}"${suffix}?`)) return;
  state.types = state.types.filter(t => t.id !== id);
  state.instances = state.instances.filter(i => i.typeId !== id);
  commit();
}

function placeInstance(instId, x, y, rot) {
  const inst = instanceOf(instId);
  inst.x = x;
  inst.y = y;
  inst.rot = rot;
  commit();
}

function rotateInstance(instId) {
  const inst = instanceOf(instId);
  const type = typeOf(inst.typeId);
  if (type.w === type.h) return;
  if (!canPlace(sizeOf(type, !inst.rot), inst.x, inst.y, inst.id)) {
    showMsg('Spazio insufficiente per ruotare la card');
    return;
  }
  inst.rot = !inst.rot;
  commit();
}

function toDeposit(instId) {
  unplace(instanceOf(instId));
  commit();
}

function removePlacedWhere(predicate) {
  let count = 0;
  for (const inst of state.instances) {
    if (isPlaced(inst) && predicate(typeOf(inst.typeId))) {
      unplace(inst);
      count++;
    }
  }
  if (count === 0) {
    showMsg('Nessuna card da rimuovere');
    return;
  }
  commit(count === 1 ? '1 card rimossa dalla griglia' : `${count} card rimosse dalla griglia`);
}

function resizeGrid(cols, rows) {
  state.grid = { cols: toInt(cols, 1, MAX_GRID, state.grid.cols), rows: toInt(rows, 1, MAX_GRID, state.grid.rows) };
  zoom = 1;
  commit(movedMessage(normalizePlacements()));
  centerBoard();
}

function textColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#111827' : '#ffffff';
}

function cardLines(inst) {
  const type = typeOf(inst.typeId);
  if (type.kind === 'potenziamento') {
    if (type.effetto === 'piazzole') return [type.name, `+${formatNumber(type.quantita)}% piazzole · r ${type.raggio}`];
    if (type.effetto === 'hotel') return [type.name, `+${formatNumber(type.quantita)} hotel · r ${type.raggio}`];
    return [type.name, 'nessun effetto'];
  }
  const lines = [type.name];
  if (type.piazzola) lines.push(`Piazzola +${formatNumber(piazzolaBonus(inst))}%`);
  if (type.hotel) {
    const bonus = bonusOf(inst, 'hotel');
    lines.push(`Residenti: ${type.residenti + bonus}` + (bonus > 0 ? ` (${type.residenti} + ${bonus})` : ''));
  }
  return lines;
}

function createCard(inst) {
  const type = typeOf(inst.typeId);
  const rect = rectOf(inst);
  const lines = cardLines(inst);
  const card = el('div', 'card');
  card.dataset.id = inst.id;
  card.draggable = !removeMode;
  card.style.gridColumn = `${rect.x + 1} / span ${rect.w}`;
  card.style.gridRow = `${rect.y + 1} / span ${rect.h}`;
  card.style.background = type.color;
  card.style.color = textColor(type.color);
  card.title = lines.join('\n');
  card.append(el('div', 'card-name', lines[0]));
  for (const line of lines.slice(1)) card.append(el('div', 'card-info', line));
  if (type.kind === 'potenziamento') {
    card.addEventListener('mouseenter', () => showArea(type, rect));
    card.addEventListener('mouseleave', hideArea);
  }
  return card;
}

function showArea(type, rect) {
  if (!type.effetto) {
    hideArea();
    return;
  }
  const a = effectArea(type, rect);
  const x0 = Math.max(0, a.x);
  const y0 = Math.max(0, a.y);
  const x1 = Math.min(state.grid.cols, a.x + a.w);
  const y1 = Math.min(state.grid.rows, a.y + a.h);
  if (x1 <= x0 || y1 <= y0) {
    hideArea();
    return;
  }
  area.style.left = `${x0 * cellSize}px`;
  area.style.top = `${y0 * cellSize}px`;
  area.style.width = `${(x1 - x0) * cellSize}px`;
  area.style.height = `${(y1 - y0) * cellSize}px`;
  area.style.background = type.color;
  area.hidden = false;
}

function hideArea() {
  area.hidden = true;
}

function showPreview(rect, valid) {
  preview.style.left = `${rect.x * cellSize}px`;
  preview.style.top = `${rect.y * cellSize}px`;
  preview.style.width = `${rect.w * cellSize}px`;
  preview.style.height = `${rect.h * cellSize}px`;
  preview.className = valid ? 'valid' : 'invalid';
  preview.hidden = false;
}

function hidePreview() {
  preview.hidden = true;
}

function renderGrid() {
  hideArea();
  hidePreview();
  grid.style.setProperty('--cols', state.grid.cols);
  grid.style.setProperty('--rows', state.grid.rows);
  const cards = state.instances.filter(isPlaced).map(createCard);
  grid.replaceChildren(...cards, area, preview);
  $('cols').value = state.grid.cols;
  $('rows').value = state.grid.rows;
}

function createInventoryCard(type) {
  const own = state.instances.filter(i => i.typeId === type.id);
  const placed = own.filter(isPlaced).length;
  const deposit = own.length - placed;

  const card = el('div', 'inv-card');
  card.dataset.id = type.id;

  const swatch = el('span', 'swatch');
  swatch.style.background = type.color;
  const handle = el('span', 'inv-handle');
  handle.draggable = deposit > 0;
  handle.title = type.name;
  handle.append(swatch, el('span', 'inv-name', type.name));

  const qty = el('input');
  qty.type = 'number';
  qty.min = String(placed);
  qty.max = String(MAX_DEPOSIT);
  qty.value = own.length;
  qty.dataset.role = 'deposit';
  qty.setAttribute('aria-label', 'Piazzole totali');
  qty.title = `Piazzole totali (in deposito: ${deposit})`;

  const iconButton = (action, label, className = '') => {
    const button = el('button', className);
    button.dataset.action = action;
    button.innerHTML = ICONS[action];
    button.setAttribute('aria-label', label);
    button.title = label;
    return button;
  };
  const add = iconButton('add', 'Aggiungi una copia');
  add.disabled = own.length >= MAX_DEPOSIT;
  const remove = iconButton('remove', 'Rimuovi una copia dal deposito');
  remove.disabled = deposit === 0;
  const edit = iconButton('edit', 'Modifica');
  const del = iconButton('delete', 'Elimina', 'danger');

  const head = el('div', 'inv-card-head');
  const actions = el('span', 'inv-actions');
  actions.append(edit, del);
  head.append(handle, actions);

  const meta = el('div', 'inv-meta');
  meta.append(el('span', 'badge', type.kind === 'edificio' ? 'Edificio' : 'Potenziamento'), el('span', 'inv-dim', `${type.w}×${type.h}`));

  const stepper = el('span', 'inv-stepper');
  stepper.append(remove, qty, add);
  const foot = el('div', 'inv-foot');
  foot.append(el('span', 'inv-count', `Piazzate: ${placed}`), stepper);

  card.append(head, meta, foot);
  return card;
}

function renderInventory() {
  if (state.types.length === 0) {
    invList.replaceChildren(el('p', 'inv-empty', 'Nessuna tipologia: creane una con «Nuova tipologia».'));
    return;
  }
  invList.replaceChildren(...state.types.map(createInventoryCard));
}

function layout() {
  const style = getComputedStyle(board);
  const availW = board.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const availH = board.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  const fit = Math.floor(availW / state.grid.cols);
  const base = Math.min(ZOOM_MAX_CELL, Math.max(MIN_CELL, fit));
  baseCell = base;
  minCell = Math.min(base, Math.max(MIN_CELL, Math.floor(Math.min(availW / state.grid.cols, availH / state.grid.rows))));
  cellSize = Math.min(ZOOM_MAX_CELL, Math.max(minCell, Math.round(base * Math.min(ZOOM_MAX_CELL / base, Math.max(minCell / base, zoom)))));
  grid.style.setProperty('--cell', `${cellSize}px`);
}

function boardArea() {
  const style = getComputedStyle(board);
  const padX = parseFloat(style.paddingLeft);
  const padY = parseFloat(style.paddingTop);
  return {
    padX,
    padY,
    w: board.clientWidth - padX - parseFloat(style.paddingRight),
    h: board.clientHeight - padY - parseFloat(style.paddingBottom),
    gridW: state.grid.cols * cellSize,
    gridH: state.grid.rows * cellSize
  };
}

function clampAxis(value, pad, avail, size) {
  const a = pad;
  const b = pad + avail - size;
  return Math.min(Math.max(a, b), Math.max(Math.min(a, b), value));
}

function setOffset(x, y) {
  const a = boardArea();
  offset.x = a.gridW <= a.w ? a.padX : clampAxis(x, a.padX, a.w, a.gridW);
  offset.y = a.gridH <= a.h ? a.padY : clampAxis(y, a.padY, a.h, a.gridH);
  grid.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
}

function applyZoom(next, clientX, clientY) {
  const rect = board.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  const ux = (px - offset.x) / cellSize;
  const uy = (py - offset.y) / cellSize;
  zoom = Math.min(ZOOM_MAX_CELL / baseCell, Math.max(minCell / baseCell, next));
  layout();
  setOffset(px - ux * cellSize, py - uy * cellSize);
}

function flushWheel() {
  wheel.frame = 0;
  const factor = Math.exp(-wheel.delta * ZOOM_SPEED);
  wheel.delta = 0;
  applyZoom(zoom * factor, wheel.x, wheel.y);
}

function render() {
  renderGrid();
  renderInventory();
  layout();
}

function setRemoveMode(active) {
  removeMode = active;
  document.body.classList.toggle('remove-mode', active);
  const toggle = $('toggleRemove');
  toggle.classList.toggle('active', active);
  toggle.setAttribute('aria-pressed', String(active));
  toggle.textContent = active ? 'Modalità rimozione: attiva' : 'Modalità rimozione';
  for (const card of grid.querySelectorAll('.card')) card.draggable = !active;
}

function setRemoveMenuOpen(open) {
  removeMenu.hidden = !open;
  removeMenuToggle.setAttribute('aria-expanded', String(open));
}

function setMenuOpen(open) {
  if (!open && menuPanel.contains(document.activeElement)) menuToggle.focus();
  menuOpen = open;
  menuPanel.classList.toggle('open', open);
  menuPanel.inert = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Chiudi menù' : 'Apri menù');
  if (open) $('cols').focus();
}

function scrollBoardTopRight() {
  const a = boardArea();
  const x = a.gridW <= a.w ? a.padX : a.padX + a.w - a.gridW;
  const y = a.padY;
  setOffset(x, y);
}

function centerBoard() {
  const a = boardArea();
  setOffset(a.padX + (a.w - a.gridW) / 2, a.padY + (a.h - a.gridH) / 2);
}

function refreshLayout() {
  const rect = board.getBoundingClientRect();
  applyZoom(zoom, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function cellFromEvent(e) {
  const rect = grid.getBoundingClientRect();
  return {
    x: Math.floor((e.clientX - rect.left) / cellSize),
    y: Math.floor((e.clientY - rect.top) / cellSize)
  };
}

function endDrag() {
  drag = null;
  grid.classList.remove('is-drag-active');
  grid.querySelector('.card.is-dragging')?.classList.remove('is-dragging');
  hidePreview();
  hideArea();
}

grid.addEventListener('dragstart', e => {
  const card = e.target.closest?.('.card');
  if (!card || removeMode) {
    e.preventDefault();
    return;
  }
  const inst = instanceOf(card.dataset.id);
  const rect = rectOf(inst);
  const cell = cellFromEvent(e);
  drag = {
    instId: inst.id,
    typeId: inst.typeId,
    rot: inst.rot,
    offX: Math.min(rect.w - 1, Math.max(0, cell.x - rect.x)),
    offY: Math.min(rect.h - 1, Math.max(0, cell.y - rect.y))
  };
  setTimeout(() => drag && card.classList.add('is-dragging'));
  grid.classList.add('is-drag-active');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', inst.id);
});

grid.addEventListener('dragover', e => {
  if (!drag) return;
  e.preventDefault();
  const type = typeOf(drag.typeId);
  const cell = cellFromEvent(e);
  const rect = { x: cell.x - drag.offX, y: cell.y - drag.offY, ...sizeOf(type, drag.rot) };
  const valid = canPlace(rect, rect.x, rect.y, drag.instId);
  e.dataTransfer.dropEffect = valid ? 'move' : 'none';
  showPreview(rect, valid);
  if (type.kind === 'potenziamento') showArea(type, rect);
});

grid.addEventListener('dragleave', e => {
  if (grid.contains(e.relatedTarget)) return;
  hidePreview();
  hideArea();
});

grid.addEventListener('drop', e => {
  if (!drag) return;
  e.preventDefault();
  const cell = cellFromEvent(e);
  const x = cell.x - drag.offX;
  const y = cell.y - drag.offY;
  const { instId, rot } = drag;
  const size = sizeOf(typeOf(drag.typeId), rot);
  endDrag();
  if (canPlace(size, x, y, instId)) placeInstance(instId, x, y, rot);
});

grid.addEventListener('contextmenu', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  e.preventDefault();
  rotateInstance(card.dataset.id);
});

grid.addEventListener('click', e => {
  if (!removeMode) return;
  const card = e.target.closest('.card');
  if (card) toDeposit(card.dataset.id);
});

document.addEventListener('dragend', endDrag);

invList.addEventListener('dragstart', e => {
  const handle = e.target.closest?.('.inv-handle');
  const inst = handle && handle.draggable ? state.instances.find(i => i.typeId === handle.closest('.inv-card').dataset.id && !isPlaced(i)) : null;
  if (!inst) {
    e.preventDefault();
    return;
  }
  drag = { instId: inst.id, typeId: inst.typeId, rot: false, offX: 0, offY: 0 };
  grid.classList.add('is-drag-active');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', inst.id);
});

invList.addEventListener('change', e => {
  if (e.target.dataset.role !== 'deposit') return;
  const id = e.target.closest('.inv-card').dataset.id;
  const placed = state.instances.filter(i => i.typeId === id && isPlaced(i)).length;
  const total = toInt(e.target.value, 0, MAX_DEPOSIT, placed);
  setDeposit(id, Math.max(0, total - placed));
  if (total < placed) showMsg(`Il totale non può scendere sotto le ${placed} posizionate in griglia`);
});

invList.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset.role === 'deposit') e.target.blur();
});

invList.addEventListener('click', e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;
  const id = button.closest('.inv-card').dataset.id;
  switch (button.dataset.action) {
    case 'add': addCopies(id, 1); break;
    case 'remove': removeCopies(id, 1); break;
    case 'edit': openTypeDialog(id); break;
    case 'delete': deleteType(id); break;
  }
});

function currentEffect() {
  if ($('fEffPiazzole').checked) return 'piazzole';
  if ($('fEffHotel').checked) return 'hotel';
  return '';
}

function syncDialog() {
  const isBuilding = $('fKind').value === 'edificio';
  const hotel = $('fHotel').checked;
  $('edificioFs').hidden = !isBuilding;
  $('edificioFs').disabled = !isBuilding;
  $('potenzFs').hidden = isBuilding;
  $('potenzFs').disabled = isBuilding;
  $('hotelFields').hidden = !hotel;
  $('fResidenti').disabled = !hotel;
  $('fMinuti').disabled = !hotel;
  const effect = currentEffect();
  $('lblQuantita').textContent = effect === 'piazzole' ? 'Bonus piazzole (%)' : effect === 'hotel' ? 'Bonus residenti' : 'Quantità';
  $('fQuantita').disabled = !effect || isBuilding;
  $('fQuantita').step = effect === 'hotel' ? '1' : 'any';
}

function openTypeDialog(id) {
  editingId = id ?? null;
  const type = id ? typeOf(id) : sanitizeType({ name: '', color: DEFAULT_COLOR });
  $('dialogTitle').textContent = id ? 'Modifica tipologia' : 'Nuova tipologia';
  $('fName').value = id ? type.name : '';
  $('fColor').value = type.color;
  $('fW').value = type.w;
  $('fH').value = type.h;
  $('fKind').value = type.kind;
  $('fPiazzola').checked = type.piazzola;
  $('fHotel').checked = type.hotel;
  $('fResidenti').value = type.residenti;
  $('fMinuti').value = type.minuti || 1;
  $('fEffPiazzole').checked = type.effetto === 'piazzole';
  $('fEffHotel').checked = type.effetto === 'hotel';
  $('fQuantita').value = type.quantita;
  $('fRaggio').value = type.raggio;
  syncDialog();
  dialog.showModal();
}

function readTypeForm() {
  return {
    name: $('fName').value,
    color: $('fColor').value,
    w: $('fW').value,
    h: $('fH').value,
    kind: $('fKind').value,
    piazzola: $('fPiazzola').checked,
    hotel: $('fHotel').checked,
    residenti: $('fResidenti').value,
    minuti: $('fMinuti').value,
    effetto: currentEffect(),
    quantita: $('fQuantita').value,
    raggio: $('fRaggio').value
  };
}

$('fKind').addEventListener('change', syncDialog);
$('fHotel').addEventListener('change', syncDialog);
$('fEffPiazzole').addEventListener('change', () => {
  if ($('fEffPiazzole').checked) $('fEffHotel').checked = false;
  syncDialog();
});
$('fEffHotel').addEventListener('change', () => {
  if ($('fEffHotel').checked) $('fEffPiazzole').checked = false;
  syncDialog();
});
$('cancelType').addEventListener('click', () => dialog.close());
typeForm.addEventListener('submit', e => {
  e.preventDefault();
  saveType(readTypeForm(), editingId);
  dialog.close();
});

$('newType').addEventListener('click', () => openTypeDialog());
$('applyGrid').addEventListener('click', () => resizeGrid($('cols').value, $('rows').value));

$('toggleRemove').addEventListener('click', () => setRemoveMode(!removeMode));
$('removePiazzole').addEventListener('click', () => removePlacedWhere(t => t.kind === 'edificio' && t.piazzola));
$('removeHotel').addEventListener('click', () => removePlacedWhere(t => t.kind === 'edificio' && t.hotel));
$('removePotenziamenti').addEventListener('click', () => removePlacedWhere(t => t.kind === 'potenziamento'));
removeMenuToggle.addEventListener('click', () => setRemoveMenuOpen(removeMenu.hidden));
removeMenu.addEventListener('click', e => {
  if (e.target.closest('[role="menuitem"]')) setRemoveMenuOpen(false);
});

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'skyrama-base-planner.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let imported = null;
    try {
      imported = sanitize(JSON.parse(reader.result));
    } catch {
      imported = null;
    }
    if (!imported) {
      showMsg('File non valido');
      return;
    }
    state = imported;
    const moved = normalizePlacements();
    zoom = 1;
    commit(movedMessage(moved) ?? 'Importazione completata');
    centerBoard();
  };
  reader.onerror = () => showMsg('Impossibile leggere il file');
  reader.readAsText(file);
}

$('exportBtn').addEventListener('click', () => {
  exportJSON();
  setMenuOpen(false);
});
$('importBtn').addEventListener('click', () => {
  $('importFile').click();
  setMenuOpen(false);
});
$('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) importJSON(file);
  e.target.value = '';
});

menuToggle.addEventListener('click', () => setMenuOpen(!menuOpen));
document.addEventListener('pointerdown', e => {
  if (menuOpen && !menuPanel.contains(e.target) && !menuToggle.contains(e.target)) setMenuOpen(false);
  if (!removeMenu.hidden && !removeMenu.parentElement.contains(e.target)) setRemoveMenuOpen(false);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || dialog.open) return;
  if (menuOpen) setMenuOpen(false);
  if (!removeMenu.hidden) {
    setRemoveMenuOpen(false);
    removeMenuToggle.focus();
  }
});

board.addEventListener('wheel', e => {
  e.preventDefault();
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
  wheel.delta += e.deltaY * unit;
  wheel.x = e.clientX;
  wheel.y = e.clientY;
  if (!wheel.frame) wheel.frame = requestAnimationFrame(flushWheel);
}, { passive: false });

board.addEventListener('dblclick', e => {
  if (e.target === board || e.target === grid) applyZoom(1, e.clientX, e.clientY);
});

board.addEventListener('pointerdown', e => {
  if (e.button !== 0 || e.pointerType === 'touch' || (e.target !== board && e.target !== grid)) return;
  pan = { id: e.pointerId, x: e.clientX, y: e.clientY, left: offset.x, top: offset.y, active: false };
  board.setPointerCapture(e.pointerId);
});

board.addEventListener('pointermove', e => {
  if (!pan || e.pointerId !== pan.id) return;
  if (!(e.buttons & 1)) {
    endPan(e);
    return;
  }
  const dx = e.clientX - pan.x;
  const dy = e.clientY - pan.y;
  if (!pan.active) {
    if (Math.hypot(dx, dy) < PAN_THRESHOLD) return;
    pan.active = true;
    board.classList.add('is-panning');
  }
  const a = boardArea();
  setOffset(a.gridW > a.w ? pan.left + dx : offset.x, a.gridH > a.h ? pan.top + dy : offset.y);
});

function endPan(e) {
  if (!pan || e.pointerId !== pan.id) return;
  pan = null;
  board.classList.remove('is-panning');
}

board.addEventListener('pointerup', endPan);
board.addEventListener('pointercancel', endPan);
board.addEventListener('lostpointercapture', endPan);

window.addEventListener('resize', refreshLayout);

loadState();
render();
scrollBoardTopRight();
document.fonts?.ready.then(() => {
  layout();
  scrollBoardTopRight();
});
