import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Zap, Layout, Clock, Search, Sparkles } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
}

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl glass-heavy px-5 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-primary/20">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web, apps, or anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/50">
          <Sparkles size={10} className="text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">AI</span>
        </div>
      </div>
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-gradient dot-pattern relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full px-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl glass-heavy flex items-center justify-center glow-primary"
        >
          <Globe size={26} className="text-primary" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-semibold text-gradient mb-2 tracking-tight">{tab.title}</h1>
          <p className="text-xs font-mono text-muted-foreground tracking-wider">{tab.url}</p>
        </div>

        <SearchBar />

        <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-2">
          {[
            { icon: Zap, label: "Boost", desc: "Speed up" },
            { icon: Layout, label: "Split", desc: "Multi-view" },
            { icon: Clock, label: "Later", desc: "Save for later" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-accent/40 transition-all group"
            >
              <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-[10px] text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-gradient dot-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 animate-glow-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gradient">Nothing to see</h2>
          <p className="text-xs text-muted-foreground mt-1">Open a tab to begin</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContentArea({ activeTab, splitTab }: ContentAreaProps) {
  return (
    <div className="flex-1 flex overflow-hidden rounded-tl-2xl border-t border-l border-border/50">
      {activeTab ? (
        <>
          <TabContent tab={activeTab} />
          {splitTab && (
            <>
              <div className="w-px bg-border" />
              <TabContent tab={splitTab} />
            </>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
