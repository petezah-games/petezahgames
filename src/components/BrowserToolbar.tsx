import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ArrowLeft, ArrowRight, RotateCw, Share, Bookmark, Bell, Download, Grid3X3, Bot, ShieldCheck } from "lucide-react";
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
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
        </button>
        <button className="p-1.5 rounded-xl text-foreground/15 cursor-not-allowed">
          <ArrowRight size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <RotateCw size={13} />
        </button>
      </div>

      <div
        className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 cursor-text ${
          isUrlFocused ? "glass-heavy ring-1 ring-foreground/15" : "glass hover:border-foreground/15"
        }`}
        onClick={() => {
          onUrlChange(activeTab?.url || "");
          onUrlFocus(true);
        }}
      >
        <AnimatePresence mode="wait">
          {isUrlFocused ? (
            <motion.div key="search" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Search size={13} className="text-foreground/50" />
            </motion.div>
          ) : (
            <motion.div key="shield" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Shield size={13} className="text-foreground/30" />
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
          <span className="text-[10px] font-mono text-muted-foreground">
            {activeTab.url.split(".").pop()?.split("/")[0]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="AI Mode">
          <Bot size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="VPN">
          <ShieldCheck size={14} />
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Download size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Bookmark size={14} />
        </button>
        <button onClick={onNotificationClick} className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell size={14} />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-foreground/60" />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Grid3X3 size={14} />
        </button>
        <button className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
          <Share size={14} />
        </button>
      </div>
    </div>
  );
}
