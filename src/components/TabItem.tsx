import { motion, AnimatePresence } from "framer-motion";
import { X, Pin, SplitSquareHorizontal } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  isPinned?: boolean;
  onClick: () => void;
  onClose: () => void;
  onTogglePin: () => void;
  onToggleSplit: () => void;
}

export default function TabItem({ tab, isActive, isPinned, onClick, onClose, onTogglePin, onToggleSplit }: TabItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8, height: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-lg cursor-pointer transition-all duration-150 ${
        isPinned ? "px-2 py-1.5" : "px-3 py-2"
      } ${isActive ? "glass" : "hover:bg-accent/50"}`}
    >
      {isActive && (
        <motion.div
          layoutId="tab-active-glow"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary"
        />
      )}
      <div className="w-4 h-4 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
        <span className="text-[8px] font-mono-dot text-muted-foreground uppercase">
          {tab.url.slice(0, 2)}
        </span>
      </div>
      <span className={`flex-1 truncate text-sm ${isActive ? "text-foreground" : "text-secondary-foreground"}`}>
        {isPinned ? "" : tab.title}
      </span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSplit(); }}
          className="p-0.5 rounded hover:bg-accent transition-colors"
        >
          <SplitSquareHorizontal size={10} className="text-muted-foreground" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
          className="p-0.5 rounded hover:bg-accent transition-colors"
        >
          <Pin size={10} className={tab.pinned ? "text-primary" : "text-muted-foreground"} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="p-0.5 rounded hover:bg-destructive/20 transition-colors"
        >
          <X size={10} className="text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}

interface TabListProps {
  label: string;
  tabs: Tab[];
  activeTabId: string;
  pinned?: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleSplit: (id: string) => void;
}

export function TabList({ label, tabs, activeTabId, pinned, onSelect, onClose, onTogglePin, onToggleSplit }: TabListProps) {
  if (tabs.length === 0) return null;
  return (
    <div className="px-2">
      <div className="px-2 py-1.5">
        <span className="text-[10px] font-mono-dot uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className={pinned ? "flex flex-wrap gap-1" : "flex flex-col gap-0.5"}>
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              isPinned={pinned}
              onClick={() => onSelect(tab.id)}
              onClose={() => onClose(tab.id)}
              onTogglePin={() => onTogglePin(tab.id)}
              onToggleSplit={() => onToggleSplit(tab.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
