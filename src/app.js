const STORAGE_KEY = 'griglia-card:v1';
const INV_KEY = 'griglia-card:inv-collapsed';
const MIN_GRID = 20;
const MAX_GRID = 56;
const MAX_TYPE_SIZE = 30;
const MAX_RADIUS = 20;
const MAX_REDUCTION = 40;
const MIN_CELL = 8;
const ZOOM_MAX_CELL = 36;
const ZOOM_SPEED = 0.0015;
const PAN_THRESHOLD = 4;
const AUTOSCROLL_EDGE = 48;
const AUTOSCROLL_SPEED = 900;
const AUTOSCROLL_MAX_DT = 50;
const MSG_DURATION = 4000;
const COMPACT_CARD = 3;
const POPUP_GAP = 8;
const POPUP_MARGIN = 8;
const ISO_ICON_RATIO = 1;
const DEFAULT_ART = { fit: 1, ax: 0.5, ay: 1, rise: ISO_ICON_RATIO };
const ISO_MAX_K = ZOOM_MAX_CELL / Math.SQRT2;
const PRESETS = globalThis.SKYRAMA_PRESETS ?? [];
const PRESET_BY_ICON = new Map(PRESETS.map(p => [p.icon, p]));
const CATEGORIES = ['airside', 'landside', 'decorazione'];
const VEHICLES = globalThis.SKYRAMA_VEHICLES ?? [];
const VEHICLE_GROUP_LABELS = { small: 'Small', medium: 'Medium', large: 'Large', cargo: 'Cargo', searama: 'Searama', ramacopter: 'Helirama' };
const VEHICLE_GROUP_PLURALS = { small: 'small planes', medium: 'medium planes', large: 'large planes', cargo: 'cargo planes', searama: 'Searamas', ramacopter: 'Heliramas' };
const VEHICLE_CATEGORY_SHORT = { small: 'S', medium: 'M', large: 'L' };

const $ = id => document.getElementById(id);
const board = $('board');
const grid = $('grid');
const iso = $('iso');
const isoGround = $('isoGround');
const preview = $('preview');
const area = $('area');
const invList = $('invList');
const invTabs = $('invTabs');
const inventory = $('inventory');
const invBody = $('invBody');
const invToggle = $('invToggle');
const msgBox = $('msg');
const dialog = $('typeDialog');
const typeForm = $('typeForm');
const menuToggle = $('menuToggle');
const menuPanel = $('menuPanel');
const removeMenuToggle = $('removeMenuToggle');
const removeMenu = $('removeMenu');
const presetDialog = $('presetDialog');
const presetGrid = $('presetGrid');
const presetTabs = $('presetTabs');
const vehicleDialog = $('vehicleDialog');
const vehicleGrid = $('vehicleGrid');
const vehicleTabs = $('vehicleTabs');
const vehicleDurationSelect = $('vehicleDuration');
const vehicleSortSelect = $('vehicleSort');
const cardPopup = $('cardPopup');
const dragGhost = $('dragGhost');

let state;
let cellSize = 32;
let zoom = 1;
let baseCell = MIN_CELL;
let minCell = MIN_CELL;
const offset = { x: 0, y: 0 };
let pan = null;
const wheel = { delta: 0, x: 0, y: 0, frame: 0 };
const autoScroll = { frame: 0, last: 0 };
let drag = null;
let suppressMenu = false;
let removeMode = false;
let isoMode = false;
let isoHead = 0;
let isoFitK = 0;
let isoK = 0;
let otherView = null;
let menuOpen = false;
let editingId = null;
let msgTimer = null;
let formIcon = '';
let presetCategory = 'airside';
let vehicleGroupFilter = 'all';
let vehicleDuration = '';
let vehicleSort = 'level';
let invCategory = 'airside';
const failedIcons = new Set();

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

const EFFECT_LABELS = { hotel: 'Passenger bonus', piazzole: 'Service time reduction' };

function boostValue(type) {
  return type.effetto === 'piazzole' ? `-${formatNumber(type.quantita)}%` : `+${formatNumber(type.quantita)}`;
}

function boostLabel(type) {
  return `${boostValue(type)} ${type.effetto === 'piazzole' ? 'service' : 'passengers'}`;
}

function formatDuration(minuti) {
  if (minuti < 60) return `${minuti}min`;
  const h = Math.floor(minuti / 60);
  const m = minuti % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function hasIcon(type) {
  return Boolean(type.icon) && !failedIcons.has(type.icon);
}

function createIconImg(icon, className, onError) {
  const img = el('img', className);
  img.alt = '';
  img.draggable = false;
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    failedIcons.add(icon);
    onError?.();
  }, { once: true });
  img.src = `skyicon://icon/${icon}`;
  return img;
}

function movedMessage(count) {
  if (count === 0) return undefined;
  return count === 1 ? '1 card removed from the grid' : `${count} cards removed from the grid`;
}

function syncedMessage(count) {
  if (count === 0) return undefined;
  return count === 1 ? '1 type updated from presets' : `${count} types updated from presets`;
}

function joinMessages(...parts) {
  const text = parts.filter(Boolean).join(' · ');
  return text || undefined;
}

function limitMessage() {
  const names = overLimitNames();
  return names.length > 0 ? `Limit exceeded: ${names.join(', ')}` : undefined;
}

function defaultState() {
  return { version: 1, grid: { cols: 20, rows: 20 }, types: [], instances: [] };
}

function defaultCategory(icon, kind, hotel, piazzola) {
  return PRESET_BY_ICON.get(icon)?.category ?? (kind === 'potenziamento' ? 'decorazione' : hotel && !piazzola ? 'landside' : 'airside');
}

