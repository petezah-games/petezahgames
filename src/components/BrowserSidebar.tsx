import { motion } from "framer-motion";
import { Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import SpaceSwitcher from "@/components/SpaceSwitcher";
import { TabList } from "@/components/TabItem";
import { Tab, Space } from "@/hooks/useBrowserState";

interface SidebarProps {
  spaces: Space[];
  activeSpaceId: string;
  pinnedTabs: Tab[];
  unpinnedTabs: Tab[];
  activeTabId: string;
  collapsed: boolean;
  onSpaceSwitch: (id: string) => void;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabPin: (id: string) => void;
  onTabSplit: (id: string) => void;
  onAddTab: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  spaces, activeSpaceId, pinnedTabs, unpinnedTabs, activeTabId, collapsed,
  onSpaceSwitch, onTabSelect, onTabClose, onTabPin, onTabSplit, onAddTab, onToggleCollapse,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 48 : 260 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className="h-full flex flex-col bg-sidebar border-r border-border overflow-hidden flex-shrink-0"
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-glyph-pulse" />
            <span className="text-xs font-mono-dot uppercase tracking-[0.3em] text-muted-foreground">
              Arc
            </span>
          </motion.div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          {collapsed ? <PanelLeft size={14} className="text-muted-foreground" /> : <PanelLeftClose size={14} className="text-muted-foreground" />}
        </button>
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <SpaceSwitcher spaces={spaces} activeSpaceId={activeSpaceId} onSwitch={onSpaceSwitch} />

          <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pb-2">
            <TabList
              label="Pinned"
              tabs={pinnedTabs}
              activeTabId={activeTabId}
              pinned
              onSelect={onTabSelect}
              onClose={onTabClose}
              onTogglePin={onTabPin}
              onToggleSplit={onTabSplit}
            />
            <div className="mx-4 h-px bg-border" />
            <TabList
              label="Tabs"
              tabs={unpinnedTabs}
              activeTabId={activeTabId}
              onSelect={onTabSelect}
              onClose={onTabClose}
              onTogglePin={onTabPin}
              onToggleSplit={onTabSplit}
            />
          </div>

          <div className="p-2">
            <button
              onClick={onAddTab}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg glass hover:bg-accent/60 transition-all text-xs text-muted-foreground"
            >
              <Plus size={12} />
              <span className="font-mono-dot uppercase tracking-widest">New Tab</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
