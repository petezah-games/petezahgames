import { useState, useCallback } from "react";

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  pinned?: boolean;
  spaceId: string;
  icon?: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_SPACES: Space[] = [
  { id: "main", name: "Home", color: "var(--space-blue)" },
];

const DEFAULT_TABS: Tab[] = [
  { id: "1", title: "PeteZah Home", url: "petezah.app", pinned: false, spaceId: "main" },
];

let tabCounter = 2;

function getFavicon(url: string): string {
  try {
    const clean = url.startsWith("http") ? url : `https://${url}`;
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(clean)}&size=32`;
  } catch {
    return "";
  }
}

export function useBrowserState() {
  const [spaces] = useState<Space[]>(DEFAULT_SPACES);
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState("1");
  const [activeSpaceId, setActiveSpaceId] = useState("main");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [splitTabId, setSplitTabId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isUrlFocused, setIsUrlFocused] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const spaceTabs = tabs.filter((t) => t.spaceId === activeSpaceId);
  const pinnedTabs = spaceTabs.filter((t) => t.pinned);
  const unpinnedTabs = spaceTabs.filter((t) => !t.pinned);

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: String(tabCounter++),
      title: "New Tab",
      url: "about:blank",
      spaceId: activeSpaceId,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [activeSpaceId]);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (id === activeTabId && next.length > 0) {
        setActiveTabId(next[next.length - 1].id);
      }
      return next;
    });
    if (splitTabId === id) setSplitTabId(null);
  }, [activeTabId, splitTabId]);

  const closeAllTabs = useCallback(() => {
    const newTab: Tab = {
      id: String(tabCounter++),
      title: "New Tab",
      url: "about:blank",
      spaceId: activeSpaceId,
    };
    setTabs([newTab]);
    setActiveTabId(newTab.id);
    setSplitTabId(null);
  }, [activeSpaceId]);

  const togglePin = useCallback((id: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  }, []);

  const toggleSplit = useCallback((id: string) => {
    setSplitTabId((prev) => (prev === id ? null : id));
  }, []);

  const navigateToUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    const formatted = url.includes(".") ? url : `search.petezah.app?q=${encodeURIComponent(url)}`;
    const favicon = getFavicon(formatted);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: formatted, title: formatted.split("/")[0] || formatted, favicon } : t
      )
    );
    setUrlInput("");
    setIsUrlFocused(false);
  }, [activeTabId]);

  return {
    spaces, tabs, activeTabId, activeSpaceId, activeTab, pinnedTabs, unpinnedTabs,
    sidebarCollapsed, splitTabId, urlInput, isUrlFocused,
    setActiveTabId, setActiveSpaceId, setSidebarCollapsed, setUrlInput, setIsUrlFocused,
    addTab, closeTab, closeAllTabs, togglePin, toggleSplit, navigateToUrl,
  };
}
