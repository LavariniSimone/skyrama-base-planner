const STORAGE_KEY = 'griglia-card:v1';
const INV_KEY = 'griglia-card:inv-collapsed';
const VEHICLE_LEVEL_KEY = 'griglia-card:vehicle-level';
const VEHICLE_AIRCOINS_KEY = 'griglia-card:vehicle-aircoins-only';
const VEHICLE_FAVORITES_KEY = 'griglia-card:vehicle-favorites';
const VEHICLE_FAVORITES_ONLY_KEY = 'griglia-card:vehicle-favorites-only';
const VEHICLE_MAX_LEVEL = 999;
const GOALS_KEY = 'griglia-card:goals-done';
const STORY_GOALS_KEY = 'griglia-card:story-goals-done';
const HANGAR_PLAN_KEY = 'griglia-card:hangar-plan';
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
const EVENTS = globalThis.SKYRAMA_EVENTS ?? [];
const EVENT_PRESETS = EVENTS.flatMap(e => e.items);
const PRESET_BY_ICON = new Map([...PRESETS, ...EVENT_PRESETS].map(p => [p.icon, p]));
const CATEGORIES = ['airside', 'landside', 'decorazione'];
const VEHICLES = globalThis.SKYRAMA_VEHICLES ?? [];
const VEHICLE_BY_NAME = new Map(VEHICLES.map(v => [v.name, v]));
const GOALS = globalThis.SKYRAMA_GOALS ?? [];
const STORY_GOALS = globalThis.SKYRAMA_STORY_GOALS ?? [];
const GOAL_ANY_CATEGORIES = ['small', 'medium', 'large'];

function normalizeSearch(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
}

function goalSearchText(goals) {
  return goals.map(g => normalizeSearch([g.name, ...g.tasks.map(t => t.text), ...g.rewards.map(r => r.text)].join(' ')));
}

const GOAL_SEARCH_TEXT = goalSearchText(GOALS);
const STORY_GOAL_SEARCH_TEXT = goalSearchText(STORY_GOALS);
const GOAL_LISTS = {
  main: { goals: GOALS, key: GOALS_KEY, search: GOAL_SEARCH_TEXT, label: 'Main goals', short: 'Main', noun: 'main' },
  story: { goals: STORY_GOALS, key: STORY_GOALS_KEY, search: STORY_GOAL_SEARCH_TEXT, label: 'Story goals', short: 'Story', noun: 'story' }
};
const VEHICLE_GROUP_LABELS = { small: 'Small', medium: 'Medium', large: 'Large', cargo: 'Cargo', searama: 'Searama', ramacopter: 'Helirama' };
const VEHICLE_GROUP_LIST = new Intl.ListFormat('en', { type: 'conjunction' });
const VEHICLE_GROUP_PLURALS = { small: 'small planes', medium: 'medium planes', large: 'large planes', cargo: 'cargo planes', searama: 'Searamas', ramacopter: 'Heliramas' };
const VEHICLE_CATEGORY_SHORT = { small: 'S', medium: 'M', large: 'L' };
const VEHICLE_COST_UNITS = { passengers: 'Passengers', aircoins: 'Aircoins' };
const HANGARS = [
  { id: 'small', label: 'Small Hangar' },
  { id: 'medium', label: 'Medium Hangar' },
  { id: 'large', label: 'Large Hangar' },
  { id: 'searama', label: 'Seaplane Hangar' },
  { id: 'ramacopter', label: 'Ramacopter Hangar' }
];
const HANGAR_MAX_QTY = 99;

const $ = id => document.getElementById(id);
const board = $('board');
const grid = $('grid');
const iso = $('iso');
const isoGround = $('isoGround');
const preview = $('preview');
const marqueeBox = $('marquee');
const removeSelectedBtn = $('removeSelected');
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
const centerViewBtn = $('centerView');
const menuPanel = $('menuPanel');
const removeMenuToggle = $('removeMenuToggle');
const removeMenu = $('removeMenu');
const presetDialog = $('presetDialog');
const presetGrid = $('presetGrid');
const presetTabs = $('presetTabs');
const vehicleDialog = $('vehicleDialog');
const vehicleGrid = $('vehicleGrid');
const vehicleTip = $('vehicleTip');
const vehicleTabs = $('vehicleTabs');
const vehicleDurationSelect = $('vehicleDuration');
const vehicleSortSelect = $('vehicleSort');
const vehicleLevelInput = $('vehicleLevel');
const vehicleAircoinsInput = $('vehicleAircoinsOnly');
const vehicleFavoritesInput = $('vehicleFavoritesOnly');
const goalsDialog = $('goalsDialog');
const goalRow = $('goalRow');
const goalTabs = $('goalTabs');
const goalsProgress = $('goalsProgress');
const goalsProgressText = $('goalsProgressText');
const goalSearchInput = $('goalSearch');
const goalSearchCount = $('goalSearchCount');
const requiredPlanesDialog = $('requiredPlanesDialog');
const requiredPlanesScope = $('requiredPlanesScope');
const requiredPlanesList = $('requiredPlanesList');
const hangarDialog = $('hangarDialog');
const hangarTabs = $('hangarTabs');
const hangarPanel = $('hangarPanel');
const hangarPlannedTitle = $('hangarPlannedTitle');
const hangarPlannedList = $('hangarPlanned');
const hangarAvailableTitle = $('hangarAvailableTitle');
const hangarAvailableList = $('hangarAvailable');
const cardPopup = $('cardPopup');
const dragGhost = $('dragGhost');
const cardMenu = $('cardMenu');

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
let cardMenuTarget = null;
let invReorder = null;
let invReorderClickGuard = false;
const invReorderScroll = { frame: 0, last: 0 };
let selection = new Set();
let marquee = null;
let suppressMenu = false;
let fill = null;
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
let vehicleGroupFilter = new Set();
let vehicleDuration = '';
let vehicleSort = 'level';
let vehicleMaxLevel = loadVehicleLevel();
let vehicleAircoinsOnly = loadVehicleAircoinsOnly();
let vehicleFavorites = loadVehicleFavorites();
let vehicleFavoritesOnly = loadVehicleFavoritesOnly();
let goalsDone = loadGoalsDone();
let storyGoalsDone = loadGoalsDone(STORY_GOALS_KEY, STORY_GOALS.length);
let goalsTab = 'main';
let goalQuery = '';
let hangarPlan = loadHangarPlan();
let hangarTab = 'small';
const hangarExpanded = new Set();
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
  clearSelection();
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
  pruneSelection();
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

function canPlace(size, x, y, ignore) {
  const rect = { x, y, w: size.w, h: size.h };
  if (!inBounds(rect)) return false;
  const ignored = ignore instanceof Set ? ignore : new Set([ignore]);
  return !state.instances.some(i => isPlaced(i) && !ignored.has(i.id) && overlaps(rectOf(i), rect));
}

function canPlaceGroup(rects, ignoreIds) {
  if (!rects.every(inBounds)) return false;
  return !state.instances.some(i => isPlaced(i) && !ignoreIds.has(i.id) && rects.some(rect => overlaps(rectOf(i), rect)));
}

function syncSelectionClasses() {
  for (const card of grid.querySelectorAll('.card')) card.classList.toggle('is-selected', selection.has(card.dataset.id));
  syncSelectionUI();
}

function syncSelectionUI() {
  removeSelectedBtn.hidden = isoMode || removeMode || selection.size < 2;
  removeSelectedBtn.textContent = `Remove ${selection.size} selected`;
}

function clearSelection() {
  if (selection.size === 0) return;
  selection.clear();
  syncSelectionClasses();
}

function setSelection(ids) {
  selection = new Set(ids);
  syncSelectionClasses();
}

function toggleSelected(id) {
  if (!selection.delete(id)) selection.add(id);
  syncSelectionClasses();
}

