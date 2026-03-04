import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lock, ArrowLeft, ArrowRight, RotateCw, Share, Bookmark, Bell, Gamepad2, Bot, User, FileText, MessageSquare, MoreVertical, X, Music, Film, AppWindow, ShieldCheck } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ToolbarProps {
  activeTab: Tab | undefined;
  urlInput: string;
  isUrlFocused: boolean;
  onUrlChange: (val: string) => void;
  onUrlFocus: (focused: boolean) => void;
  onNavigate: (url: string) => void;
  onNotificationClick: () => void;
  onCloseTab?: () => void;
  onCloseAllTabs?: () => void;
}

const MENU_PAGES = [
  { icon: Gamepad2, label: "Games" },
  { icon: Bot, label: "AI Mode" },
  { icon: Music, label: "Music" },
  { icon: Film, label: "Movies" },
  { icon: AppWindow, label: "Apps" },
];

export default function Toolbar({ activeTab, urlInput, isUrlFocused, onUrlChange, onUrlFocus, onNavigate, onNotificationClick, onCloseTab, onCloseAllTabs }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUrlFocused && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isUrlFocused]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const displayUrl = isUrlFocused ? urlInput : (activeTab?.url || "");

  return (
    <div className="flex items-center gap-2 px-4 h-11 glass-subtle border-b border-border">
      {/* Nav buttons */}
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={13} />
        </button>
        <button className="p-1.5 rounded-lg text-foreground/20 cursor-not-allowed">
          <ArrowRight size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/60 hover:text-foreground transition-colors">
          <RotateCw size={12} />
        </button>
      </div>

      {/* URL bar */}
      <div
        className={`flex-1 flex items-center gap-2 rounded-xl px-3 py-1.5 mx-2 transition-all duration-200 cursor-text ${
          isUrlFocused ? "glass-heavy ring-1 ring-foreground/15" : "bg-accent/40 hover:bg-accent/60 border border-border"
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
          className="flex-1 bg-transparent text-[12px] text-foreground/90 placeholder:text-muted-foreground outline-none"
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
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="Games">
          <Gamepad2 size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="AI Mode">
          <Bot size={13} />
        </button>
        <div className="w-px h-3.5 bg-border mx-0.5" />
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="Account">
          <User size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="Changelog">
          <FileText size={13} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors" title="Feedback">
          <MessageSquare size={13} />
        </button>

        {/* 3-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-accent text-foreground/50 hover:text-foreground transition-colors"
            title="More"
          >
            <MoreVertical size={13} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-1.5 w-52 bg-card border border-border rounded-xl shadow-2xl py-1.5 z-50"
              >
                <button onClick={() => { onCloseTab?.(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                  <X size={12} className="text-foreground/40" /> Close Tab
                </button>
                <button onClick={() => { onCloseAllTabs?.(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                  <X size={12} className="text-foreground/40" /> Close All Tabs
                </button>
                <div className="h-px bg-border my-1 mx-3" />
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                  <Bookmark size={12} className="text-foreground/40" /> Bookmarks
                </button>
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                  <Share size={12} className="text-foreground/40" /> Share
                </button>
                <div className="h-px bg-border my-1 mx-3" />
                {MENU_PAGES.map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground transition-colors">
                    <Icon size={12} className="text-foreground/40" /> {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