function sanitizeType(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const kind = raw.kind === 'potenziamento' ? 'potenziamento' : 'edificio';
  const isBuilding = kind === 'edificio';
  const hotel = isBuilding && Boolean(raw.hotel);
  const effetto = !isBuilding && (raw.effetto === 'piazzole' || raw.effetto === 'hotel') ? raw.effetto : '';
  const icon = typeof raw.icon === 'string' && PRESET_BY_ICON.has(raw.icon) ? raw.icon : '';
  const piazzola = isBuilding && Boolean(raw.piazzola);
  const quantita = effetto === 'hotel' ? Math.round(toAmount(raw.quantita, 1e6)) : effetto ? toAmount(raw.quantita, MAX_REDUCTION) : 0;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
    name: String(raw.name ?? '').trim().slice(0, 40) || 'Unnamed',
    icon,
    category: CATEGORIES.includes(raw.category) ? raw.category : defaultCategory(icon, kind, hotel, piazzola),
    w: toInt(raw.w, 1, MAX_TYPE_SIZE),
    h: toInt(raw.h, 1, MAX_TYPE_SIZE),
    kind,
    piazzola,
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
    const placed = Number.isInteger(item.x) && Number.isInteger(item.y) && item.x >= 0 && item.y >= 0;
    if (!placed) continue;
    const id = typeof item.id === 'string' && item.id && !instanceIds.has(item.id) ? item.id : uid();
    instanceIds.add(id);
    instances.push({ id, typeId: item.typeId, x: item.x, y: item.y, rot: Boolean(item.rot) });
  }
  const grid = raw.grid;
  const size = Math.max(toInt(grid.cols, MIN_GRID, MAX_GRID, MIN_GRID), toInt(grid.rows, MIN_GRID, MAX_GRID, MIN_GRID));
  return {
    version: 1,
    grid: { cols: size, rows: size },
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
  const synced = syncPresetTypes();
  const moved = normalizePlacements();
  if (synced > 0 || moved > 0) saveState();
  const msg = joinMessages(syncedMessage(synced), movedMessage(moved), limitMessage());
  if (msg) showMsg(msg);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showMsg('Unable to save data in the browser');
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
  const kept = [];
  for (const inst of state.instances) {
    const rect = rectOf(inst);
    if (inBounds(rect) && !accepted.some(other => overlaps(other, rect))) {
      accepted.push(rect);
      kept.push(inst);
    }
  }
  const removed = state.instances.length - kept.length;
  state.instances = kept;
  return removed;
}

function syncPresetTypes() {
  let count = 0;
  state.types = state.types.map(type => {
    const preset = PRESET_BY_ICON.get(type.icon);
    if (!preset) return type;
    const next = sanitizeType({ ...preset, id: type.id });
    if (JSON.stringify(next) === JSON.stringify(type)) return type;
    count++;
    return next;
  });
  return count;
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
  return typeOf(inst.typeId).piazzola ? Math.min(MAX_REDUCTION, bonusOf(inst, 'piazzole')) : 0;
}

function saveType(data, id) {
  const type = sanitizeType({ ...data, id: id ?? uid() });
  const index = state.types.findIndex(t => t.id === type.id);
  if (index >= 0) state.types[index] = type;
  else state.types.push(type);
  const moved = normalizePlacements();
  invCategory = type.category;
  commit(movedMessage(moved));
  return type.id;
}

function deleteType(id) {
  const type = typeOf(id);
  const placed = state.instances.filter(i => i.typeId === id).length;
  const suffix = placed === 0 ? '' : placed === 1 ? ' and its card on the grid' : ` and its ${placed} cards on the grid`;
  if (!confirm(`Delete "${type.name}"${suffix}?`)) return;
  state.types = state.types.filter(t => t.id !== id);
  state.instances = state.instances.filter(i => i.typeId !== id);
  commit();
}

function createInstance(typeId, x, y, rot) {
  state.instances.push({ id: uid(), typeId, x, y, rot });
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
    showMsg('Not enough space to rotate the card');
    return;
  }
  inst.rot = !inst.rot;
  commit();
}

function toDeposit(instId) {
  state.instances = state.instances.filter(i => i.id !== instId);
  commit();
}

function removePlacedWhere(predicate) {
  const before = state.instances.length;
  state.instances = state.instances.filter(i => !predicate(typeOf(i.typeId)));
  const count = before - state.instances.length;
  if (count === 0) {
    showMsg('No cards to remove');
    return;
  }
  commit(movedMessage(count));
}

function resizeGrid(size) {
  const n = toInt(size, MIN_GRID, MAX_GRID, state.grid.cols);
  state.grid = { cols: n, rows: n };
  zoom = 1;
  otherView = null;
  commit(movedMessage(normalizePlacements()));
  centerBoard();
}

function cardLines(inst) {
  const type = typeOf(inst.typeId);
  if (type.kind === 'potenziamento') {
    if (type.effetto === 'piazzole') return [type.name, `${boostValue(type)} service time · r ${type.raggio}`];
    if (type.effetto === 'hotel') return [type.name, `${boostValue(type)} passengers · r ${type.raggio}`];
    return [type.name, 'no effect'];
  }
  const lines = [type.name];
  if (type.piazzola) lines.push(`Plane service -${formatNumber(piazzolaBonus(inst))}%`);
  if (type.hotel) {
    const bonus = bonusOf(inst, 'hotel');
    lines.push(`Passengers: ${type.residenti + bonus}` + (bonus > 0 ? ` (${type.residenti} + ${bonus})` : ''));
  }
  return lines;
}

function createCard(inst) {
  const type = typeOf(inst.typeId);
  const rect = rectOf(inst);
  const card = el('div', 'card');
  card.dataset.id = inst.id;
  card.style.gridColumn = `${rect.x + 1} / span ${rect.w}`;
  card.style.gridRow = `${rect.y + 1} / span ${rect.h}`;
  card.classList.add(type.kind === 'potenziamento' ? 'is-boost' : 'is-building');
  if (hasIcon(type)) {
    card.classList.add('has-icon');
    card.append(createIconImg(type.icon, 'card-icon', () => {
      hideCardPopup();
      card.replaceWith(createCard(inst));
    }));
    if (Math.min(rect.w, rect.h) >= COMPACT_CARD) card.append(el('div', 'card-name', type.name));
  } else {
    const lines = cardLines(inst);
    card.append(el('div', 'card-name', lines[0]));
    for (const line of lines.slice(1)) card.append(el('div', 'card-info', line));
  }
  card.addEventListener('mouseenter', () => showCardPopup(inst, card));
  card.addEventListener('mouseleave', hideCardPopup);
  if (type.kind === 'potenziamento') {
    card.addEventListener('mouseenter', () => showArea(type, rect));
    card.addEventListener('mouseleave', hideArea);
  }
  return card;
}