function pruneSelection() {
  selection = new Set([...selection].filter(id => {
    const inst = instanceOf(id);
    return inst && isPlaced(inst);
  }));
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

function reorderTypes(category, orderedIds) {
  const slots = [];
  state.types.forEach((t, i) => {
    if (t.category === category) slots.push(i);
  });
  const byId = new Map(slots.map(i => [state.types[i].id, state.types[i]]));
  if (orderedIds.length !== slots.length || new Set(orderedIds).size !== slots.length || !orderedIds.every(id => byId.has(id))) return false;
  orderedIds.forEach((id, k) => {
    state.types[slots[k]] = byId.get(id);
  });
  commit();
  return true;
}

function moveType(id, delta) {
  const type = typeOf(id);
  if (!type) return;
  const ids = state.types.filter(t => t.category === type.category).map(t => t.id);
  const from = ids.indexOf(id);
  const to = from + delta;
  if (to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];
  reorderTypes(type.category, ids);
}

function deleteType(id) {
  const type = typeOf(id);
  const placed = state.instances.filter(i => i.typeId === id).length;
  const suffix = placed === 0 ? '' : placed === 1 ? ' and its card on the grid' : ` and its ${placed} cards on the grid`;
  state.types = state.types.filter(t => t.id !== id);
  state.instances = state.instances.filter(i => i.typeId !== id);
  commit(`Deleted "${type.name}"${suffix}`);
}

function createInstance(typeId, x, y, rot) {
  state.instances.push({ id: uid(), typeId, x, y, rot });
  commit();
}

function createInstances(typeId, cells, rot, msg) {
  for (const { x, y } of cells) state.instances.push({ id: uid(), typeId, x, y, rot });
  commit(msg);
}

function placeInstance(instId, x, y, rot) {
  const inst = instanceOf(instId);
  inst.x = x;
  inst.y = y;
  inst.rot = rot;
  commit();
}

function placeInstances(moves) {
  for (const { instId, x, y, rot } of moves) {
    const inst = instanceOf(instId);
    inst.x = x;
    inst.y = y;
    inst.rot = rot;
  }
  commit();
}

function groupMembers(ids, pivotX, pivotY) {
  return [...ids].map(id => {
    const member = instanceOf(id);
    return { instId: id, typeId: member.typeId, rot: member.rot, rx: member.x - pivotX, ry: member.y - pivotY };
  });
}

function rotateMembers(members) {
  for (const m of members) {
    const memberType = typeOf(m.typeId);
    const { h } = sizeOf(memberType, m.rot);
    [m.rx, m.ry] = [1 - m.ry - h, m.rx];
    if (memberType.w !== memberType.h) m.rot = !m.rot;
  }
}

function rotateSelection(ids, cell) {
  const members = groupMembers(ids, cell.x, cell.y);
  rotateMembers(members);
  const rects = members.map(m => ({ x: cell.x + m.rx, y: cell.y + m.ry, ...sizeOf(typeOf(m.typeId), m.rot) }));
  if (!canPlaceGroup(rects, new Set(ids))) {
    showMsg('Not enough space to rotate the selection');
    return;
  }
  placeInstances(members.map((m, i) => ({ instId: m.instId, x: rects[i].x, y: rects[i].y, rot: m.rot })));
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

function removeInstances(ids) {
  const removed = new Set(ids);
  const before = state.instances.length;
  state.instances = state.instances.filter(i => !removed.has(i.id));
  commit(movedMessage(before - state.instances.length));
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
  if (selection.has(inst.id)) card.classList.add('is-selected');
  if (hasIcon(type)) {
    card.classList.add('has-icon');
    card.append(createIconImg(type.icon, 'card-icon', () => {
      hideCardPopup();
      card.replaceWith(createCard(inst));
    }));
    if (Math.min(rect.w, rect.h) >= COMPACT_CARD) {
      card.append(el('div', 'card-name', type.name));
      if (type.piazzola) card.append(el('div', 'card-info card-bonus', `-${formatNumber(piazzolaBonus(inst))}%`));
    }
  } else {
    const lines = cardLines(inst);
    card.append(el('div', 'card-name', lines[0]));
    for (const line of lines.slice(1)) card.append(el('div', 'card-info', line));
  }
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

function showTypePopup(type, card) {
  openPopup([el('div', 'popup-name', type.name), ...typePopupLines(type).map(line => el('div', 'popup-info', line))], card);
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

function showPreview(rect, valid, node = preview) {
  node.style.left = `${rect.x * cellSize}px`;
  node.style.top = `${rect.y * cellSize}px`;
  node.style.width = `${rect.w * cellSize}px`;
  node.style.height = `${rect.h * cellSize}px`;
  node.className = valid ? 'preview valid' : 'preview invalid';
  node.hidden = false;
}

function hidePreview() {
  preview.hidden = true;
  drag?.previews?.forEach(node => node.hidden = true);
}

function renderGrid() {
  hideCardPopup();
  hideArea();
  hidePreview();
  grid.style.setProperty('--cols', state.grid.cols);
  grid.style.setProperty('--rows', state.grid.rows);
  const cards = state.instances.filter(isPlaced).map(createCard);
  grid.replaceChildren(...cards, area, preview, marqueeBox);
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
  card.setAttribute('aria-label', `${type.name}, ${countLabel}`);
  card.setAttribute('aria-keyshortcuts', 'Alt+ArrowLeft Alt+ArrowRight');
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

  const info = el('span', 'inv-info');
  info.setAttribute('aria-hidden', 'true');

  const grip = el('span', 'inv-grip');
  grip.setAttribute('aria-hidden', 'true');
  grip.title = 'Drag to reorder';
  card.append(grip, info, face);
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

function isFittedView(a) {
  return zoom <= zoomRange().min + 1e-6
    && Math.abs(offset.x - (a.padX + (a.w - a.gridW) / 2)) <= 1
    && Math.abs(offset.y - (a.padY + (a.h - a.gridH) / 2)) <= 1;
}

function syncCenterButton(a) {
  centerViewBtn.hidden = isFittedView(a);
}

function setOffset(x, y, a = boardArea()) {
  if (Number.isFinite(x)) offset.x = x;
  if (Number.isFinite(y)) offset.y = y;
  (isoMode ? iso : grid).style.transform = `translate(${offset.x}px, ${offset.y}px)`;
  syncCenterButton(a);
}

function fitView() {
  hideCardPopup();
  zoom = zoomRange().min;
  layout();
  centerBoard();
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
  if (fill?.active) updateFill();
  if (marquee?.active) updateMarqueeBox();
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
  syncSelectionUI();
  renderInventory();
  layout();
  if (isoMode) renderIso();
}

function setRemoveMode(active) {
  removeMode = active;
  document.body.classList.toggle('remove-mode', active);
  if (active) {
    clearSelection();
    closeCardMenu();
  }
  const toggle = $('toggleRemove');
  toggle.classList.toggle('active', active);
  toggle.setAttribute('aria-pressed', String(active));
  const label = active ? 'Remove mode: on' : 'Remove mode';
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
}

function setIsoMode(active) {
  const fresh = !otherView;
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
  clearSelection();
  closeCardMenu();
  if (active) renderIso();
  else refreshLayout();
  if (fresh) centerBoard();
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

function parseVehicleLevel(value) {
  if (value === '' || value == null || !Number.isFinite(Number(value))) return '';
  return toInt(value, 0, VEHICLE_MAX_LEVEL);
}

function loadVehicleLevel() {
  try {
    return parseVehicleLevel(localStorage.getItem(VEHICLE_LEVEL_KEY));
  } catch {
    return '';
  }
}

function saveVehicleLevel(level) {
  try {
    localStorage.setItem(VEHICLE_LEVEL_KEY, String(level));
  } catch {}
}

function loadVehicleAircoinsOnly() {
  try {
    return localStorage.getItem(VEHICLE_AIRCOINS_KEY) === '1';
  } catch {
    return false;
  }
}

function loadVehicleFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(VEHICLE_FAVORITES_KEY));
    return new Set(Array.isArray(stored) ? stored.filter(name => typeof name === 'string' && VEHICLE_BY_NAME.has(name)) : []);
  } catch {
    return new Set();
  }
}

function saveVehicleFavorites() {
  try {
    localStorage.setItem(VEHICLE_FAVORITES_KEY, JSON.stringify([...vehicleFavorites]));
  } catch {}
}

function loadVehicleFavoritesOnly() {
  try {
    return localStorage.getItem(VEHICLE_FAVORITES_ONLY_KEY) === '1';
  } catch {
    return false;
  }
}

function saveVehicleFavoritesOnly(only) {
  try {
    localStorage.setItem(VEHICLE_FAVORITES_ONLY_KEY, only ? '1' : '0');
  } catch {}
}

function saveVehicleAircoinsOnly(only) {
  try {
    localStorage.setItem(VEHICLE_AIRCOINS_KEY, only ? '1' : '0');
  } catch {}
}

function loadGoalsDone(key = GOALS_KEY, max = GOALS.length) {
  try {
    return toInt(localStorage.getItem(key), 0, max, 0);
  } catch {
    return 0;
  }
}

function saveGoalsDone(count, key = GOALS_KEY) {
  try {
    localStorage.setItem(key, String(count));
  } catch {}
}

function hangarMaxQty(v) {
  return v.maxOwned ?? HANGAR_MAX_QTY;
}

function loadHangarPlan() {
  const plan = new Map(HANGARS.map(h => [h.id, new Map()]));
  try {
    const stored = JSON.parse(localStorage.getItem(HANGAR_PLAN_KEY));
    if (!stored || typeof stored !== 'object') return plan;
    for (const [id, raw] of Object.entries(stored)) {
      if (!plan.has(id) || !raw || typeof raw !== 'object') continue;
      for (const [name, qty] of Object.entries(raw)) {
        const v = VEHICLE_BY_NAME.get(name);
        if (v && v.category === id) plan.get(id).set(name, toInt(qty, 1, hangarMaxQty(v), 1));
      }
    }
  } catch {}
  return plan;
}

function saveHangarPlan() {
  try {
    const stored = {};
    for (const [id, items] of hangarPlan) stored[id] = Object.fromEntries(items);
    localStorage.setItem(HANGAR_PLAN_KEY, JSON.stringify(stored));
  } catch {}
}

function setMenuOpen(open) {
  if (!open && menuPanel.contains(document.activeElement)) menuToggle.focus();
  menuOpen = open;
  menuPanel.classList.toggle('open', open);
  menuPanel.inert = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function scrollBoardTopRight() {
  const a = boardArea();
  const x = a.gridW <= a.w ? a.padX + (a.w - a.gridW) / 2 : a.padX + a.w - a.gridW;
  const y = a.gridH <= a.h ? a.padY + (a.h - a.gridH) / 2 : a.padY;
  setOffset(x, y, a);
}

function centerBoard() {
  const a = boardArea();
  setOffset(a.padX + (a.w - a.gridW) / 2, a.padY + (a.h - a.gridH) / 2, a);
}

function refreshLayout() {
  if (isFittedView(boardArea())) {
    fitView();
    return;
  }
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
  closeCardMenu();
  hideCardPopup();
  hideArea();
  grid.classList.add('is-drag-active');
  if (drag.group) {
    for (const card of grid.querySelectorAll('.card')) {
      if (drag.groupIds.has(card.dataset.id)) card.classList.add('is-dragging');
    }
  } else {
    drag.source?.classList.add('is-dragging');
  }
  document.body.classList.add('is-card-dragging');
  try {
    document.body.setPointerCapture(drag.pointerId);
  } catch {
    endDrag();
    return;
  }
  const type = typeOf(drag.typeId);
  dragGhost.replaceChildren(hasIcon(type) ? createIconImg(type.icon, 'ghost-icon') : type.name);
  if (drag.group) {
    dragGhost.append(el('span', 'ghost-badge', `×${drag.group.length}`));
    drag.previews = drag.group.map(m => {
      if (m.instId === drag.instId) return preview;
      const node = el('div', 'preview');
      node.hidden = true;
      return grid.appendChild(node);
    });
  }
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

function groupRects() {
  const cell = cellFromEvent({ clientX: drag.x, clientY: drag.y });
  return drag.group.map(m => ({ x: cell.x + m.rx, y: cell.y + m.ry, ...sizeOf(typeOf(m.typeId), m.rot) }));
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
  if (drag.group) {
    const rects = groupRects();
    const valid = canPlaceGroup(rects, drag.groupIds);
    drag.group.forEach((m, i) => showPreview(rects[i], valid, drag.previews[i]));
    if (type.kind === 'potenziamento') showArea(type, rects[drag.group.findIndex(m => m.instId === drag.instId)]);
    return;
  }
  const rect = dragRect();
  showPreview(rect, canPlace(rect, rect.x, rect.y, drag.instId));
  if (type.kind === 'potenziamento') showArea(type, rect);
}

function rotateDrag() {
  const type = typeOf(drag.typeId);
  if (drag.group) {
    rotateMembers(drag.group);
    const { h } = sizeOf(type, drag.rot);
    [drag.offX, drag.offY] = [h - 1 - drag.offY, drag.offX];
    if (type.w !== type.h) drag.rot = !drag.rot;
    updateDrag();
    return;
  }
  if (type.w === type.h) return;
  drag.rot = !drag.rot;
  [drag.offX, drag.offY] = [drag.offY, drag.offX];
  updateDrag();
}

function dropDrag() {
  if (!drag.active) {
    if (drag.instId) setSelection([drag.instId]);
    drag = null;
    return;
  }
  if (!isOverGrid(drag.x, drag.y)) {
    endDrag();
    return;
  }
  const { instId, typeId, rot, group, groupIds } = drag;
  if (group) {
    const rects = groupRects();
    endDrag();
    if (!canPlaceGroup(rects, groupIds)) return;
    placeInstances(group.map((m, i) => ({ instId: m.instId, x: rects[i].x, y: rects[i].y, rot: m.rot })));
    return;
  }
  const rect = dragRect();
  endDrag();
  if (!canPlace(rect, rect.x, rect.y, instId)) return;
  if (instId) placeInstance(instId, rect.x, rect.y, rot);
  else createInstance(typeId, rect.x, rect.y, rot);
}

function endDrag() {
  stopAutoScroll();
  if (drag?.active && document.body.hasPointerCapture(drag.pointerId)) document.body.releasePointerCapture(drag.pointerId);
  drag?.previews?.forEach(node => {
    if (node !== preview) node.remove();
  });
  drag = null;
  hideCardPopup();
  grid.classList.remove('is-drag-active');
  grid.querySelectorAll('.card.is-dragging').forEach(card => card.classList.remove('is-dragging'));
  document.body.classList.remove('is-card-dragging');
  dragGhost.hidden = true;
  dragGhost.replaceChildren();
  hidePreview();
  hideArea();
}

function startFill(e, inst) {
  fill = {
    pointerId: e.pointerId,
    typeId: inst.typeId,
    rot: inst.rot,
    origin: { x: inst.x, y: inst.y },
    startX: e.clientX,
    startY: e.clientY,
    x: e.clientX,
    y: e.clientY,
    active: false,
    previews: []
  };
}

function activateFill() {
  suppressMenu = true;
  const type = typeOf(fill.typeId);
  if (limitReached(type)) {
    endFill();
    showMsg(`Limit reached: max ${limitOf(type)} "${presetOf(type).name}"`);
    return;
  }
  fill.active = true;
  closeCardMenu();
  hideCardPopup();
  hideArea();
  grid.classList.add('is-drag-active');
  document.body.classList.add('is-filling');
  try {
    document.body.setPointerCapture(fill.pointerId);
  } catch {
    endFill();
  }
}

function fillCells() {
  const end = clampedCell({ clientX: fill.x, clientY: fill.y });
  const dx = end.x - fill.origin.x;
  const dy = end.y - fill.origin.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const delta = horizontal ? dx : dy;
  const free = [];
  for (let i = 1; i <= Math.abs(delta); i++) {
    const step = i * Math.sign(delta);
    const cell = horizontal ? { x: fill.origin.x + step, y: fill.origin.y } : { x: fill.origin.x, y: fill.origin.y + step };
    if (canPlace({ w: 1, h: 1 }, cell.x, cell.y)) free.push(cell);
  }
  const type = typeOf(fill.typeId);
  const remaining = limitOf(type) > 0 ? Math.max(0, limitOf(type) - placedByIcon(type.icon)) : Infinity;
  return { valid: free.slice(0, remaining), over: free.slice(remaining) };
}

function updateFill() {
  const { valid, over } = fillCells();
  const shown = [...valid.map(cell => [cell, true]), ...over.map(cell => [cell, false])];
  while (fill.previews.length < shown.length) {
    fill.previews.push(grid.appendChild(el('div', 'preview')));
  }
  fill.previews.forEach((node, i) => {
    if (i < shown.length) showPreview({ ...shown[i][0], w: 1, h: 1 }, shown[i][1], node);
    else node.hidden = true;
  });
}

function finishFill() {
  if (!fill) return;
  if (!fill.active) {
    endFill();
    return;
  }
  const { typeId, rot } = fill;
  const { valid, over } = fillCells();
  endFill();
  if (valid.length === 0) return;
  const type = typeOf(typeId);
  const msg = over.length > 0 ? `Limit reached: max ${limitOf(type)} "${presetOf(type).name}"` : undefined;
  createInstances(typeId, valid, rot, msg);
}

function endFill() {
  if (!fill) return;
  if (fill.active && document.body.hasPointerCapture(fill.pointerId)) document.body.releasePointerCapture(fill.pointerId);
  fill.previews.forEach(node => node.remove());
  fill = null;
  grid.classList.remove('is-drag-active');
  document.body.classList.remove('is-filling');
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
  const a = boardArea();
  let nx = x + vx * AUTOSCROLL_SPEED * dt / 1000;
  let ny = y + vy * AUTOSCROLL_SPEED * dt / 1000;
  if (vx > 0) nx = Math.min(nx, Math.max(x, a.padX));
  else if (vx < 0) nx = Math.max(nx, Math.min(x, a.padX + a.w - a.gridW));
  if (vy > 0) ny = Math.min(ny, Math.max(y, a.padY));
  else if (vy < 0) ny = Math.max(ny, Math.min(y, a.padY + a.h - a.gridH));
  setOffset(nx, ny, a);
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
  if (e.button === 2 && !drag) suppressMenu = false;
  if (e.button === 2 && card && e.pointerType !== 'touch' && !removeMode && !drag && !isoMode && !fill) {
    const inst = instanceOf(card.dataset.id);
    const type = typeOf(inst.typeId);
    if (type.w === 1 && type.h === 1) {
      startFill(e, inst);
      return;
    }
  }
  if (e.button === 1 && card && e.pointerType !== 'touch' && !removeMode && !drag) {
    e.preventDefault();
    rotateInstance(card.dataset.id);
    return;
  }
  if (e.button !== 0 || e.pointerType === 'touch' || removeMode || drag || fill || !card) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    toggleSelected(card.dataset.id);
    return;
  }
  const inst = instanceOf(card.dataset.id);
  const rect = rectOf(inst);
  const cell = cellFromEvent(e);
  const offX = Math.min(rect.w - 1, Math.max(0, cell.x - rect.x));
  const offY = Math.min(rect.h - 1, Math.max(0, cell.y - rect.y));
  const data = { instId: inst.id, typeId: inst.typeId, rot: inst.rot, offX, offY };
  if (selection.has(inst.id) && selection.size > 1) {
    data.groupIds = new Set(selection);
    data.group = groupMembers(selection, rect.x + offX, rect.y + offY);
  } else if (!selection.has(inst.id)) {
    setSelection([inst.id]);
  }
  startDrag(e, data, card);
});

grid.addEventListener('contextmenu', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  e.preventDefault();
  if (drag || removeMode || suppressMenu) {
    suppressMenu = false;
    return;
  }
  openCardMenu(card.dataset.id, e.clientX, e.clientY, cellFromEvent(e));
});

function openCardMenu(instId, x, y, cell) {
  hideCardPopup();
  if (!selection.has(instId)) setSelection([instId]);
  const ids = selection.size > 1 ? [...selection] : [instId];
  const group = ids.length > 1;
  const type = typeOf(instanceOf(instId).typeId);
  const rotateItem = cardMenu.querySelector('[data-action="rotate"]');
  const deleteItem = cardMenu.querySelector('[data-action="delete"]');
  rotateItem.textContent = group ? 'Rotate selection' : 'Rotate';
  rotateItem.disabled = !group && type.w === type.h;
  deleteItem.textContent = group ? `Delete ${ids.length} selected` : 'Delete';
  cardMenuTarget = { instId, ids, cell };
  cardMenu.hidden = false;
  const menu = cardMenu.getBoundingClientRect();
  const left = x + menu.width + POPUP_MARGIN > window.innerWidth ? x - menu.width : x;
  const top = y + menu.height + POPUP_MARGIN > window.innerHeight ? y - menu.height : y;
  cardMenu.style.left = `${Math.max(POPUP_MARGIN, left)}px`;
  cardMenu.style.top = `${Math.max(POPUP_MARGIN, top)}px`;
  cardMenu.focus();
}

function closeCardMenu() {
  if (cardMenu.hidden) return;
  cardMenu.hidden = true;
  cardMenuTarget = null;
}

cardMenu.addEventListener('click', e => {
  const button = e.target.closest('[data-action]');
  if (!button || button.disabled || !cardMenuTarget) return;
  const { instId, ids, cell } = cardMenuTarget;
  closeCardMenu();
  if (!ids.every(id => instanceOf(id))) return;
  if (button.dataset.action === 'delete') removeInstances(ids);
  else if (ids.length > 1) rotateSelection(ids, cell);
  else rotateInstance(instId);
});

cardMenu.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    closeCardMenu();
    return;
  }
  const items = [...cardMenu.querySelectorAll('button:not(:disabled)')];
  const index = items.indexOf(document.activeElement);
  let next = -1;
  if (e.key === 'ArrowDown') next = (index + 1) % items.length;
  else if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = items.length - 1;
  if (next < 0) return;
  e.preventDefault();
  items[next]?.focus();
});

