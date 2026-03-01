import { useState, useCallback } from "react";

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  pinned?: boolean;
  spaceId: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_SPACES: Space[] = [
  { id: "personal", name: "Personal", color: "var(--space-blue)" },
  { id: "work", name: "Work", color: "var(--space-green)" },
  { id: "creative", name: "Creative", color: "var(--space-purple)" },
];

const DEFAULT_TABS: Tab[] = [
  { id: "1", title: "Nothing OS — Design Language", url: "nothing.tech/os", pinned: true, spaceId: "personal" },
  { id: "2", title: "Apple Vision Pro — Spatial Computing", url: "apple.com/vision", pinned: true, spaceId: "personal" },
  { id: "3", title: "Arc Browser — Internet Computer", url: "arc.net", pinned: false, spaceId: "personal" },
  { id: "4", title: "Figma — Design Workspace", url: "figma.com", pinned: true, spaceId: "work" },
  { id: "5", title: "GitHub — Code Repository", url: "github.com", pinned: false, spaceId: "work" },
  { id: "6", title: "Linear — Project Tracker", url: "linear.app", pinned: false, spaceId: "work" },
  { id: "7", title: "Dribbble — Design Inspiration", url: "dribbble.com", pinned: true, spaceId: "creative" },
  { id: "8", title: "Behance — Creative Portfolio", url: "behance.net", pinned: false, spaceId: "creative" },
];

let tabCounter = 9;

export function useBrowserState() {
  const [spaces] = useState<Space[]>(DEFAULT_SPACES);
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState("1");
  const [activeSpaceId, setActiveSpaceId] = useState("personal");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const togglePin = useCallback((id: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  }, []);

  const toggleSplit = useCallback((id: string) => {
    setSplitTabId((prev) => (prev === id ? null : id));
  }, []);

  const navigateToUrl = useCallback((url: string) => {
    if (!url.trim()) return;
    const formatted = url.includes(".") ? url : `search.nothing.tech?q=${encodeURIComponent(url)}`;
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: formatted, title: formatted.split("/")[0] || formatted } : t
      )
    );
    setUrlInput("");
    setIsUrlFocused(false);
  }, [activeTabId]);

  return {
    spaces,
    tabs,
    activeTabId,
    activeSpaceId,
    activeTab,
    pinnedTabs,
    unpinnedTabs,
    sidebarCollapsed,
    splitTabId,
    urlInput,
    isUrlFocused,
    setActiveTabId,
    setActiveSpaceId,
    setSidebarCollapsed,
    setUrlInput,
    setIsUrlFocused,
    addTab,
    closeTab,
    togglePin,
    toggleSplit,
    navigateToUrl,
  };
}
