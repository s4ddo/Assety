import * as exports from "./index.js";
import { contextBridge, ipcRenderer } from "electron";
import fs from "fs";
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
  saveFile: (defaultFileName: string) => ipcRenderer.invoke('save-file', defaultFileName),

  writeFile: (filePath: string, content: string | ArrayBuffer | Uint8Array) => {
    let buffer: Buffer;

    if (typeof content === 'string') {
      buffer = Buffer.from(content, 'utf-8'); // text file
    } else if (content instanceof ArrayBuffer) {
      buffer = Buffer.from(new Uint8Array(content));
    } else if (content instanceof Uint8Array) {
      buffer = Buffer.from(content);
    } else {
      throw new Error('Unsupported content type');
    }

    fs.writeFileSync(filePath, buffer);
  },
});


// Re-export for tests
export * from "./index.js";

// Let TS know about the API
export type ElectronAPI = {
  resize: (w: number, h: number) => void;
  saveFile: (defaultFileName: string) => Promise<string | null>;
  writeFile: (filePath: string, content: string | ArrayBuffer | Uint8Array) => void;
};

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
