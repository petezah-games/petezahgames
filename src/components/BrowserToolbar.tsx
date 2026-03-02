import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ArrowLeft, ArrowRight, RotateCw, Share, Bookmark, Bell, Download, Settings, Grid3X3 } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ToolbarProps {
  activeTab: Tab | undefined;
  urlInput: string;
  isUrlFocused: boolean;
  onUrlChange: (val: string) => void;
  onUrlFocus: (focused: boolean) => void;
  onNavigate: (url: string) => void;
  onNotificationClick: () => void;
}

export default function Toolbar({ activeTab, urlInput, isUrlFocused, onUrlChange, onUrlFocus, onNavigate, onNotificationClick }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUrlFocused && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isUrlFocused]);

  const displayUrl = isUrlFocused ? urlInput : (activeTab?.url || "");

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <ArrowLeft size={14} />
        </button>
        <button className="p-1.5 rounded-xl text-muted/30 cursor-not-allowed transition-colors">
          <ArrowRight size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <RotateCw size={13} />
        </button>
      </div>

      <div
        className={`flex-1 flex items-center gap-2.5 rounded-2xl px-4 py-2 transition-all duration-200 cursor-text ${
          isUrlFocused ? "liquid-glass ring-1 ring-primary/10" : "glass hover:bg-accent/30"
        }`}
        onClick={() => {
          onUrlChange(activeTab?.url || "");
          onUrlFocus(true);
        }}
      >
        <AnimatePresence mode="wait">
          {isUrlFocused ? (
            <motion.div key="search" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Search size={13} className="text-foreground/60" />
            </motion.div>
          ) : (
            <motion.div key="shield" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Shield size={13} className="text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={inputRef}
          value={displayUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          onFocus={() => {
            onUrlChange(activeTab?.url || "");
            onUrlFocus(true);
          }}
          onBlur={() => onUrlFocus(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onNavigate(urlInput);
            if (e.key === "Escape") onUrlFocus(false);
          }}
          placeholder="Search or enter URL"
          className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        {!isUrlFocused && activeTab && (
          <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
            {activeTab.url.split(".").pop()?.split("/")[0]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <Download size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <Bookmark size={14} />
        </button>
        <button onClick={onNotificationClick} className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors relative">
          <Bell size={14} />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary/60" />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <Grid3X3 size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
          <Share size={14} />
        </button>
      </div>
    </div>
  );
}
