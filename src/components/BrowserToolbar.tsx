import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, ArrowLeft, ArrowRight, RotateCw, Share, Bookmark, Bell, Download, Grid3X3, Bot, ShieldCheck } from "lucide-react";
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
    <div className="flex items-center gap-2 px-3 h-11 glass-subtle border-b border-border">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 mr-1">
        <div className="w-3 h-3 rounded-full bg-[hsl(0,70%,60%)] hover:bg-[hsl(0,70%,55%)] transition-colors" />
        <div className="w-3 h-3 rounded-full bg-[hsl(40,80%,55%)] hover:bg-[hsl(40,80%,50%)] transition-colors" />
        <div className="w-3 h-3 rounded-full bg-[hsl(120,50%,50%)] hover:bg-[hsl(120,50%,45%)] transition-colors" />
      </div>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Nav buttons */}
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={13} />
        </button>
        <button className="p-1.5 rounded-lg text-foreground/15 cursor-not-allowed">
          <ArrowRight size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors">
          <RotateCw size={12} />
        </button>
      </div>

      {/* URL bar */}
      <div
        className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5 mx-1 transition-all duration-200 cursor-text ${
          isUrlFocused ? "glass-heavy ring-1 ring-primary/20" : "bg-accent/50 hover:bg-accent/70 border border-border"
        }`}
        onClick={() => {
          onUrlChange(activeTab?.url || "");
          onUrlFocus(true);
        }}
      >
        <AnimatePresence mode="wait">
          {isUrlFocused ? (
            <motion.div key="search" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Search size={12} className="text-muted-foreground" />
            </motion.div>
          ) : (
            <motion.div key="lock" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <Lock size={11} className="text-foreground/40" />
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
          className="flex-1 bg-transparent text-[12px] text-foreground/80 placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        {!isUrlFocused && activeTab && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {activeTab.url.split(".").pop()?.split("/")[0]}
          </span>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="AI Mode">
          <Bot size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="VPN">
          <ShieldCheck size={13} />
        </button>
        <div className="w-px h-3.5 bg-border mx-0.5" />
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors">
          <Download size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors">
          <Bookmark size={13} />
        </button>
        <button onClick={onNotificationClick} className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors relative">
          <Bell size={13} />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors">
          <Grid3X3 size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors">
          <Share size={13} />
        </button>
      </div>
    </div>
  );
}