function openPopup(content, anchorEl) {
  cardPopup.replaceChildren(...content);
  cardPopup.hidden = false;
  const anchor = anchorEl.getBoundingClientRect();
  const popup = cardPopup.getBoundingClientRect();
  const maxLeft = Math.max(POPUP_MARGIN, window.innerWidth - popup.width - POPUP_MARGIN);
  const left = Math.min(maxLeft, Math.max(POPUP_MARGIN, anchor.left + (anchor.width - popup.width) / 2));
  const above = anchor.top - popup.height - POPUP_GAP;
  const top = above >= POPUP_MARGIN ? above : Math.min(anchor.bottom + POPUP_GAP, window.innerHeight - popup.height - POPUP_MARGIN);
  cardPopup.style.left = `${left}px`;
  cardPopup.style.top = `${Math.max(POPUP_MARGIN, top)}px`;
}

function showCardPopup(inst, card) {
  const type = typeOf(inst.typeId);
  const [name, ...infos] = cardLines(inst);
  const content = [];
  if (hasIcon(type)) content.push(createIconImg(type.icon, 'popup-icon'));
  content.push(el('div', 'popup-name', name), ...infos.map(line => el('div', 'popup-info', line)));
  openPopup(content, card);
}

function hideCardPopup() {
  cardPopup.hidden = true;
}

function typePopupLines(type) {
  const lines = [`${type.kind === 'edificio' ? 'Building' : 'Boost'} · ${type.w}×${type.h}`];
  if (type.kind === 'edificio') {
    if (type.piazzola) lines.push('Plane service');
    if (type.hotel) lines.push(`${type.residenti} pass. / ${formatDuration(type.minuti)}`);
  } else if (type.effetto) {
    lines.push(boostLabel(type), `Radius ${type.raggio}`);
  } else {
    lines.push('No effect');
  }
  lines.push(...priceLines(presetOf(type)));
  const limit = limitOf(type);
  lines.push(limit > 0 ? `Placed: ${placedByIcon(type.icon)}/${limit}` : `Placed: ${copiesOf(type.id).placed}`);
  return lines;
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
  hideCardPopup();
  hideArea();
  hidePreview();
  grid.style.setProperty('--cols', state.grid.cols);
  grid.style.setProperty('--rows', state.grid.rows);
  const cards = state.instances.filter(isPlaced).map(createCard);
  grid.replaceChildren(...cards, area, preview);
  $('gridSize').value = state.grid.cols;
}

function isoRects() {
  return state.instances.filter(isPlaced).map(inst => ({ inst, type: typeOf(inst.typeId), rect: rectOf(inst) }));
}

function isoSpan(r) {
  return [r.x - r.y - r.h, r.x + r.w - r.y];
}

function mustPrecede(b, a) {
  const [b0, b1] = isoSpan(b);
  const [a0, a1] = isoSpan(a);
  return b0 < a1 && a0 < b1 && (a.x >= b.x + b.w || a.y >= b.y + b.h);
}

function isoOrder(items) {
  const rest = [...items].sort((p, q) => (p.rect.x + p.rect.y + p.rect.w + p.rect.h) - (q.rect.x + q.rect.y + q.rect.w + q.rect.h));
  const ordered = [];
  while (rest.length) {
    let index = rest.findIndex(a => !rest.some(b => b !== a && mustPrecede(b.rect, a.rect)));
    if (index < 0) index = 0;
    ordered.push(...rest.splice(index, 1));
  }
  return ordered;
}

function iconArt(type) {
  return PRESET_BY_ICON.get(type.icon)?.art ?? DEFAULT_ART;
}

function isoHeadOf(items) {
  let head = 0;
  for (const { type, rect: r } of items) {
    if (hasIcon(type)) head = Math.max(head, (r.w + r.h) * iconArt(type).rise - (r.x + r.y + r.w + r.h) / 2);
  }
  return head;
}

function isoBox(r) {
  return {
    cx: state.grid.rows + r.x - r.y + (r.w - r.h) / 2,
    cy: isoHead + (r.x + r.y) / 2 + (r.w + r.h) / 4,
    bottom: isoHead + (r.x + r.y + r.w + r.h) / 2,
    span: r.w + r.h
  };
}

function copiesOf(typeId) {
  return { placed: state.instances.filter(i => i.typeId === typeId).length };
}

function placedLabel(count) {
  return count === 1 ? '1 placed' : `${count} placed`;
}

function presetOf(type) {
  return PRESET_BY_ICON.get(type.icon);
}

function limitOf(type) {
  return presetOf(type)?.limite ?? 0;
}

function placedByIcon(icon) {
  if (!icon) return 0;
  return state.instances.filter(i => typeOf(i.typeId).icon === icon).length;
}

function limitReached(type) {
  return limitOf(type) > 0 && placedByIcon(type.icon) >= limitOf(type);
}

function formatPrice(n) {
  return n.toLocaleString('en-US');
}

function priceLines(preset) {
  if (!preset) return [];
  if (preset.premio) return [`Reward: ${preset.premio}`];
  const lines = [];
  if (preset.aircoins) lines.push(`${formatPrice(preset.aircoins)} Aircoins`);
  if (preset.aircash) lines.push(`${formatPrice(preset.aircash)} Aircash`);
  return lines;
}

function priceLine(preset) {
  return priceLines(preset).join(' · ');
}

