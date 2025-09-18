const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { TriangleStripDrawMode } = require("three");

let win;

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    resizable: false,
    transparent: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"), // preload script
      contextIsolation: true, // good security practice
    },
  });

  // Prevent fullscreen
  win.setFullScreenable(false);
  win.setFullScreen(false);
  win.on("enter-full-screen", () => win.setFullScreen(false));

  // Load your dev server (Vite/React/Vue)
  win.loadURL("http://localhost:5173");

  // Resize handler
  ipcMain.on("resize-window", (event, { w, h }) => {
    if (win) win.setContentSize(Math.ceil(w), Math.ceil(h));
  });

  // Debugging
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
