import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Zap, Layout, Clock, Search, ArrowUpRight, Layers, Bot, Music, Film, Gamepad2, AppWindow, ShieldCheck } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
  onNavigateToPage?: (page: string) => void;
}

const CATEGORIES = [
  { id: "ai", icon: Bot, label: "AI Mode", desc: "Chat, generate, create", gradient: "from-[hsl(270,50%,45%)] to-[hsl(330,60%,50%)]" },
  { id: "music", icon: Music, label: "Music", desc: "Stream & discover", gradient: "from-[hsl(330,60%,50%)] to-[hsl(35,70%,45%)]" },
  { id: "movies", icon: Film, label: "Movies", desc: "Watch & explore", gradient: "from-[hsl(180,50%,35%)] to-[hsl(220,60%,50%)]" },
  { id: "games", icon: Gamepad2, label: "Games", desc: "Play instantly", gradient: "from-[hsl(35,70%,45%)] to-[hsl(15,80%,50%)]" },
  { id: "apps", icon: AppWindow, label: "Apps", desc: "Web tools & utilities", gradient: "from-[hsl(160,50%,40%)] to-[hsl(180,50%,35%)]" },
  { id: "vpn", icon: ShieldCheck, label: "VPN", desc: "Private browsing", gradient: "from-[hsl(220,60%,50%)] to-[hsl(270,50%,45%)]" },
];

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-full glass-heavy px-6 py-3.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-foreground/20 focus-within:border-foreground/20">
        <Search size={16} className="text-foreground/40 flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/10 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, label, desc, gradient, onClick }: { icon: typeof Globe; label: string; desc: string; gradient: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="category-card group flex flex-col items-start gap-3 text-left"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon size={18} className="text-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <ArrowUpRight size={12} className="absolute top-3 right-3 text-foreground/0 group-hover:text-foreground/40 transition-all" />
    </motion.button>
  );
}

function FeaturePage({ page, onBack }: { page: string; onBack: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === page);
  const Icon = cat?.icon || Globe;

  return (
    <div className="flex-1 flex flex-col nebula-bg star-field relative overflow-hidden">
      <div className="p-6">
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Home
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-6 px-6"
      >
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cat?.gradient} flex items-center justify-center shadow-2xl`}>
          <Icon size={36} className="text-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-gradient">{cat?.label}</h1>
        <p className="text-muted-foreground text-sm max-w-md text-center">{cat?.desc} — connect your backend to bring this to life.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg w-full mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex flex-col gap-2">
              <div className="w-full h-16 rounded-xl bg-foreground/5 animate-pulse" />
              <div className="w-3/4 h-2 rounded bg-foreground/10" />
              <div className="w-1/2 h-2 rounded bg-foreground/5" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function TabContent({ tab, onNavigateToPage }: { tab: Tab; onNavigateToPage?: (page: string) => void }) {
  const [activePage, setActivePage] = useState<string | null>(null);

  if (activePage) {
    return <FeaturePage page={activePage} onBack={() => setActivePage(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center nebula-bg star-field relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center gap-8 max-w-2xl w-full px-6 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center"
          >
            <span className="text-lg font-bold text-foreground/80">◉</span>
          </motion.div>
          <h1 className="text-xl font-semibold text-gradient tracking-tight">New Tab</h1>
        </div>

        <SearchBar />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-xl">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              desc={cat.desc}
              gradient={cat.gradient}
              onClick={() => setActivePage(cat.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {[
            { icon: Clock, label: "Recent" },
            { icon: Layers, label: "Spaces" },
            { icon: Zap, label: "Boost" },
            { icon: Layout, label: "Split" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center nebula-bg star-field">
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
          <div className="w-20 h-20 rounded-full bg-foreground/5 animate-glow-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-foreground/40" />
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

export default function ContentArea({ activeTab, splitTab, onNavigateToPage }: ContentAreaProps) {
  return (
    <div className="flex-1 flex overflow-hidden rounded-tl-2xl border-t border-l border-border">
      {activeTab ? (
        <>
          <TabContent tab={activeTab} onNavigateToPage={onNavigateToPage} />
          {splitTab && (
            <>
              <div className="w-px bg-border" />
              <TabContent tab={splitTab} onNavigateToPage={onNavigateToPage} />
            </>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
