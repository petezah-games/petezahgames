import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, ArrowLeft, ArrowRight, RotateCw, Share, Bookmark } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ToolbarProps {
  activeTab: Tab | undefined;
  urlInput: string;
  isUrlFocused: boolean;
  onUrlChange: (val: string) => void;
  onUrlFocus: (focused: boolean) => void;
  onNavigate: (url: string) => void;
}

export default function Toolbar({ activeTab, urlInput, isUrlFocused, onUrlChange, onUrlFocus, onNavigate }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (isUrlFocused && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isUrlFocused]);

  const displayUrl = isUrlFocused ? urlInput : (activeTab?.url || "");

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-0.5">
        <button className={`p-1.5 rounded-lg transition-colors ${canGoBack ? "hover:bg-accent text-muted-foreground" : "text-muted/40 cursor-not-allowed"}`}>
          <ArrowLeft size={14} />
        </button>
        <button className={`p-1.5 rounded-lg transition-colors ${canGoForward ? "hover:bg-accent text-muted-foreground" : "text-muted/40 cursor-not-allowed"}`}>
          <ArrowRight size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
          <RotateCw size={13} />
        </button>
      </div>

      <div
        className={`flex-1 flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-200 ${
          isUrlFocused ? "glass-heavy ring-1 ring-primary/30" : "glass hover:bg-accent/40"
        }`}
        onClick={() => {
          onUrlChange(activeTab?.url || "");
          onUrlFocus(true);
        }}
      >
        <AnimatePresence mode="wait">
          {isUrlFocused ? (
            <motion.div key="search" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Search size={13} className="text-primary" />
            </motion.div>
          ) : (
            <motion.div key="shield" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
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
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono-dot"
          spellCheck={false}
        />
        {!isUrlFocused && activeTab && (
          <span className="text-[10px] font-mono-dot text-muted-foreground uppercase tracking-wider">
            {activeTab.url.split(".").pop()?.split("/")[0]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
          <Bookmark size={14} />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
          <Share size={14} />
        </button>
      </div>
    </div>
  );
}