function overLimitNames() {
  const names = [];
  const seen = new Set();
  for (const inst of state.instances) {
    const type = typeOf(inst.typeId);
    if (!type.icon || seen.has(type.icon)) continue;
    seen.add(type.icon);
    const limit = limitOf(type);
    const placed = placedByIcon(type.icon);
    if (limit > 0 && placed > limit) names.push(`${presetOf(type).name} (${placed}/${limit})`);
  }
  return names;
}

function createInitials(type) {
  const initials = type.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  return el('span', 'inv-initials', initials);
}

function createInventoryCard(type) {
  const { placed } = copiesOf(type.id);
  const limit = limitOf(type);
  const countLabel = limit > 0 ? `${placedByIcon(type.icon)}/${limit} placed` : placedLabel(placed);

  const card = el('div', 'inv-card');
  card.dataset.id = type.id;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.title = type.name;
  card.setAttribute('aria-label', `${type.name}, ${countLabel}`);
  if (limit > 0) {
    card.classList.toggle('is-limit', placedByIcon(type.icon) === limit);
    card.classList.toggle('is-over', placedByIcon(type.icon) > limit);
  }

  const face = el('div', 'inv-face');
  if (hasIcon(type)) {
    const icon = createIconImg(type.icon, 'inv-icon', () => icon.replaceWith(createInitials(type)));
    face.append(icon);
  } else {
    face.append(createInitials(type));
  }
  face.append(el('span', 'inv-name', type.name));
  if (type.kind === 'potenziamento' && type.effetto) face.append(el('span', 'inv-boost', boostLabel(type)));
  face.append(el('span', 'inv-count', countLabel));

  const stats = el('div', 'inv-stats');
  stats.append(...typePopupLines(type).map(line => el('div', 'inv-stat', line)));

  card.append(face, stats);
  return card;
}

function renderInventory() {
  for (const tab of invTabs.children) tab.setAttribute('aria-selected', String(tab.dataset.category === invCategory));
  const types = state.types.filter(t => t.category === invCategory);
  if (types.length === 0) {
    invList.replaceChildren(el('p', 'inv-empty', 'No types in this category: create one with +'));
    return;
  }
  invList.replaceChildren(...types.map(createInventoryCard));
}

function layout() {
  if (isoMode) {
    layoutIso();
    return;
  }
  const { w: availW, h: availH } = boardArea();
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
  const cover = inventory.hidden ? 0 : Math.max(0, board.getBoundingClientRect().bottom - inventory.getBoundingClientRect().top);
  const u = state.grid.cols + state.grid.rows;
  return {
    padX,
    padY,
    w: board.clientWidth - padX - parseFloat(style.paddingRight),
    h: board.clientHeight - padY - parseFloat(style.paddingBottom) - cover,
    gridW: isoMode ? u * isoK : state.grid.cols * cellSize,
    gridH: isoMode ? (u / 2 + isoHead) * isoK : state.grid.rows * cellSize
  };
}

function clampAxis(value, pad, avail, size) {
  const a = pad;
  const b = pad + avail - size;
  return Math.min(Math.max(a, b), Math.max(Math.min(a, b), value));
}

function unitSize() {
  return isoMode ? isoK : cellSize;
}

function zoomRange() {
  if (isoMode) return { min: 1, max: isoFitK > 0 ? Math.max(isoFitK, ISO_MAX_K) / isoFitK : 1 };
  return { min: minCell / baseCell, max: ZOOM_MAX_CELL / baseCell };
}

function swapView() {
  const current = { zoom, x: offset.x, y: offset.y };
  if (otherView) {
    zoom = otherView.zoom;
    offset.x = otherView.x;
    offset.y = otherView.y;
  } else {
    zoom = 1;
  }
  otherView = current;
}

function setOffset(x, y) {
  const a = boardArea();
  offset.x = a.gridW <= a.w ? a.padX + (a.w - a.gridW) / 2 : clampAxis(x, a.padX, a.w, a.gridW);
  offset.y = a.gridH <= a.h ? a.padY + (a.h - a.gridH) / 2 : clampAxis(y, a.padY, a.h, a.gridH);
  (isoMode ? iso : grid).style.transform = `translate(${offset.x}px, ${offset.y}px)`;
}

function applyZoom(next, clientX, clientY) {
  const rect = board.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  const unit = unitSize();
  const ux = unit > 0 ? (px - offset.x) / unit : 0;
  const uy = unit > 0 ? (py - offset.y) / unit : 0;
  const { min, max } = zoomRange();
  zoom = Math.min(max, Math.max(min, next));
  layout();
  setOffset(px - ux * unitSize(), py - uy * unitSize());
}

function wheelUnit(e) {
  return e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
}

function flushWheel() {
  wheel.frame = 0;
  hideCardPopup();
  const factor = Math.exp(-wheel.delta * ZOOM_SPEED);
  wheel.delta = 0;
  applyZoom(zoom * factor, wheel.x, wheel.y);
  if (drag?.active) updateDrag();
}

function setIsoVars(node, l, t, w) {
  node.style.setProperty('--l', l);
  node.style.setProperty('--t', t);
  node.style.setProperty('--w', w);
}

function createIsoFallback({ type, rect }) {
  const box = isoBox(rect);
  const tile = el('div', 'iso-tile');
  tile.style.gridColumn = `${rect.x + 1} / span ${rect.w}`;
  tile.style.gridRow = `${rect.y + 1} / span ${rect.h}`;
  tile.classList.toggle('is-boost', type.kind === 'potenziamento');
  const label = el('div', 'iso-label', type.name);
  setIsoVars(label, box.cx, box.cy, box.span);
  return [tile, label];
}

function createIsoSprite(item) {
  const { inst, type, rect } = item;
  const img = createIconImg(type.icon, 'iso-sprite', () => {
    const [tile, label] = createIsoFallback(item);
    isoGround.append(tile);
    img.replaceWith(label);
  });
  const art = iconArt(type);
  img.classList.toggle('is-mirrored', inst.rot !== Boolean(art.flip));
  const box = isoBox(rect);
  setIsoVars(img, box.cx, box.bottom, box.span);
  img.style.setProperty('--fit', art.fit);
  img.style.setProperty('--ax', art.ax);
  img.style.setProperty('--ay', art.ay);
  return img;
}

