import * as exports from "./index.js";
import { contextBridge, ipcRenderer } from "electron";

// Type guard
const isExport = (key: string): key is keyof typeof exports =>
  Object.hasOwn(exports, key);

// Auto expose all exports from index.js (with base64 keys)
for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(btoa(exportsKey), exports[exportsKey]);
  }
}

// ✅ Manually add your resize API as well
contextBridge.exposeInMainWorld("electronAPI", {
  resize: (w: number, h: number) => {
    ipcRenderer.send("resize-window", { w, h });
  },
});

// Re-export for tests
export * from "./index.js";

// Let TS know about the API
export type ElectronAPI = {
  resize: (w: number, h: number) => void;
};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
