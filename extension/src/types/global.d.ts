// Type definitions for Chrome extension development
declare namespace chrome {
  namespace runtime {
    interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
      origin?: string;
    }

    interface InstalledDetails {
      id?: string;
      previousVersion?: string;
      reason: 'install' | 'update' | 'chrome_update' | 'shared_module_update';
    }

    interface UpdateAvailableDetails {
      version: string;
    }

    interface ExtensionMessageEvent {
      (message: any, sender: MessageSender, sendResponse: (response?: any) => void): void | boolean;
      addListener(callback: (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void | boolean): void;
      removeListener(callback: (message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void | boolean): void;
    }

    interface ExtensionEvent<T extends Function> {
      addListener(callback: T): void;
      removeListener(callback: T): void;
      hasListener(callback: T): boolean;
    }

    const onMessage: ExtensionMessageEvent;
    const onInstalled: ExtensionEvent<(details: InstalledDetails) => void>;
    const onUpdateAvailable: ExtensionEvent<(details: UpdateAvailableDetails) => void>;

    function getURL(path: string): string;
    function reload(): void;
    function openOptionsPage(): Promise<void>;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      index: number;
      windowId: number;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      incognito: boolean;
    }

    interface CreateProperties {
      active?: boolean;
      index?: number;
      pinned?: boolean;
      selected?: boolean;
      url?: string;
      windowId?: number;
    }

    function create(createProperties: CreateProperties): Promise<Tab>;
    function sendMessage(tabId: number, message: any, options?: any): Promise<any>;
    function query(queryInfo: any): Promise<Tab[]>;
  }

  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | object): Promise<Record<string, any>>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    const local: StorageArea;
    const sync: StorageArea;
    const managed: StorageArea;
  }
}

// Global extension variables
declare const chrome: typeof globalThis.chrome;

// Add type definitions for the browser extension API
declare const browser: typeof chrome;

// Add type definitions for the webextension-polyfill
interface Window {
  browser: typeof chrome;
}

// Make TypeScript aware of the global chrome object
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export {};