function layoutIso() {
  const a = boardArea();
  const u = state.grid.cols + state.grid.rows;
  const height = u / 2 + isoHead;
  isoFitK = Math.max(0, Math.min(a.w / u, a.h / height));
  isoK = Math.min(Math.max(isoFitK, ISO_MAX_K), isoFitK * Math.max(1, zoom));
  iso.style.setProperty('--k', `${isoK}px`);
}

function renderIso() {
  const items = isoRects();
  isoHead = isoHeadOf(items);
  for (const node of [iso, isoGround]) {
    node.style.setProperty('--cols', state.grid.cols);
    node.style.setProperty('--rows', state.grid.rows);
  }
  iso.style.setProperty('--head', isoHead);
  const tiles = [];
  const sprites = [];
  for (const item of isoOrder(items)) {
    if (hasIcon(item.type)) {
      sprites.push(createIsoSprite(item));
    } else {
      const [tile, label] = createIsoFallback(item);
      tiles.push(tile);
      sprites.push(label);
    }
  }
  isoGround.replaceChildren(...tiles);
  iso.replaceChildren(isoGround, ...sprites);
  refreshLayout();
}

function render() {
  renderGrid();
  renderInventory();
  layout();
  if (isoMode) renderIso();
}

function setRemoveMode(active) {
  removeMode = active;
  document.body.classList.toggle('remove-mode', active);
  const toggle = $('toggleRemove');
  toggle.classList.toggle('active', active);
  toggle.setAttribute('aria-pressed', String(active));
  toggle.textContent = active ? 'Remove mode: on' : 'Remove mode';
}

function setIsoMode(active) {
  swapView();
  isoMode = active;
  if (active) {
    setMenuOpen(false);
    setRemoveMenuOpen(false);
  }
  grid.hidden = active;
  iso.hidden = !active;
  inventory.hidden = active;
  menuToggle.hidden = active;
  $('toggleIso').setAttribute('aria-checked', String(active));
  hideCardPopup();
  if (active) renderIso();
  else refreshLayout();
}

function setRemoveMenuOpen(open) {
  removeMenu.hidden = !open;
  removeMenuToggle.setAttribute('aria-expanded', String(open));
}

function setInventoryCollapsed(collapsed) {
  inventory.classList.toggle('collapsed', collapsed);
  invBody.hidden = collapsed;
  invToggle.setAttribute('aria-expanded', String(!collapsed));
  invToggle.setAttribute('aria-label', collapsed ? 'Expand inventory' : 'Collapse inventory');
  if (collapsed) setRemoveMenuOpen(false);
}

function loadInvCollapsed() {
  try {
    return localStorage.getItem(INV_KEY) === '1';
  } catch {
    return false;
  }
}

function saveInvCollapsed(collapsed) {
  try {
    localStorage.setItem(INV_KEY, collapsed ? '1' : '0');
  } catch {}
}

function setMenuOpen(open) {
  if (!open && menuPanel.contains(document.activeElement)) menuToggle.focus();
  menuOpen = open;
  menuPanel.classList.toggle('open', open);
  menuPanel.inert = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) $('gridSize').focus();
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

function startDrag(e, data, source) {
  drag = {
    ...data,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    x: e.clientX,
    y: e.clientY,
    active: false,
    scrollArmed: false,
    source
  };
}

function activateDrag() {
  const dragType = typeOf(drag.typeId);
  if (!drag.instId && limitReached(dragType)) {
    endDrag();
    showMsg(`Limit reached: max ${limitOf(dragType)} "${presetOf(dragType).name}"`);
    return;
  }
  drag.active = true;
  hideCardPopup();
  hideArea();
  grid.classList.add('is-drag-active');
  drag.source?.classList.add('is-dragging');
  document.body.classList.add('is-card-dragging');
  try {
    document.body.setPointerCapture(drag.pointerId);
  } catch {
    endDrag();
    return;
  }
  const type = typeOf(drag.typeId);
  dragGhost.replaceChildren(hasIcon(type) ? createIconImg(type.icon, 'ghost-icon') : type.name);
  dragGhost.hidden = false;
}

function isInside(rect, x, y) {
  return x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}

function isOverGrid(x, y) {
  return isInside(grid.getBoundingClientRect(), x, y)
    && isInside(board.getBoundingClientRect(), x, y)
    && (inventory.hidden || !isInside(inventory.getBoundingClientRect(), x, y));
}

function dragRect() {
  const cell = cellFromEvent({ clientX: drag.x, clientY: drag.y });
  return { x: cell.x - drag.offX, y: cell.y - drag.offY, ...sizeOf(typeOf(drag.typeId), drag.rot) };
}

function updateDrag() {
  dragGhost.style.transform = `translate(${drag.x + 12}px, ${drag.y + 12}px)`;
  const over = isOverGrid(drag.x, drag.y);
  dragGhost.hidden = over;
  hideArea();
  if (!over) {
    hidePreview();
    return;
  }
  const type = typeOf(drag.typeId);
  const rect = dragRect();
  showPreview(rect, canPlace(rect, rect.x, rect.y, drag.instId));
  if (type.kind === 'potenziamento') showArea(type, rect);
}

function rotateDrag() {
  suppressMenu = true;
  const type = typeOf(drag.typeId);
  if (type.w === type.h) return;
  drag.rot = !drag.rot;
  [drag.offX, drag.offY] = [drag.offY, drag.offX];
  updateDrag();
}

function dropDrag() {
  if (!drag.active) {
    drag = null;
    return;
  }
  if (!isOverGrid(drag.x, drag.y)) {
    endDrag();
    return;
  }
  const { instId, typeId, rot } = drag;
  const rect = dragRect();
  endDrag();
  if (!canPlace(rect, rect.x, rect.y, instId)) return;
  if (instId) placeInstance(instId, rect.x, rect.y, rot);
  else createInstance(typeId, rect.x, rect.y, rot);
}

