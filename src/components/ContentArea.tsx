import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Zap, Layout, Clock, Search, Sparkles, ArrowUpRight, Star, Layers } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
}

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl liquid-glass px-5 py-3.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-primary/10">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web, apps, or anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/5 border border-border">
          <Sparkles size={10} className="text-primary/60" />
          <span className="text-[10px] font-mono text-muted-foreground">AI</span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label, url }: { icon: typeof Globe; label: string; url: string }) {
  return (
    <button className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-accent/40 transition-all">
      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center group-hover:border-primary/10 transition-all">
        <Icon size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    </button>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-gradient star-field relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-xl w-full px-6 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center glow-white"
        >
          <Globe size={26} className="text-primary/70" />
        </motion.div>

        <div>
          <h1 className="text-2xl font-semibold text-gradient mb-2 tracking-tight">{tab.title}</h1>
          <p className="text-xs font-mono text-muted-foreground tracking-wider">{tab.url}</p>
        </div>

        <SearchBar />

        <div className="flex items-center gap-1 mt-2">
          {[
            { icon: Star, label: "Favorites" },
            { icon: Clock, label: "Recent" },
            { icon: Layers, label: "Spaces" },
            { icon: Globe, label: "Discover" },
            { icon: Zap, label: "Boost" },
            { icon: Layout, label: "Split" },
          ].map(({ icon, label }) => (
            <QuickLink key={label} icon={icon} label={label} url="" />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 w-full max-w-md mt-2">
          {[
            { icon: "G", label: "Google", color: "from-primary/10 to-primary/3" },
            { icon: "Y", label: "YouTube", color: "from-destructive/10 to-destructive/3" },
            { icon: "X", label: "Twitter", color: "from-primary/8 to-primary/2" },
            { icon: "R", label: "Reddit", color: "from-space-orange/10 to-space-orange/3" },
          ].map(({ icon, label, color }) => (
            <button
              key={label}
              className="group glass rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-accent/40 transition-all"
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center border border-border`}>
                <span className="text-xs font-semibold text-foreground/70">{icon}</span>
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-gradient star-field">
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
          <div className="w-20 h-20 rounded-full bg-primary/5 animate-glow-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary/40" />
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
    <div className="flex-1 flex overflow-hidden rounded-tl-2xl border-t border-l border-border">
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