grid.addEventListener('click', e => {
  if (!removeMode) return;
  const card = e.target.closest('.card');
  if (card) toDeposit(card.dataset.id);
});

function placeInvReorder() {
  const { card, x } = invReorder;
  const next = [...invList.children].find(c => {
    if (c === card) return false;
    const r = c.getBoundingClientRect();
    return x < r.left + r.width / 2;
  });
  if (next) {
    if (card.nextElementSibling !== next) invList.insertBefore(card, next);
  } else if (invList.lastElementChild !== card) {
    invList.append(card);
  }
}

function invReorderVelocity() {
  const r = invList.getBoundingClientRect();
  const ratio = d => Math.min(1, Math.max(0, (AUTOSCROLL_EDGE - d) / AUTOSCROLL_EDGE));
  const vx = ratio(invReorder.x - r.left) - ratio(r.right - invReorder.x);
  if (!invReorder.scrollArmed) {
    if (vx === 0) invReorder.scrollArmed = true;
    return 0;
  }
  return vx;
}

function invReorderScrollTick(now) {
  invReorderScroll.frame = 0;
  if (!invReorder?.active) return;
  const vx = invReorderVelocity();
  if (vx === 0) {
    invReorderScroll.last = 0;
    return;
  }
  const dt = invReorderScroll.last ? Math.min(AUTOSCROLL_MAX_DT, now - invReorderScroll.last) : 16;
  invReorderScroll.last = now;
  const before = invList.scrollLeft;
  invList.scrollLeft += vx * AUTOSCROLL_SPEED * dt / 1000;
  if (invList.scrollLeft === before) {
    invReorderScroll.last = 0;
    return;
  }
  placeInvReorder();
  startInvReorderScroll();
}

