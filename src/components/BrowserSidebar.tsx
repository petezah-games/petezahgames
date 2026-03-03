import { motion } from "framer-motion";
import { Plus, PanelLeftClose, PanelLeft, User, History, Bookmark, Download, Command, Bot, Music, Film, Gamepad2, AppWindow, ShieldCheck } from "lucide-react";
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
  onAccountClick: () => void;
}

const SIDEBAR_FEATURES = [
  { icon: Bot, label: "AI" },
  { icon: Music, label: "Music" },
  { icon: Film, label: "Movies" },
  { icon: Gamepad2, label: "Games" },
  { icon: AppWindow, label: "Apps" },
  { icon: ShieldCheck, label: "VPN" },
];

export default function Sidebar({
  spaces, activeSpaceId, pinnedTabs, unpinnedTabs, activeTabId, collapsed,
  onSpaceSwitch, onTabSelect, onTabClose, onTabPin, onTabSplit, onAddTab, onToggleCollapse, onAccountClick,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 260 }}
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
            <span className="text-sm font-semibold text-foreground tracking-tight">
              PeteZah
            </span>
          </motion.div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {collapsed ? (
        <div className="flex-1 flex flex-col items-center overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-none py-1 space-y-1">
            <TabList label="Pinned" tabs={pinnedTabs} activeTabId={activeTabId} pinned collapsed onSelect={onTabSelect} onClose={onTabClose} onTogglePin={onTabPin} onToggleSplit={onTabSplit} />
            <div className="flex justify-center py-1"><div className="w-3 h-px bg-border" /></div>
            <TabList label="Tabs" tabs={unpinnedTabs} activeTabId={activeTabId} collapsed onSelect={onTabSelect} onClose={onTabClose} onTogglePin={onTabPin} onToggleSplit={onTabSplit} />
          </div>
          <div className="flex flex-col items-center gap-0.5 py-2 border-t border-border">
            {SIDEBAR_FEATURES.map(({ icon: Icon, label }) => (
              <button key={label} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground" title={label}>
                <Icon size={12} />
              </button>
            ))}
            <div className="w-4 h-px bg-border my-0.5" />
            <button onClick={onAddTab} className="w-8 h-8 flex items-center justify-center rounded-lg glass hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
              <Plus size={13} />
            </button>
            <button onClick={onAccountClick} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
              <User size={13} />
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pb-2">
            <TabList label="Pinned" tabs={pinnedTabs} activeTabId={activeTabId} pinned onSelect={onTabSelect} onClose={onTabClose} onTogglePin={onTabPin} onToggleSplit={onTabSplit} />
            <div className="mx-4 h-px bg-border" />
            <TabList label="Tabs" tabs={unpinnedTabs} activeTabId={activeTabId} onSelect={onTabSelect} onClose={onTabClose} onTogglePin={onTabPin} onToggleSplit={onTabSplit} />
          </div>
          <div className="px-2 py-1.5 border-t border-border">
            <div className="grid grid-cols-3 gap-1 mb-2">
              {SIDEBAR_FEATURES.map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
                  <Icon size={12} />
                  <span className="text-[9px]">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 mb-1.5">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
                <Bookmark size={11} />
                <span className="text-[10px]">Saved</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
                <History size={11} />
                <span className="text-[10px]">History</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
                <Download size={11} />
                <span className="text-[10px]">Downloads</span>
              </button>
            </div>
            <button onClick={onAddTab} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass hover:bg-accent transition-all text-xs text-foreground/60 hover:text-foreground">
              <Plus size={12} />
              <span className="tracking-wide">New Tab</span>
            </button>
            <div className="flex items-center gap-2 px-2 pt-1.5">
              <button onClick={onAccountClick} className="flex items-center gap-2 flex-1 py-2 rounded-lg hover:bg-accent transition-all group">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                  <User size={10} className="text-foreground/70" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-foreground/80">Guest</span>
                  <span className="text-[9px] text-muted-foreground">Sign in</span>
                </div>
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-all text-foreground/50 hover:text-foreground">
                <Command size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