function endDrag() {
  stopAutoScroll();
  if (drag?.active && document.body.hasPointerCapture(drag.pointerId)) document.body.releasePointerCapture(drag.pointerId);
  drag = null;
  hideCardPopup();
  grid.classList.remove('is-drag-active');
  grid.querySelector('.card.is-dragging')?.classList.remove('is-dragging');
  document.body.classList.remove('is-card-dragging');
  dragGhost.hidden = true;
  dragGhost.replaceChildren();
  hidePreview();
  hideArea();
}

function autoScrollVelocity() {
  if (!drag?.active || isoMode) return { vx: 0, vy: 0 };
  const r = board.getBoundingClientRect();
  let bottom = r.bottom;
  if (!inventory.hidden) {
    const inv = inventory.getBoundingClientRect();
    if (isInside(inv, drag.x, drag.y)) {
      drag.scrollArmed = false;
      return { vx: 0, vy: 0 };
    }
    bottom = Math.min(bottom, inv.top);
  }
  const ratio = d => Math.min(1, Math.max(0, (AUTOSCROLL_EDGE - d) / AUTOSCROLL_EDGE));
  const vx = ratio(drag.x - r.left) - ratio(r.right - drag.x);
  const vy = ratio(drag.y - r.top) - ratio(bottom - drag.y);
  if (!drag.scrollArmed) {
    if (vx === 0 && vy === 0) drag.scrollArmed = true;
    return { vx: 0, vy: 0 };
  }
  return { vx, vy };
}

function autoScrollTick(now) {
  autoScroll.frame = 0;
  const { vx, vy } = autoScrollVelocity();
  if (vx === 0 && vy === 0) {
    autoScroll.last = 0;
    return;
  }
  const dt = autoScroll.last ? Math.min(AUTOSCROLL_MAX_DT, now - autoScroll.last) : 16;
  autoScroll.last = now;
  const { x, y } = offset;
  setOffset(x + vx * AUTOSCROLL_SPEED * dt / 1000, y + vy * AUTOSCROLL_SPEED * dt / 1000);
  if (offset.x === x && offset.y === y) {
    autoScroll.last = 0;
    return;
  }
  updateDrag();
  startAutoScroll();
}

function startAutoScroll() {
  if (!autoScroll.frame) autoScroll.frame = requestAnimationFrame(autoScrollTick);
}

function stopAutoScroll() {
  cancelAnimationFrame(autoScroll.frame);
  autoScroll.frame = 0;
  autoScroll.last = 0;
}

grid.addEventListener('pointerdown', e => {
  const card = e.target.closest('.card');
  if (e.button !== 0 || e.pointerType === 'touch' || removeMode || drag || !card) return;
  const inst = instanceOf(card.dataset.id);
  const rect = rectOf(inst);
  const cell = cellFromEvent(e);
  startDrag(e, {
    instId: inst.id,
    typeId: inst.typeId,
    rot: inst.rot,
    offX: Math.min(rect.w - 1, Math.max(0, cell.x - rect.x)),
    offY: Math.min(rect.h - 1, Math.max(0, cell.y - rect.y))
  }, card);
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

invList.addEventListener('pointerdown', e => {
  const card = e.target.closest('.inv-card');
  if (e.button !== 0 || e.pointerType === 'touch' || drag || !card) return;
  startDrag(e, { instId: null, typeId: card.dataset.id, rot: false, offX: 0, offY: 0 }, null);
});

invList.addEventListener('click', e => {
  const card = e.target.closest('.inv-card');
  if (card) openTypeDialog(card.dataset.id);
});

invList.addEventListener('keydown', e => {
  const card = e.target.closest('.inv-card');
  if (!card || (e.key !== 'Enter' && e.key !== ' ')) return;
  e.preventDefault();
  openTypeDialog(card.dataset.id);
});

invList.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  invList.scrollLeft += e.deltaY * wheelUnit(e);
}, { passive: false });

invTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-category]');
  if (!tab) return;
  if (inventory.classList.contains('collapsed')) {
    setInventoryCollapsed(false);
    saveInvCollapsed(false);
    refreshLayout();
  }
  invCategory = tab.dataset.category;
  renderInventory();
  invList.scrollLeft = 0;
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
  $('lblQuantita').textContent = effect ? EFFECT_LABELS[effect] + (effect === 'piazzole' ? ' (%)' : '') : 'Quantity';
  $('fQuantita').disabled = !effect || isBuilding;
  $('fQuantita').step = effect === 'hotel' ? '1' : 'any';
  $('fQuantita').max = effect === 'piazzole' ? String(MAX_REDUCTION) : '1000000';
}

function setFormIcon(icon) {
  formIcon = icon;
  const preview = $('fIconPreview');
  preview.replaceChildren();
  if (icon) preview.append(createIconImg(icon, 'icon-preview-img', () => preview.replaceChildren()));
  preview.hidden = !icon;
  $('clearIcon').hidden = !icon;
}

function fillTypeForm(type) {
  $('fName').value = type.name;
  setFormIcon(type.icon);
  $('fW').value = type.w;
  $('fH').value = type.h;
  $('fKind').value = type.kind;
  $('fCategory').value = type.category;
  $('fPiazzola').checked = type.piazzola;
  $('fHotel').checked = type.hotel;
  $('fResidenti').value = type.residenti;
  $('fMinuti').value = type.minuti || 1;
  $('fEffPiazzole').checked = type.effetto === 'piazzole';
  $('fEffHotel').checked = type.effetto === 'hotel';
  $('fQuantita').value = type.quantita;
  $('fRaggio').value = type.raggio;
  syncDialog();
}