function startInvReorderScroll() {
  if (!invReorderScroll.frame) invReorderScroll.frame = requestAnimationFrame(invReorderScrollTick);
}

function startInvReorder(e, card) {
  invReorder = { pointerId: e.pointerId, card, startX: e.clientX, startY: e.clientY, x: e.clientX, active: false, scrollArmed: false };
  invList.setPointerCapture(e.pointerId);
}

function stopInvReorder() {
  cancelAnimationFrame(invReorderScroll.frame);
  invReorderScroll.frame = 0;
  invReorderScroll.last = 0;
  const reorder = invReorder;
  invReorder = null;
  reorder.card.classList.remove('is-reordering');
  invList.classList.remove('is-reordering');
  document.body.classList.remove('is-inv-reordering');
  if (invList.hasPointerCapture(reorder.pointerId)) invList.releasePointerCapture(reorder.pointerId);
}

function cancelInvReorder() {
  if (!invReorder) return;
  stopInvReorder();
  renderInventory();
}

function finishInvReorder() {
  if (!invReorder) return;
  const { active } = invReorder;
  const ids = [...invList.querySelectorAll('.inv-card')].map(c => c.dataset.id);
  stopInvReorder();
  if (!active) return;
  invReorderClickGuard = true;
  setTimeout(() => {
    invReorderClickGuard = false;
  }, 0);
  if (!reorderTypes(invCategory, ids)) renderInventory();
}

invList.addEventListener('pointermove', e => {
  if (!invReorder || e.pointerId !== invReorder.pointerId) return;
  if (!(e.buttons & 1)) {
    finishInvReorder();
    return;
  }
  invReorder.x = e.clientX;
  if (!invReorder.active) {
    if (Math.hypot(e.clientX - invReorder.startX, e.clientY - invReorder.startY) < PAN_THRESHOLD) return;
    invReorder.active = true;
    hideCardPopup();
    invReorder.card.classList.add('is-reordering');
    invList.classList.add('is-reordering');
    document.body.classList.add('is-inv-reordering');
  }
  placeInvReorder();
  startInvReorderScroll();
});
invList.addEventListener('pointerup', e => {
  if (invReorder && e.pointerId === invReorder.pointerId) finishInvReorder();
});
invList.addEventListener('pointercancel', e => {
  if (invReorder && e.pointerId === invReorder.pointerId) cancelInvReorder();
});
invList.addEventListener('lostpointercapture', e => {
  if (invReorder && e.pointerId === invReorder.pointerId) cancelInvReorder();
});

invList.addEventListener('pointerdown', e => {
  const card = e.target.closest('.inv-card');
  if (e.button !== 0 || e.pointerType === 'touch' || drag || invReorder || !card) return;
  if (e.target.closest('.inv-grip')) {
    startInvReorder(e, card);
    return;
  }
  startDrag(e, { instId: null, typeId: card.dataset.id, rot: false, offX: 0, offY: 0 }, null);
});

invList.addEventListener('click', e => {
  const card = e.target.closest('.inv-card');
  if (card && !invReorderClickGuard && !e.target.closest('.inv-grip')) openTypeDialog(card.dataset.id);
});

invList.addEventListener('keydown', e => {
  const card = e.target.closest('.inv-card');
  if (!card) return;
  if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    const id = card.dataset.id;
    moveType(id, e.key === 'ArrowLeft' ? -1 : 1);
    const moved = invList.querySelector(`.inv-card[data-id="${id}"]`);
    moved?.focus();
    moved?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    return;
  }
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  openTypeDialog(card.dataset.id);
});

invList.addEventListener('pointerover', e => {
  const info = e.target.closest('.inv-info');
  if (!info || drag || invReorder) return;
  showTypePopup(typeOf(info.parentElement.dataset.id), info.parentElement);
});
invList.addEventListener('pointerout', e => {
  if (e.target.closest('.inv-info') && !e.relatedTarget?.closest?.('.inv-info')) hideCardPopup();
});
invList.addEventListener('focusin', e => {
  const card = e.target.closest('.inv-card');
  if (card?.matches(':focus-visible')) showTypePopup(typeOf(card.dataset.id), card);
});
invList.addEventListener('focusout', hideCardPopup);

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
  closeCardMenu();
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

function createEventNodes() {
  const nodes = EVENTS.filter(e => e.items.length).flatMap(e => [el('h3', 'preset-event-title', e.event), ...e.items.map(createPresetCard)]);
  return nodes.length ? nodes : [el('p', 'hint', 'No event items available')];
}

