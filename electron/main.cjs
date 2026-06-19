// Electron main process for the Shalion Mockup desktop app.
//
// The mockup is a TanStack Start (SSR + Nitro) app. For the desktop build we
// emit Nitro's standalone "node-server" preset (NITRO_PRESET=node-server vite
// build → .output/server/index.mjs) and run it here as a child process using
// Electron's bundled Node (ELECTRON_RUN_AS_NODE), then load it in a window.
// This keeps the desktop app byte-for-byte the same as the deployed web app —
// SSR, routing and server functions all behave identically. App data lives in
// localStorage, scoped to the loopback origin and persisted in Electron's user
// data dir, so it survives across launches.
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

const isDev = !app.isPackaged;
const HOST = "127.0.0.1";

let serverProc = null;
let mainWindow = null;
let baseUrl = process.env.DEV_URL || "http://localhost:8080"; // dev default

/** Path to the bundled Nitro server entry. In a packaged app the .output tree
 *  ships as an unpacked extraResource; in dev it's the repo's build output. */
function serverEntry() {
  return app.isPackaged
    ? path.join(process.resourcesPath, ".output", "server", "index.mjs")
    : path.join(__dirname, "..", ".output", "server", "index.mjs");
}

function serverCwd() {
  return app.isPackaged ? process.resourcesPath : path.join(__dirname, "..");
}

/** Ask the OS for a free loopback port so two instances never collide. */
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, HOST, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

function startServer(port) {
  serverProc = spawn(process.execPath, [serverEntry()], {
    cwd: serverCwd(),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOST,
      PORT: String(port),
      NITRO_HOST: HOST,
      NITRO_PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  serverProc.stdout.on("data", (d) => console.log(`[server] ${String(d).trim()}`));
  serverProc.stderr.on("data", (d) => console.error(`[server] ${String(d).trim()}`));
  serverProc.on("exit", (code) => console.log(`[server] exited with code ${code}`));
}

/** Poll the server until it answers (or time out). */
function waitForServer(url, timeoutMs = 30000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const ping = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - started > timeoutMs) reject(new Error("server did not start in time"));
        else setTimeout(ping, 300);
      });
    };
    ping();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    title: "Shalion Mockup",
    backgroundColor: "#ffffff",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Keep in-app navigation inside the window; send anything off-origin to the
  // user's real browser instead of opening Electron windows for it.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(baseUrl)) return { action: "allow" };
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  await mainWindow.loadURL(baseUrl);
}

app.whenReady().then(async () => {
  // A minimal app menu (keeps the standard shortcuts: copy/paste, reload, devtools, quit).
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === "darwin" ? [{ role: "appMenu" }] : []),
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ]));

  if (!isDev) {
    const port = await freePort();
    baseUrl = `http://${HOST}:${port}`;
    startServer(port);
    try {
      await waitForServer(baseUrl);
    } catch (err) {
      console.error(err);
    }
  }

  await createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function stopServer() {
  if (serverProc && !serverProc.killed) {
    try {
      serverProc.kill();
    } catch {
      /* ignore */
    }
  }
  serverProc = null;
}

app.on("before-quit", stopServer);
app.on("quit", stopServer);
process.on("exit", stopServer);