function openTypeDialog(id) {
  editingId = id ?? null;
  $('dialogTitle').textContent = id ? 'Edit type' : 'New type';
  fillTypeForm(id ? typeOf(id) : sanitizeType({ name: '' }));
  if (!id) {
    $('fName').value = '';
    $('fCategory').value = invCategory;
  }
  $('deleteType').hidden = !id;
  dialog.showModal();
}

function presetInfo(preset) {
  if (preset.effetto) return EFFECT_LABELS[preset.effetto];
  if (preset.hotel) return `Passengers: ${preset.residenti} every ${formatDuration(preset.minuti)}`;
  return '';
}

function createPresetCard(preset) {
  const card = el('button', 'preset-card');
  card.type = 'button';
  card.dataset.icon = preset.icon;
  card.title = preset.name;
  const icon = createIconImg(preset.icon, 'preset-icon', () => icon.remove());
  card.append(icon, el('span', 'preset-name', preset.name), el('span', 'inv-dim', `${preset.w}×${preset.h}`));
  const info = presetInfo(preset);
  if (info) card.append(el('span', 'inv-dim preset-info', info));
  const price = priceLine(preset);
  if (price) card.append(el('span', 'inv-dim preset-info', price));
  if (preset.limite) card.append(el('span', 'inv-dim preset-info', `Max ${preset.limite}`));
  return card;
}

function renderPresets() {
  for (const tab of presetTabs.children) tab.setAttribute('aria-selected', String(tab.dataset.category === presetCategory));
  presetGrid.replaceChildren(...PRESETS.filter(p => p.category === presetCategory).map(createPresetCard));
  presetGrid.scrollTop = 0;
}

function vehicleGroup(v) {
  return v.type === 'cargo' ? 'cargo' : v.category;
}

function vehicleStats(v) {
  const aircoins = v.reward.aircoins ?? 0;
  if (v.type === 'cargo') return [{ label: 'XP', value: v.reward.xp }, { label: 'Goods', value: v.reward.goods ?? 0 }];
  return [
    { label: 'XP', value: v.reward.xp },
    { label: 'Aircoins', value: aircoins },
    { label: 'Aircoins/pax', value: aircoins / v.cost.amount }
  ];
}

function computeVehicleBadges() {
  const bands = new Map();
  for (const v of VEHICLES) {
    const key = vehicleGroup(v) + '|' + v.flightTimeMinutes;
    if (!bands.has(key)) bands.set(key, []);
    bands.get(key).push(v);
  }
  const badges = new Map(VEHICLES.map(v => [v, []]));
  for (const band of bands.values()) {
    const stats = new Map(band.map(v => [v, vehicleStats(v)]));
    stats.get(band[0]).forEach((stat, i) => {
      const max = Math.max(...band.map(v => stats.get(v)[i].value));
      if (max <= 0) return;
      for (const v of band) if (stats.get(v)[i].value === max) badges.get(v).push('Top ' + stat.label);
    });
  }
  return badges;
}

const VEHICLE_BADGES = computeVehicleBadges();

