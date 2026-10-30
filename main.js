const { app, BrowserWindow, Menu, net, protocol, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const PRESETS = require('./src/presets.js');
const VEHICLES = require('./src/vehicles.js');
const EVENTS = require('./src/events.js');

const ICON_URLS = new Map([
  ...PRESETS.filter(p => p.url).map(p => [p.icon, p.url]),
  ...EVENTS.flatMap(e => e.items).filter(i => i.url).map(i => [i.icon, i.url]),
  ...VEHICLES.filter(v => v.imageUrl).map(v => [v.icon, v.imageUrl])
]);
const ICON_NAME = /^[a-z0-9-]+\.png$/;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_ICON_BYTES = 1024 * 1024;
const ICON_TIMEOUT = 15000;
const DEV = process.argv.includes('--dev');
const DEV_RELOAD_DELAY = 100;
const pendingIcons = new Map();
const failedIcons = new Set();

protocol.registerSchemesAsPrivileged([{ scheme: 'skyicon', privileges: { standard: true, secure: true } }]);

function iconResponse(buffer) {
  return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
}

async function downloadIcon(name, file) {
  const res = await net.fetch(ICON_URLS.get(name), { signal: AbortSignal.timeout(ICON_TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_ICON_BYTES || !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) throw new Error('Invalid icon');
  const tmp = `${file}.tmp`;
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(tmp, buffer);
  await fs.promises.rename(tmp, file);
  return buffer;
}

async function handleIcon(request) {
  const name = path.posix.basename(new URL(request.url).pathname);
  if (!ICON_NAME.test(name) || !ICON_URLS.has(name) || failedIcons.has(name)) return new Response(null, { status: 404 });
  const file = path.join(app.getPath('userData'), 'icons', name);
  try {
    return iconResponse(await fs.promises.readFile(file));
  } catch {
    try {
      if (!pendingIcons.has(name)) pendingIcons.set(name, downloadIcon(name, file).finally(() => pendingIcons.delete(name)));
      return iconResponse(await pendingIcons.get(name));
    } catch {
      failedIcons.add(name);
      return new Response(null, { status: 404 });
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Skyrama Base Planner',
    icon: path.join(__dirname, 'src', 'icon.png'),
    backgroundColor: '#ffffff',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  if (DEV) watchForReload(win);
}

function watchForReload(win) {
  let timer = null;
  const watcher = fs.watch(path.join(__dirname, 'src'), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => win.webContents.reloadIgnoringCache(), DEV_RELOAD_DELAY);
  });
  win.on('closed', () => {
    clearTimeout(timer);
    watcher.close();
  });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F12') win.webContents.toggleDevTools();
    else if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) win.webContents.reloadIgnoringCache();
    else return;
    e.preventDefault();
  });
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  protocol.handle('skyicon', handleIcon);
  createWindow();
});

app.on('window-all-closed', () => app.quit());
