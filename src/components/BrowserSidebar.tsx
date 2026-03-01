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
      animate={{ width: collapsed ? 52 : 260 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className="h-full flex flex-col sidebar-gradient border-r border-border overflow-hidden flex-shrink-0"
    >
      <div className={`flex items-center ${collapsed ? "justify-center py-3" : "justify-between px-3 pt-3 pb-1"}`}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
              Arc
            </span>
          </motion.div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl hover:bg-accent transition-colors"
        >
          {collapsed ? <PanelLeft size={14} className="text-muted-foreground" /> : <PanelLeftClose size={14} className="text-muted-foreground" />}
        </button>
      </div>

      {collapsed ? (
        <div className="flex-1 flex flex-col items-center overflow-hidden">
          <SpaceSwitcher spaces={spaces} activeSpaceId={activeSpaceId} onSwitch={onSpaceSwitch} collapsed />
          <div className="w-5 h-px bg-border my-1" />
          <div className="flex-1 overflow-y-auto scrollbar-none py-1 space-y-1">
            <TabList
              label="Pinned"
              tabs={pinnedTabs}
              activeTabId={activeTabId}
              pinned
              collapsed
              onSelect={onTabSelect}
              onClose={onTabClose}
              onTogglePin={onTabPin}
              onToggleSplit={onTabSplit}
            />
            <div className="flex justify-center py-1">
              <div className="w-3 h-px bg-border" />
            </div>
            <TabList
              label="Tabs"
              tabs={unpinnedTabs}
              activeTabId={activeTabId}
              collapsed
              onSelect={onTabSelect}
              onClose={onTabClose}
              onTogglePin={onTabPin}
              onToggleSplit={onTabSplit}
            />
          </div>
          <div className="py-2">
            <button
              onClick={onAddTab}
              className="w-8 h-8 flex items-center justify-center rounded-xl glass hover:bg-accent/60 transition-all text-muted-foreground"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      ) : (
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass hover:bg-accent/60 transition-all text-xs text-muted-foreground"
            >
              <Plus size={12} />
              <span className="tracking-wide">New Tab</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
