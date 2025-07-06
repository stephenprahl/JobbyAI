// Type definitions for Chrome extension development
interface Chrome {
  runtime: {
    id: string;
    getURL(path: string): string;
    getManifest(): chrome.runtime.Manifest;
    onInstalled: chrome.runtime.ExtensionInstalledEvent;
    onMessage: chrome.runtime.ExtensionMessageEvent;
    onUpdateAvailable: chrome.runtime.ExtensionUpdateAvailableEvent;
    sendMessage<T = any>(message: any, responseCallback?: (response: T) => void): void;
  };
  tabs: {
    create(createProperties: chrome.tabs.CreateProperties): Promise<chrome.tabs.Tab>;
    query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]>;
    sendMessage(tabId: number, message: any, options?: any): Promise<any>;
  };
  storage: {
    local: {
      get(keys: string | string[] | object): Promise<Record<string, any>>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    };
    sync: chrome.storage.StorageArea;
    managed: chrome.storage.StorageArea;
  };
}

declare const chrome: Chrome;

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

// This export is needed for TypeScript to treat this as a module
export {};
