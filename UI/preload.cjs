const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  resize: (w, h) => ipcRenderer.send("resize-window", { w, h }),
});