function renderPresets() {
  for (const tab of presetTabs.children) tab.setAttribute('aria-selected', String(tab.dataset.category === presetCategory));
  presetGrid.replaceChildren(...(presetCategory === 'event' ? createEventNodes() : PRESETS.filter(p => p.category === presetCategory).map(createPresetCard)));
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

function computeVehicleBadges(list) {
  const stats = new Map(list.map(v => [v, vehicleStats(v)]));
  const max = new Map();
  for (const vehicleStat of stats.values()) {
    for (const { label, value } of vehicleStat) {
      if (value > 0 && value > (max.get(label) ?? 0)) max.set(label, value);
    }
  }
  return new Map(list.map(v => [v, stats.get(v).filter(({ label, value }) => value > 0 && value === max.get(label)).map(({ label }) => 'Top ' + label)]));
}

function formatClock(n, padHead) {
  const head = String(Math.floor(n / 60));
  return `${padHead ? head.padStart(2, '0') : head}:${String(n % 60).padStart(2, '0')}`;
}

function vehiclePriceLine(v) {
  if (v.price) return `${formatPrice(v.price.amount)} ${v.price.currency === 'aircash' ? 'Aircash' : 'Aircoins'}`;
  return v.constructionHallLevel != null ? `Construction Hall lvl ${v.constructionHallLevel}` : 'Not for sale';
}

function showVehicleTip(target) {
  vehicleTip.textContent = target.dataset.tip;
  vehicleTip.hidden = false;
  const rect = target.getBoundingClientRect();
  const tip = vehicleTip.getBoundingClientRect();
  const margin = 8;
  const x = Math.min(Math.max(rect.left + rect.width / 2 - tip.width / 2, margin), window.innerWidth - tip.width - margin);
  const above = rect.top - tip.height - 6;
  const y = above >= margin ? above : rect.bottom + 6;
  vehicleTip.style.left = `${x}px`;
  vehicleTip.style.top = `${y}px`;
}

function hideVehicleTip() {
  vehicleTip.hidden = true;
}

function syncFavoriteButton(button, on) {
  const label = on ? 'Remove from favorites' : 'Add to favorites';
  button.setAttribute('aria-pressed', String(on));
  button.setAttribute('aria-label', label);
  button.dataset.tip = label;
}

function createVehicleCard(v, badges, scope) {
  const card = el('div', 'vehicle-card');
  const icon = createIconImg(v.icon, 'vehicle-icon', () => icon.replaceWith(createInitials(v)));
  const group = vehicleGroup(v);
  const kind = v.type === 'cargo' ? VEHICLE_CATEGORY_SHORT[v.category] ?? VEHICLE_GROUP_LABELS[v.category] : 'Passenger';
  const title = el('div', 'vehicle-title');
  const favorite = el('button', 'vehicle-fav');
  favorite.type = 'button';
  favorite.dataset.favorite = v.name;
  const favoriteIcon = el('span', 'fav-icon');
  favoriteIcon.setAttribute('aria-hidden', 'true');
  favorite.append(favoriteIcon);
  syncFavoriteButton(favorite, vehicleFavorites.has(v.name));
  title.append(el('span', 'preset-name', v.name), favorite);
  card.append(icon, title, el('span', 'inv-dim', `${VEHICLE_GROUP_LABELS[group]} · ${kind}`), createVehicleStats(v));
  if (v.unlockLevel != null) {
    const level = el('span', 'vehicle-level', `Lvl ${v.unlockLevel}`);
    level.dataset.tip = `Unlock level ${v.unlockLevel}`;
    card.append(level);
  }
  if (v.maxOwned === 1) {
    const max = el('span', 'vehicle-max', 'Max 1');
    max.dataset.tip = 'Only one can be owned';
    card.append(max);
  }
  if (v.notes) card.append(el('span', 'vehicle-notes', v.notes));
  if (badges.length) {
    const row = el('div', 'vehicle-badges');
    for (const label of badges) {
      const chip = el('span', 'vehicle-badge', label);
      chip.dataset.tip = `Best ${label.slice(4)} among ${scope}`;
      row.append(chip);
    }
    card.append(row);
  }
  return card;
}

function createVehicleStats(v) {
  const stats = [
    { key: 'flight', label: 'Flight', value: formatClock(v.flightTimeMinutes) },
    v.serviceTimeSeconds != null && { key: 'service', label: 'Service', value: formatClock(v.serviceTimeSeconds, true) },
    { key: 'cost', label: 'Cost', value: formatPrice(v.cost.amount), unit: v.cost.resource },
    v.reward.aircoins != null && { key: 'aircoins', label: 'Aircoins', value: formatPrice(v.reward.aircoins) },
    v.reward.goods != null && { key: 'goods', label: 'Goods', value: formatPrice(v.reward.goods) },
    { key: 'xp', label: 'XP', value: String(v.reward.xp) },
    { key: 'price', label: 'Price', value: vehiclePriceLine(v) }
  ].filter(Boolean);
  const list = el('dl', 'vehicle-stats');
  for (const { key, label, value, unit } of stats) {
    const term = el('dt');
    const statIcon = el('span', `stat-icon stat-icon-${key}`);
    statIcon.setAttribute('role', 'img');
    statIcon.setAttribute('aria-label', label);
    statIcon.dataset.tip = label;
    term.append(statIcon);
    const desc = el('dd', undefined, value);
    if (unit) {
      const unitIcon = el('span', `stat-icon stat-icon-${unit}`);
      unitIcon.setAttribute('role', 'img');
      unitIcon.setAttribute('aria-label', VEHICLE_COST_UNITS[unit]);
      unitIcon.dataset.tip = VEHICLE_COST_UNITS[unit];
      desc.append(unitIcon);
    }
    list.append(term, desc);
  }
  return list;
}

function inVehicleGroup(v) {
  return vehicleGroupFilter.size === 0 || vehicleGroupFilter.has(vehicleGroup(v));
}

function vehicleGroupsLabel() {
  if (vehicleGroupFilter.size === 0) return 'planes';
  const adjectives = [];
  const nouns = [];
  for (const group of Object.keys(VEHICLE_GROUP_LABELS).filter(g => vehicleGroupFilter.has(g))) {
    const plural = VEHICLE_GROUP_PLURALS[group];
    if (plural.endsWith(' planes')) adjectives.push(plural.slice(0, -' planes'.length));
    else nouns.push(plural);
  }
  const parts = adjectives.length ? [`${VEHICLE_GROUP_LIST.format(adjectives)} planes`, ...nouns] : nouns;
  return VEHICLE_GROUP_LIST.format(parts);
}

function matchesVehicleFilters(v) {
  return inVehicleGroup(v)
    && (vehicleMaxLevel === '' || v.unlockLevel == null || v.unlockLevel <= vehicleMaxLevel)
    && (!vehicleAircoinsOnly || v.price?.currency === 'aircoins')
    && (!vehicleFavoritesOnly || vehicleFavorites.has(v.name));
}

function renderVehicleDurations() {
  const durations = [...new Set(VEHICLES.filter(matchesVehicleFilters).map(v => v.flightTimeMinutes))].sort((a, b) => a - b);
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
  for (const tab of vehicleTabs.children) {
    const group = tab.dataset.group;
    tab.setAttribute('aria-pressed', String(group === 'all' ? vehicleGroupFilter.size === 0 : vehicleGroupFilter.has(group)));
  }
  const list = VEHICLES
    .filter(v => matchesVehicleFilters(v) && (vehicleDuration === '' || v.flightTimeMinutes === Number(vehicleDuration)));
  const badges = computeVehicleBadges(list);
  list.sort(compareVehicles);
  const scope = `the listed ${vehicleGroupsLabel()}` + (vehicleDuration !== '' ? ` with ${formatDuration(Number(vehicleDuration))} flights` : '')
    + (vehicleMaxLevel !== '' ? ` up to level ${vehicleMaxLevel}` : '')
    + (vehicleAircoinsOnly ? ' buyable with Aircoins' : '')
    + (vehicleFavoritesOnly ? ' in your favorites' : '');
  if (list.length) vehicleGrid.replaceChildren(...list.map(v => createVehicleCard(v, badges.get(v) ?? [], scope)));
  else vehicleGrid.replaceChildren(el('p', 'hint', vehicleFavoritesOnly && vehicleFavorites.size === 0 ? "No favorite planes yet: use the star next to a plane's name" : 'No planes match the selected filters'));
  vehicleGrid.scrollTop = 0;
}

function createGoalPlaneIcon(name) {
  const vehicle = VEHICLE_BY_NAME.get(name);
  if (!vehicle?.icon) return null;
  const img = createIconImg(vehicle.icon, 'goal-plane-icon', () => img.remove());
  return img;
}

function goalsDoneOf(tab) {
  return tab === 'story' ? storyGoalsDone : goalsDone;
}

function setGoalsDoneOf(tab, count) {
  if (tab === 'story') storyGoalsDone = count;
  else goalsDone = count;
}

function activeGoalList() {
  return { ...GOAL_LISTS[goalsTab], done: goalsDoneOf(goalsTab) };
}

function goalLabel(tab, index) {
  return `${GOAL_LISTS[tab].short} #${index + 1}`;
}

function goalRef(tab, index) {
  return `${goalLabel(tab, index)} ${GOAL_LISTS[tab].goals[index].name}`;
}

function renderGoalTabs() {
  for (const tab of goalTabs.children) {
    const key = tab.dataset.goals;
    tab.setAttribute('aria-selected', String(key === goalsTab));
    tab.textContent = `${GOAL_LISTS[key].label} · ${goalsDoneOf(key)}/${GOAL_LISTS[key].goals.length}`;
  }
}

function createGoalCard(goal, index) {
  const doneCount = goalsDoneOf(goalsTab);
  const done = index < doneCount;
  const current = index === doneCount;
  const card = el('div', 'goal-card');
  card.classList.toggle('is-done', done);
  card.classList.toggle('is-current', current);
  if (current) card.setAttribute('aria-current', 'step');
  const head = el('div', 'goal-head');
  head.append(el('span', 'goal-index', `#${index + 1}`));
  if (done) head.append(el('span', 'goal-done', 'Done'));
  const tasks = el('ul', 'goal-tasks');
  for (const task of goal.tasks) {
    const item = el('li', 'goal-task');
    const icon = task.plane ? createGoalPlaneIcon(task.plane) : null;
    if (icon) item.append(icon);
    item.append(el('span', undefined, task.text));
    tasks.append(item);
  }
  const rewards = el('div', 'goal-rewards');
  for (const reward of goal.rewards) {
    const kind = /\baircoins?\b/i.test(reward.text) ? ' goal-reward-aircoins' : /\bxp\b/i.test(reward.text) ? ' goal-reward-xp' : '';
    const chip = el('span', `goal-reward${kind}`);
    const icon = reward.plane ? createGoalPlaneIcon(reward.plane) : null;
    if (icon) chip.append(icon);
    chip.append(reward.text);
    rewards.append(chip);
  }
  const actions = el('div', 'goal-actions');
  const addAction = (action, label, className) => {
    const button = el('button', className, label);
    button.type = 'button';
    button.dataset.action = action;
    button.dataset.index = String(index);
    actions.append(button);
  };
  if (current) {
    addAction('complete', 'Complete', 'primary');
    if (doneCount > 0) addAction('back', 'Back');
  } else {
    addAction('set', 'Set as current');
  }
  card.append(head, el('div', 'goal-title', goal.name), tasks, rewards, actions);
  return card;
}

function createGoalsFinishedCard(noun) {
  const card = el('div', 'goal-card goal-finished is-current');
  card.setAttribute('aria-current', 'step');
  const actions = el('div', 'goal-actions');
  const button = el('button', undefined, 'Back to last goal');
  button.type = 'button';
  button.dataset.action = 'last';
  actions.append(button);
  card.append(el('div', 'goal-title', `All ${noun} goals completed`), actions);
  return card;
}

function renderGoals() {
  const { goals, done, label, noun } = activeGoalList();
  const percent = goals.length ? Math.round(done / goals.length * 100) : 0;
  goalsProgress.setAttribute('aria-label', `${label} progress`);
  goalsProgress.setAttribute('aria-valuemax', String(goals.length));
  goalsProgress.setAttribute('aria-valuenow', String(done));
  goalsProgress.firstElementChild.style.width = `${percent}%`;
  goalsProgressText.textContent = `${done} / ${goals.length} completed · ${percent}%`;
  goalsProgress.setAttribute('aria-valuetext', goalsProgressText.textContent);
  if (goals.length === 0) {
    goalRow.replaceChildren(el('p', 'hint', 'No goals available'));
    return;
  }
  const terms = normalizeSearch(goalQuery).split(' ').filter(Boolean);
  const cards = [];
  goals.forEach((goal, index) => {
    if (goalMatches(index, terms)) cards.push(createGoalCard(goal, index));
  });
  if (terms.length === 0 && done === goals.length) cards.push(createGoalsFinishedCard(noun));
  goalSearchCount.textContent = terms.length === 0 ? '' : cards.length === 1 ? '1 goal found' : `${cards.length} goals found`;
  if (cards.length === 0) goalRow.replaceChildren(el('p', 'hint', 'No goals match your search'));
  else goalRow.replaceChildren(...cards);
}

function goalMatches(index, terms) {
  const text = GOAL_LISTS[goalsTab].search[index];
  return terms.every(term => {
    const hash = /^#(\d+)$/.exec(term);
    if (hash) return index + 1 === Number(hash[1]);
    if (/^\d+$/.test(term)) return index + 1 === Number(term) || text.includes(term);
    return text.includes(term);
  });
}

function closeOnBackdrop(target) {
  let outside = false;
  const isOutside = e => {
    const r = target.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  target.addEventListener('pointerdown', e => { outside = e.target === target && isOutside(e); });
  target.addEventListener('click', e => {
    if (outside && e.target === target && isOutside(e)) target.close();
    outside = false;
  });
}

function scrollToCurrentGoal() {
  goalRow.querySelector('.is-current')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}

function setGoalsDone(count, sourceIndex) {
  const scrollLeft = goalRow.scrollLeft;
  const { goals, key } = activeGoalList();
  const done = toInt(count, 0, goals.length, 0);
  setGoalsDoneOf(goalsTab, done);
  saveGoalsDone(done, key);
  renderGoalTabs();
  renderGoals();
  if (goalRow.querySelector('.is-current')) scrollToCurrentGoal();
  else goalRow.scrollLeft = scrollLeft;
  const target = goalRow.querySelector('.is-current button') ?? goalRow.querySelector(`[data-index="${sourceIndex}"]`) ?? goalSearchInput;
  target.focus({ preventScroll: true });
}

function goalGroupCategories(group) {
  return group === 'any' ? GOAL_ANY_CATEGORIES : [group];
}

function genericRepresentative(group) {
  const categories = goalGroupCategories(group);
  return VEHICLES
    .filter(v => categories.includes(v.category) && v.price?.currency === 'aircoins' && v.maxOwned !== 1)
    .sort((a, b) => (a.unlockLevel ?? Infinity) - (b.unlockLevel ?? Infinity) || a.price.amount - b.price.amount)[0];
}

function requiredPlanes() {
  const tabs = Object.keys(GOAL_LISTS);
  const specific = new Map();
  const generic = new Map();
  const addUse = (map, key, tab, index, base) => {
    const entry = map.get(key) ?? { ...base, count: 0, uses: {} };
    const use = entry.uses[tab] ??= { first: index, count: 0 };
    use.count++;
    entry.count++;
    map.set(key, entry);
  };
  for (const tab of tabs) {
    const { goals } = GOAL_LISTS[tab];
    for (let n = goalsDoneOf(tab); n < goals.length; n++) {
      const goal = goals[n];
      for (const name of new Set(goal.tasks.filter(t => t.plane).map(t => t.plane))) {
        addUse(specific, name, tab, n, { vehicle: VEHICLE_BY_NAME.get(name), group: null });
      }
      for (const group of new Set(goal.tasks.filter(t => t.group).map(t => t.group))) {
        addUse(generic, group, tab, n, { group });
      }
    }
  }
  const planes = [...specific.values()].filter(item => item.vehicle);
  for (const entry of generic.values()) {
    const categories = goalGroupCategories(entry.group);
    if (planes.some(item => categories.includes(item.vehicle.category))) continue;
    const vehicle = genericRepresentative(entry.group);
    if (vehicle) planes.push({ ...entry, vehicle });
  }
  for (const item of planes) {
    const usedTabs = tabs.filter(tab => item.uses[tab]);
    item.first = { tab: usedTabs[0], index: item.uses[usedTabs[0]].first };
    item.rewardFrom = null;
    for (const usedTab of usedTabs) {
      const source = GOAL_LISTS[usedTab].goals.findIndex((goal, j) => j >= goalsDoneOf(usedTab) && j < item.uses[usedTab].first && goal.rewards.some(r => r.plane === item.vehicle.name));
      if (source >= 0) {
        item.rewardFrom = { tab: usedTab, index: source };
        break;
      }
    }
  }
  planes.sort((a, b) => tabs.indexOf(a.first.tab) - tabs.indexOf(b.first.tab) || a.first.index - b.first.index);
  return planes;
}

function goalCountText(count, noun) {
  return `${count} ${noun} goal${count === 1 ? '' : 's'}`;
}

function goalUsesText(uses) {
  return Object.keys(GOAL_LISTS).filter(tab => uses[tab]).map(tab => goalCountText(uses[tab].count, GOAL_LISTS[tab].noun));
}

function createRequiredPlane({ vehicle, first, uses, group, rewardFrom }) {
  const row = el('div', 'required-plane');
  const icon = createIconImg(vehicle.icon, 'vehicle-icon', () => icon.replaceWith(createInitials(vehicle)));
  const body = el('div', 'required-body');
  const level = vehicle.unlockLevel != null ? `Lvl ${vehicle.unlockLevel} · ` : '';
  const firsts = Object.keys(GOAL_LISTS).filter(tab => uses[tab]).map(tab => tab === first.tab ? goalRef(tab, first.index) : goalLabel(tab, uses[tab].first));
  body.append(
    el('span', 'required-name', vehicle.name),
    el('span', 'inv-dim', `${level}${vehiclePriceLine(vehicle)}`),
    el('span', 'inv-dim', `First needed: ${firsts.join(' · ')} · used in ${goalUsesText(uses).join(' and ')}`)
  );
  if (group) body.append(el('span', 'inv-dim', group === 'any' ? 'Any plane' : `Any ${VEHICLE_GROUP_LABELS[group]} plane`));
  row.append(icon, body);
  if (rewardFrom) row.append(el('span', 'required-chip', `Reward from ${goalLabel(rewardFrom.tab, rewardFrom.index)}`));
  return row;
}

function renderRequiredPlanes() {
  const parts = Object.keys(GOAL_LISTS)
    .map(tab => ({ tab, remaining: GOAL_LISTS[tab].goals.length - goalsDoneOf(tab) }))
    .filter(({ remaining }) => remaining > 0)
    .map(({ tab, remaining }) => goalCountText(remaining, GOAL_LISTS[tab].noun));
  requiredPlanesScope.textContent = `Planes needed for the remaining ${parts.length ? parts.join(' and ') : '0 goals'}`;
  const planes = requiredPlanes();
  if (planes.length) requiredPlanesList.replaceChildren(...planes.map(createRequiredPlane));
  else requiredPlanesList.replaceChildren(el('p', 'hint', 'No specific planes needed for the remaining goals'));
}

function hangarEssentials() {
  return new Map(requiredPlanes().filter(item => item.group === null).map(item => [item.vehicle.name, item]));
}

function compareHangarPlanes(a, b) {
  const [ga, la] = vehicleLevelKey(a);
  const [gb, lb] = vehicleLevelKey(b);
  return ga - gb || la - lb || a.name.localeCompare(b.name, 'en');
}

function createHangarFavorite() {
  const fav = el('span', 'hangar-fav');
  fav.setAttribute('role', 'img');
  fav.setAttribute('aria-label', 'Favorite');
  fav.title = 'Favorite';
  const icon = el('span', 'fav-icon');
  icon.setAttribute('aria-hidden', 'true');
  fav.append(icon);
  return fav;
}

function createHangarButton(text, action, name, label) {
  const button = el('button', '', text);
  button.type = 'button';
  button.dataset.action = action;
  button.dataset.name = name;
  if (label) button.setAttribute('aria-label', label);
  return button;
}

function createHangarStatIcon(key, label) {
  const icon = el('span', `stat-icon stat-icon-${key}`);
  icon.setAttribute('role', 'img');
  icon.setAttribute('aria-label', label);
  icon.title = label;
  return icon;
}

function createHangarSvg(d, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  if (className) svg.setAttribute('class', className);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2.2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

function syncHangarExpand(button, expanded, name) {
  const label = `${expanded ? 'Hide' : 'Show'} stats for ${name}`;
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', label);
  button.title = label;
}

function createHangarStats(v) {
  const list = createVehicleStats(v);
  list.classList.add('hangar-stats');
  for (const node of list.querySelectorAll('[data-tip]')) node.title = node.dataset.tip;
  return list;
}

function toggleHangarStats(button) {
  const { name } = button.dataset;
  const expanded = !hangarExpanded.has(name);
  if (expanded) hangarExpanded.add(name);
  else hangarExpanded.delete(name);
  syncHangarExpand(button, expanded, name);
  const body = button.closest('.required-plane').querySelector('.required-body');
  if (expanded) body.append(createHangarStats(VEHICLE_BY_NAME.get(name)));
  else body.querySelector('.hangar-stats')?.remove();
}

function createHangarPlane(v, qty, essential) {
  const row = el('div', 'required-plane');
  const icon = createIconImg(v.icon, 'vehicle-icon', () => icon.replaceWith(createInitials(v)));
  const body = el('div', 'required-body');
  const title = el('div', 'hangar-title');
  title.append(el('span', 'required-name', v.name));
  if (vehicleFavorites.has(v.name)) title.append(createHangarFavorite());
  const meta = el('span', 'inv-dim hangar-meta');
  if (v.unlockLevel != null) meta.append(`Lvl ${v.unlockLevel} · `);
  if (v.price) {
    const aircash = v.price.currency === 'aircash';
    meta.append(createHangarStatIcon(aircash ? 'aircash' : 'aircoins', aircash ? 'Aircash' : 'Aircoins'), formatPrice(v.price.amount));
  } else {
    meta.append(vehiclePriceLine(v));
  }
  meta.append(' · ', v.type === 'cargo' ? createHangarStatIcon('goods', 'Cargo') : createHangarStatIcon('passengers', 'Passenger'));
  if (v.maxOwned) meta.append(` · Max ${v.maxOwned}`);
  body.append(title, meta);
  const expanded = hangarExpanded.has(v.name);
  const expand = createHangarButton('', 'expand', v.name);
  expand.className = 'hangar-expand';
  expand.append(createHangarSvg('M9 6l6 6-6 6', 'dropdown-chevron'));
  syncHangarExpand(expand, expanded, v.name);
  if (expanded) body.append(createHangarStats(v));
  row.append(expand, icon, body);
  if (essential) {
    const { first, count, uses } = essential;
    const chip = el('span', 'required-chip', `${goalLabel(first.tab, first.index)} · ${count} left`);
    chip.title = `First needed in ${goalRef(first.tab, first.index)}, used in ${goalUsesText(uses).join(' and ')} remaining`;
    row.append(chip);
  }
  if (qty == null) {
    const add = createHangarButton('', 'add', v.name, `Add ${v.name}`);
    add.className = 'hangar-add';
    add.title = `Add ${v.name}`;
    add.append(createHangarSvg('M12 5v14M5 12h14'));
    row.append(add);
    return row;
  }
  const controls = el('div', 'hangar-qty');
  controls.append(createHangarButton('−', 'dec', v.name, `Remove one ${v.name}, ${qty} planned`), el('span', 'hangar-qty-value', String(qty)));
  if (v.maxOwned !== 1) {
    const inc = createHangarButton('+', 'inc', v.name, `Add one ${v.name}, ${qty} planned`);
    inc.disabled = qty >= hangarMaxQty(v);
    controls.append(inc);
  }
  row.append(controls);
  return row;
}

function hangarTotal(id) {
  let total = 0;
  for (const qty of hangarPlan.get(id).values()) total += qty;
  return total;
}

function renderHangarTabs() {
  for (const tab of hangarTabs.children) {
    const hangar = HANGARS.find(h => h.id === tab.dataset.hangar);
    tab.setAttribute('aria-selected', String(hangar.id === hangarTab));
    tab.textContent = `${hangar.label} · ${hangarTotal(hangar.id)}`;
  }
}

function renderHangarPanel() {
  const plan = hangarPlan.get(hangarTab);
  const essentials = hangarEssentials();
  const planes = VEHICLES.filter(v => v.category === hangarTab).sort(compareHangarPlanes);
  const planned = planes.filter(v => plan.has(v.name));
  const available = planes.filter(v => !plan.has(v.name));
  hangarPlannedTitle.textContent = `In hangar (${hangarTotal(hangarTab)})`;
  hangarAvailableTitle.textContent = `Available (${available.length})`;
  hangarPlannedList.replaceChildren(...(planned.length
    ? planned.map(v => createHangarPlane(v, plan.get(v.name), essentials.get(v.name)))
    : [el('p', 'hint', 'No planes planned for this hangar yet')]));
  hangarAvailableList.replaceChildren(...(available.length
    ? available.map(v => createHangarPlane(v, null, essentials.get(v.name)))
    : [el('p', 'hint', 'All planes of this type are already planned')]));
}

function activeHangarTab() {
  return hangarTabs.querySelector('[aria-selected="true"]');
}

function applyHangarAction(button) {
  const { action, name } = button.dataset;
  const v = VEHICLE_BY_NAME.get(name);
  const plan = hangarPlan.get(hangarTab);
  const qty = plan.get(name);
  const row = button.closest('.required-plane');
  const list = row.parentElement;
  const index = [...list.children].indexOf(row);
  if (action === 'add') plan.set(name, 1);
  else if (action === 'inc') plan.set(name, Math.min(qty + 1, hangarMaxQty(v)));
  else if (qty > 1) plan.set(name, qty - 1);
  else plan.delete(name);
  saveHangarPlan();
  const scrolls = [hangarPlannedList.scrollTop, hangarAvailableList.scrollTop];
  renderHangarTabs();
  renderHangarPanel();
  hangarPlannedList.scrollTop = scrolls[0];
  hangarAvailableList.scrollTop = scrolls[1];
  const sameRow = list.querySelector(`[data-name="${CSS.escape(name)}"]`)?.closest('.required-plane');
  let target;
  if (sameRow) {
    target = sameRow.querySelector(`[data-action="${action}"]:not(:disabled)`) ?? sameRow.querySelector('button:not(:disabled)');
  } else {
    const rows = [...list.children].filter(r => r.classList.contains('required-plane'));
    const adjacent = rows[index] ?? rows[index - 1];
    target = adjacent?.querySelector(`[data-action="${action}"]:not(:disabled)`);
  }
  (target ?? activeHangarTab()).focus({ preventScroll: true });
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
  closeCardMenu();
  presetDialog.showModal();
});
$('openVehicles').addEventListener('click', () => {
  vehicleLevelInput.value = vehicleMaxLevel;
  vehicleAircoinsInput.setAttribute('aria-pressed', String(vehicleAircoinsOnly));
  vehicleFavoritesInput.setAttribute('aria-pressed', String(vehicleFavoritesOnly));
  renderVehicleDurations();
  renderVehicles();
  closeCardMenu();
  vehicleDialog.showModal();
});
$('closeVehicles').addEventListener('click', () => vehicleDialog.close());
vehicleGrid.addEventListener('pointerover', e => {
  const target = e.target.closest('[data-tip]');
  if (target) showVehicleTip(target);
});
vehicleGrid.addEventListener('pointerout', e => {
  const target = e.target.closest('[data-tip]');
  const next = e.relatedTarget?.closest?.('[data-tip]');
  if (target && next !== target) {
    if (next && vehicleGrid.contains(next)) showVehicleTip(next);
    else hideVehicleTip();
  }
});
vehicleGrid.addEventListener('click', e => {
  const button = e.target.closest('[data-favorite]');
  if (!button) return;
  const name = button.dataset.favorite;
  if (!vehicleFavorites.delete(name)) vehicleFavorites.add(name);
  saveVehicleFavorites();
  if (vehicleFavoritesOnly) {
    const scrollTop = vehicleGrid.scrollTop;
    hideVehicleTip();
    renderVehicleDurations();
    renderVehicles();
    vehicleGrid.scrollTop = scrollTop;
    return;
  }
  const tipVisible = !vehicleTip.hidden;
  syncFavoriteButton(button, vehicleFavorites.has(name));
  if (tipVisible) showVehicleTip(button);
});
vehicleGrid.addEventListener('scroll', hideVehicleTip, { passive: true });
vehicleDialog.addEventListener('close', hideVehicleTip);
$('openGoals').addEventListener('click', () => {
  goalSearchInput.value = '';
  goalQuery = '';
  renderGoalTabs();
  renderGoals();
  closeCardMenu();
  goalsDialog.showModal();
  scrollToCurrentGoal();
  (goalRow.querySelector('.is-current button') ?? $('openRequiredPlanes')).focus({ preventScroll: true });
});
$('closeGoals').addEventListener('click', () => goalsDialog.close());
closeOnBackdrop(goalsDialog);
goalTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-goals]');
  if (!tab) return;
  goalsTab = tab.dataset.goals;
  renderGoalTabs();
  renderGoals();
  if (normalizeSearch(goalQuery) === '') scrollToCurrentGoal();
  else goalRow.scrollLeft = 0;
});
goalRow.addEventListener('click', e => {
  const button = e.target.closest('[data-action]');
  if (!button) return;
  const { action, index } = button.dataset;
  const list = activeGoalList();
  if (action === 'complete') setGoalsDone(list.done + 1, Number(index));
  else if (action === 'back') setGoalsDone(list.done - 1, Number(index));
  else if (action === 'last') setGoalsDone(list.goals.length - 1, list.goals.length - 1);
  else if (action === 'set') setGoalsDone(Number(index), Number(index));
});
goalSearchInput.addEventListener('input', () => {
  goalQuery = goalSearchInput.value;
  renderGoals();
  if (normalizeSearch(goalQuery) === '') scrollToCurrentGoal();
  else goalRow.scrollLeft = 0;
});
goalSearchInput.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || goalSearchInput.value === '') return;
  e.preventDefault();
  e.stopPropagation();
  goalSearchInput.value = '';
  goalQuery = '';
  renderGoals();
  scrollToCurrentGoal();
});
goalsDialog.addEventListener('cancel', e => {
  if (goalSearchInput.value !== '' && document.activeElement === goalSearchInput) e.preventDefault();
});
goalRow.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  goalRow.scrollLeft += e.deltaY * wheelUnit(e);
}, { passive: false });
$('openRequiredPlanes').addEventListener('click', () => {
  renderRequiredPlanes();
  closeCardMenu();
  requiredPlanesDialog.showModal();
});
$('closeRequiredPlanes').addEventListener('click', () => requiredPlanesDialog.close());
$('openHangars').addEventListener('click', () => {
  renderHangarTabs();
  renderHangarPanel();
  closeCardMenu();
  hangarDialog.showModal();
  activeHangarTab().focus({ preventScroll: true });
});
$('closeHangars').addEventListener('click', () => hangarDialog.close());
closeOnBackdrop(hangarDialog);
hangarTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-hangar]');
  if (!tab) return;
  hangarTab = tab.dataset.hangar;
  renderHangarTabs();
  renderHangarPanel();
  hangarPlannedList.scrollTop = 0;
  hangarAvailableList.scrollTop = 0;
});
hangarPanel.addEventListener('click', e => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;
  if (button.dataset.action === 'expand') toggleHangarStats(button);
  else applyHangarAction(button);
});
vehicleTabs.addEventListener('click', e => {
  const tab = e.target.closest('[data-group]');
  if (!tab) return;
  const group = tab.dataset.group;
  if (group === 'all' || !vehicleGroupFilter.delete(group)) {
    if (group === 'all') vehicleGroupFilter.clear();
    else vehicleGroupFilter.add(group);
  }
  if (vehicleGroupFilter.size === Object.keys(VEHICLE_GROUP_LABELS).length) vehicleGroupFilter.clear();
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
vehicleLevelInput.addEventListener('input', () => {
  vehicleMaxLevel = parseVehicleLevel(vehicleLevelInput.value);
  saveVehicleLevel(vehicleMaxLevel);
  renderVehicleDurations();
  renderVehicles();
});
vehicleLevelInput.addEventListener('change', () => {
  vehicleLevelInput.value = vehicleMaxLevel;
});
vehicleFavoritesInput.addEventListener('click', () => {
  vehicleFavoritesOnly = !vehicleFavoritesOnly;
  vehicleFavoritesInput.setAttribute('aria-pressed', String(vehicleFavoritesOnly));
  saveVehicleFavoritesOnly(vehicleFavoritesOnly);
  renderVehicleDurations();
  renderVehicles();
});
vehicleAircoinsInput.addEventListener('click', () => {
  vehicleAircoinsOnly = !vehicleAircoinsOnly;
  vehicleAircoinsInput.setAttribute('aria-pressed', String(vehicleAircoinsOnly));
  saveVehicleAircoinsOnly(vehicleAircoinsOnly);
  renderVehicleDurations();
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
removeSelectedBtn.addEventListener('click', () => {
  removeInstances(selection);
  $('toggleRemove').focus();
});
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
    clearSelection();
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
centerViewBtn.addEventListener('click', fitView);
document.addEventListener('pointerdown', e => {
  if (!cardMenu.hidden && !cardMenu.contains(e.target)) closeCardMenu();
  if (menuOpen && !menuPanel.contains(e.target) && !menuToggle.contains(e.target)) setMenuOpen(false);
  if (!removeMenu.hidden && !removeMenu.parentElement.contains(e.target)) setRemoveMenuOpen(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !cardMenu.hidden) {
    closeCardMenu();
    return;
  }
  if (e.key === 'Escape' && invReorder) {
    cancelInvReorder();
    return;
  }
  if (e.key === 'Escape' && drag) {
    endDrag();
    return;
  }
  if (e.key === 'Escape' && fill) {
    endFill();
    return;
  }
  if (e.key === 'Escape' && marquee) {
    stopMarquee();
    return;
  }
  if (dialog.open || presetDialog.open || vehicleDialog.open || goalsDialog.open || requiredPlanesDialog.open || hangarDialog.open) return;
  if (e.key !== 'Escape') {
    handleSelectionKey(e);
    return;
  }
  const menuShown = menuOpen || !removeMenu.hidden;
  if (menuOpen) setMenuOpen(false);
  if (!removeMenu.hidden) {
    setRemoveMenuOpen(false);
    removeMenuToggle.focus();
  }
  if (!menuShown) clearSelection();
});

function handleSelectionKey(e) {
  if (isoMode || removeMode || drag || fill || e.target.closest?.('input, select, textarea')) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && selection.size > 0) {
    e.preventDefault();
    closeCardMenu();
    removeInstances(selection);
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    closeCardMenu();
    setSelection(state.instances.filter(isPlaced).map(i => i.id));
  }
}

board.addEventListener('wheel', e => {
  closeCardMenu();
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
  if (e.shiftKey && !isoMode && !removeMode) {
    marquee = { id: e.pointerId, x: e.clientX, y: e.clientY, last: { clientX: e.clientX, clientY: e.clientY }, cell: clampedCell(e), additive: e.ctrlKey || e.metaKey, active: false };
    board.setPointerCapture(e.pointerId);
    return;
  }
  pan = { id: e.pointerId, x: e.clientX, y: e.clientY, left: offset.x, top: offset.y, active: false };
  board.setPointerCapture(e.pointerId);
});

function clampedCell(e) {
  const cell = cellFromEvent(e);
  return {
    x: Math.min(state.grid.cols - 1, Math.max(0, cell.x)),
    y: Math.min(state.grid.rows - 1, Math.max(0, cell.y))
  };
}

function marqueeRect(point) {
  const cell = clampedCell(point);
  const x = Math.min(marquee.cell.x, cell.x);
  const y = Math.min(marquee.cell.y, cell.y);
  return { x, y, w: Math.max(marquee.cell.x, cell.x) - x + 1, h: Math.max(marquee.cell.y, cell.y) - y + 1 };
}

function updateMarqueeBox() {
  const r = marqueeRect(marquee.last);
  marqueeBox.style.left = `${r.x * cellSize}px`;
  marqueeBox.style.top = `${r.y * cellSize}px`;
  marqueeBox.style.width = `${r.w * cellSize}px`;
  marqueeBox.style.height = `${r.h * cellSize}px`;
  marqueeBox.hidden = false;
}

function stopMarquee() {
  if (marquee && board.hasPointerCapture(marquee.id)) board.releasePointerCapture(marquee.id);
  marquee = null;
  marqueeBox.hidden = true;
  board.classList.remove('is-marquee');
}

function finishMarquee(e) {
  if (!marquee || e.pointerId !== marquee.id) return;
  if (marquee.active) {
    const rect = marqueeRect(e);
    const hit = state.instances.filter(i => isPlaced(i) && overlaps(rectOf(i), rect)).map(i => i.id);
    setSelection(marquee.additive ? [...selection, ...hit] : hit);
  }
  stopMarquee();
}

board.addEventListener('pointermove', e => {
  if (marquee && e.pointerId === marquee.id) {
    if (!(e.buttons & 1)) {
      finishMarquee(e);
      return;
    }
    if (!marquee.active) {
      if (Math.hypot(e.clientX - marquee.x, e.clientY - marquee.y) < PAN_THRESHOLD) return;
      marquee.active = true;
      hideCardPopup();
      hideArea();
      board.classList.add('is-marquee');
    }
    marquee.last = { clientX: e.clientX, clientY: e.clientY };
    updateMarqueeBox();
    return;
  }
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
    closeCardMenu();
    hideCardPopup();
    board.classList.add('is-panning');
  }
  setOffset(pan.left + dx, pan.top + dy);
});

function endPan(e) {
  if (!pan || e.pointerId !== pan.id) return;
  pan = null;
  board.classList.remove('is-panning');
}

board.addEventListener('pointerup', e => {
  finishMarquee(e);
  if (pan && e.pointerId === pan.id && !pan.active) clearSelection();
  endPan(e);
});
board.addEventListener('pointercancel', e => {
  if (marquee && e.pointerId === marquee.id) stopMarquee();
  endPan(e);
});
board.addEventListener('lostpointercapture', e => {
  if (marquee && e.pointerId === marquee.id) stopMarquee();
  endPan(e);
});

window.addEventListener('pointermove', e => {
  if (fill && e.pointerId === fill.pointerId) {
    fill.x = e.clientX;
    fill.y = e.clientY;
    if (e.buttons & 1) {
      endFill();
      return;
    }
    if (!(e.buttons & 2)) {
      finishFill();
      return;
    }
    if (!fill.active) {
      if (Math.hypot(fill.x - fill.startX, fill.y - fill.startY) < PAN_THRESHOLD) return;
      activateFill();
      if (!fill) return;
    }
    updateFill();
    return;
  }
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
  if (e.button === 2 && (e.buttons & 2)) {
    suppressMenu = true;
    rotateDrag();
  } else {
    updateDrag();
  }
  startAutoScroll();
});

window.addEventListener('pointerup', e => {
  if (fill && e.pointerId === fill.pointerId && e.button === 2) {
    fill.x = e.clientX;
    fill.y = e.clientY;
    finishFill();
    return;
  }
  if (!drag || e.pointerId !== drag.pointerId || e.button !== 0) return;
  drag.x = e.clientX;
  drag.y = e.clientY;
  dropDrag();
});

window.addEventListener('pointercancel', () => {
  if (drag) endDrag();
  if (fill) endFill();
});

document.body.addEventListener('lostpointercapture', () => {
  if (drag?.active) endDrag();
  if (fill?.active) endFill();
});

window.addEventListener('blur', () => {
  closeCardMenu();
  if (invReorder) cancelInvReorder();
  if (marquee) stopMarquee();
  if (drag) endDrag();
  if (fill) endFill();
});

document.addEventListener('mousedown', e => {
  if (e.button === 1 && (drag || board.contains(e.target))) e.preventDefault();
});

document.addEventListener('contextmenu', e => {
  if (!drag?.active && !suppressMenu) return;
  e.preventDefault();
  e.stopPropagation();
  suppressMenu = false;
}, true);

window.addEventListener('resize', closeCardMenu);
window.addEventListener('resize', refreshLayout);

loadState();
setInventoryCollapsed(loadInvCollapsed());
render();
scrollBoardTopRight();
document.fonts?.ready.then(() => {
  layout();
  scrollBoardTopRight();
});