function formatSeconds(s) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m}min` : `${m}min${r}s`;
}

function vehiclePriceLine(v) {
  if (v.price) return `${formatPrice(v.price.amount)} ${v.price.currency === 'aircash' ? 'Aircash' : 'Aircoins'}`;
  return v.constructionHallLevel != null ? `Construction Hall lvl ${v.constructionHallLevel}` : 'Not for sale';
}

function createVehicleCard(v) {
  const card = el('div', 'vehicle-card');
  card.title = v.notes ? `${v.name} · ${v.notes}` : v.name;
  const icon = createIconImg(v.icon, 'vehicle-icon', () => icon.replaceWith(createInitials(v)));
  const group = vehicleGroup(v);
  const kind = v.type === 'cargo' ? VEHICLE_CATEGORY_SHORT[v.category] ?? VEHICLE_GROUP_LABELS[v.category] : 'Passenger';
  const time = formatDuration(v.flightTimeMinutes);
  card.append(icon, el('span', 'preset-name', v.name), el('span', 'inv-dim', `${VEHICLE_GROUP_LABELS[group]} · ${kind}`));
  card.append(el('span', 'inv-dim', v.serviceTimeSeconds != null ? `${time} · service ${formatSeconds(v.serviceTimeSeconds)}` : time));
  card.append(el('span', 'inv-dim', v.cost.resource === 'passengers' ? `${v.cost.amount} passengers` : `${formatPrice(v.cost.amount)} Aircoins`));
  const reward = [];
  if (v.reward.aircoins != null) reward.push(`${formatPrice(v.reward.aircoins)} Aircoins`);
  if (v.reward.goods != null) reward.push(`${formatPrice(v.reward.goods)} Goods`);
  reward.push(`${v.reward.xp} XP`);
  card.append(el('span', 'inv-dim', reward.join(' · ')), el('span', 'inv-dim', vehiclePriceLine(v)));
  if (v.unlockLevel != null) card.append(el('span', 'inv-dim', `Lvl ${v.unlockLevel}`));
  if (v.notes) card.append(el('span', 'inv-dim', v.notes));
  const badges = VEHICLE_BADGES.get(v);
  if (badges.length) {
    const row = el('div', 'vehicle-badges');
    for (const label of badges) {
      const chip = el('span', 'vehicle-badge', label);
      chip.title = `Best ${label.slice(4)} among ${VEHICLE_GROUP_PLURALS[group]} with ${time} flights`;
      row.append(chip);
    }
    card.append(row);
  }
  return card;
}

function inVehicleGroup(v) {
  return vehicleGroupFilter === 'all' || vehicleGroup(v) === vehicleGroupFilter;
}

function renderVehicleDurations() {
  const durations = [...new Set(VEHICLES.filter(inVehicleGroup).map(v => v.flightTimeMinutes))].sort((a, b) => a - b);
  if (!durations.includes(Number(vehicleDuration))) vehicleDuration = '';
  vehicleDurationSelect.replaceChildren(new Option('All durations', ''), ...durations.map(d => new Option(formatDuration(d), String(d))));
  vehicleDurationSelect.value = vehicleDuration;
}

function vehicleLevelKey(v) {
  return [v.unlockLevel == null ? 1 : 0, v.unlockLevel ?? v.constructionHallLevel ?? Infinity];
}

function compareVehicles(a, b) {
  if (vehicleSort === 'level') {
    const [ga, la] = vehicleLevelKey(a);
    const [gb, lb] = vehicleLevelKey(b);
    return ga - gb || (la === lb ? 0 : la < lb ? -1 : 1) || a.name.localeCompare(b.name, 'en');
  }
  return (b.reward[vehicleSort] ?? 0) - (a.reward[vehicleSort] ?? 0) || a.name.localeCompare(b.name, 'en');
}

function renderVehicles() {
  for (const tab of vehicleTabs.children) tab.setAttribute('aria-selected', String(tab.dataset.group === vehicleGroupFilter));
  const list = VEHICLES
    .filter(v => inVehicleGroup(v) && (vehicleDuration === '' || v.flightTimeMinutes === Number(vehicleDuration)))
    .sort(compareVehicles);
  if (list.length) vehicleGrid.replaceChildren(...list.map(createVehicleCard));
  else vehicleGrid.replaceChildren(el('p', 'hint', 'No planes match the selected filters'));
  vehicleGrid.scrollTop = 0;
}

function readTypeForm() {
  return {
    name: $('fName').value,
    icon: formIcon,
    w: $('fW').value,
    h: $('fH').value,
    kind: $('fKind').value,
    category: $('fCategory').value,
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
$('deleteType').addEventListener('click', () => {
  deleteType(editingId);
  if (!typeOf(editingId)) dialog.close();
});
$('choosePreset').addEventListener('click', () => {
  presetCategory = $('fCategory').value;
  renderPresets();
  presetDialog.showModal();
});
$('openVehicles').addEventListener('click', () => {
  renderVehicleDurations();
  renderVehicles();
  vehicleDialog.showModal();
});
$('closeVehicles').addEventListener('click', () => vehicleDialog.close());
vehicleTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-group]');
  if (!tab) return;
  vehicleGroupFilter = tab.dataset.group;
  renderVehicleDurations();
  renderVehicles();
});
vehicleDurationSelect.addEventListener('change', () => {
  vehicleDuration = vehicleDurationSelect.value;
  renderVehicles();
});
vehicleSortSelect.addEventListener('change', () => {
  vehicleSort = vehicleSortSelect.value;
  renderVehicles();
});
$('clearIcon').addEventListener('click', () => setFormIcon(''));
$('closePreset').addEventListener('click', () => presetDialog.close());
presetTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-category]');
  if (!tab) return;
  presetCategory = tab.dataset.category;
  renderPresets();
});
presetGrid.addEventListener('click', e => {
  const card = e.target.closest('.preset-card');
  if (!card) return;
  fillTypeForm(sanitizeType(PRESET_BY_ICON.get(card.dataset.icon)));
  $('fQuantita').value = '';
  presetDialog.close();
});
typeForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = saveType(readTypeForm(), editingId);
  dialog.close();
  invList.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
});

$('newType').addEventListener('click', () => openTypeDialog());
$('applyGrid').addEventListener('click', () => resizeGrid($('gridSize').value));
invToggle.addEventListener('click', () => {
  const next = !inventory.classList.contains('collapsed');
  setInventoryCollapsed(next);
  saveInvCollapsed(next);
  refreshLayout();
});

$('toggleRemove').addEventListener('click', () => setRemoveMode(!removeMode));
$('toggleIso').addEventListener('click', () => setIsoMode(!isoMode));
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
      showMsg('Invalid file');
      return;
    }
    state = imported;
    const synced = syncPresetTypes();
    const moved = normalizePlacements();
    zoom = 1;
    otherView = null;
    commit(joinMessages(syncedMessage(synced), movedMessage(moved), limitMessage()) ?? 'Import completed');
    centerBoard();
  };
  reader.onerror = () => showMsg('Unable to read the file');
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
  if (e.key === 'Escape' && drag) {
    endDrag();
    return;
  }
  if (e.key !== 'Escape' || dialog.open || presetDialog.open || vehicleDialog.open) return;
  if (menuOpen) setMenuOpen(false);
  if (!removeMenu.hidden) {
    setRemoveMenuOpen(false);
    removeMenuToggle.focus();
  }
});

board.addEventListener('wheel', e => {
  e.preventDefault();
  wheel.delta += e.deltaY * wheelUnit(e);
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
    hideCardPopup();
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

window.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.pointerId) return;
  drag.x = e.clientX;
  drag.y = e.clientY;
  if (!(e.buttons & 1)) {
    dropDrag();
    return;
  }
  if (!drag.active) {
    if (Math.hypot(drag.x - drag.startX, drag.y - drag.startY) < PAN_THRESHOLD) return;
    activateDrag();
    if (!drag) return;
  }
  if (e.button === 2 && (e.buttons & 2)) rotateDrag();
  else updateDrag();
  startAutoScroll();
});

window.addEventListener('pointerup', e => {
  if (!drag || e.pointerId !== drag.pointerId || e.button !== 0) return;
  drag.x = e.clientX;
  drag.y = e.clientY;
  dropDrag();
});

window.addEventListener('pointercancel', () => {
  if (drag) endDrag();
});

document.body.addEventListener('lostpointercapture', () => {
  if (drag?.active) endDrag();
});

window.addEventListener('blur', () => {
  if (drag) endDrag();
});

document.addEventListener('contextmenu', e => {
  if (!drag?.active && !suppressMenu) return;
  e.preventDefault();
  e.stopPropagation();
  suppressMenu = false;
}, true);

window.addEventListener('resize', refreshLayout);

loadState();
setInventoryCollapsed(loadInvCollapsed());
render();
scrollBoardTopRight();
document.fonts?.ready.then(() => {
  layout();
  scrollBoardTopRight();
});
