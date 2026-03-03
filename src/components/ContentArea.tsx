import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, Bot, Music, Film, Gamepad2, AppWindow, ShieldCheck } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
  onNavigateToPage?: (page: string) => void;
}

const CATEGORIES = [
  { id: "ai", icon: Bot, label: "AI Mode", desc: "Chat & create" },
  { id: "music", icon: Music, label: "Music", desc: "Stream" },
  { id: "movies", icon: Film, label: "Movies", desc: "Watch" },
  { id: "games", icon: Gamepad2, label: "Games", desc: "Play" },
  { id: "apps", icon: AppWindow, label: "Apps", desc: "Tools" },
  { id: "vpn", icon: ShieldCheck, label: "VPN", desc: "Private" },
];

function FluidCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 120 + Math.random() * 180,
      hue: 200 + i * 12,
      saturation: 50 + Math.random() * 30,
      lightness: 35 + Math.random() * 20,
      opacity: 0.06 + Math.random() * 0.06,
    }));

    let time = 0;
    const animate = () => {
      time += 0.003;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b) => {
        b.x += b.vx + Math.sin(time + b.hue) * 0.15;
        b.y += b.vy + Math.cos(time * 0.7 + b.hue) * 0.15;

        if (enabled) {
          const dx = mouseRef.current.x - b.x;
          const dy = mouseRef.current.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            b.x += dx * 0.003;
            b.y += dy * 0.003;
          }
        }

        if (b.x < -b.radius) b.x = w + b.radius;
        if (b.x > w + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = h + b.radius;
        if (b.y > h + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, ${b.opacity * 1.5})`);
        grad.addColorStop(0.5, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, ${b.opacity * 0.5})`);
        grad.addColorStop(1, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Subtle white wisps
      for (let i = 0; i < 3; i++) {
        const wx = w * (0.2 + i * 0.3) + Math.sin(time * 0.5 + i) * 60;
        const wy = h * (0.3 + i * 0.2) + Math.cos(time * 0.4 + i * 2) * 40;
        const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, 100);
        wg.addColorStop(0, "hsla(210, 60%, 90%, 0.04)");
        wg.addColorStop(1, "hsla(210, 60%, 90%, 0)");
        ctx.fillStyle = wg;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: enabled ? "auto" : "none" }}
    />
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl glass-heavy px-5 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-foreground/20">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-accent border border-border text-[10px] font-mono text-muted-foreground">
          Ctrl+K
        </kbd>
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, label, desc, onClick }: { icon: typeof Bot; label: string; desc: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="category-card group flex flex-col items-center gap-1.5 text-center py-2.5 px-2"
    >
      <div className="w-8 h-8 rounded-xl bg-accent border border-border flex items-center justify-center">
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-foreground">{label}</p>
        <p className="text-[9px] text-muted-foreground">{desc}</p>
      </div>
      <ArrowUpRight size={9} className="absolute top-2 right-2 text-transparent group-hover:text-foreground/30 transition-all" />
    </motion.button>
  );
}

function FeaturePage({ page, onBack }: { page: string; onBack: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === page);
  const Icon = cat?.icon || Bot;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <FluidCanvas enabled={false} />
      <div className="p-6 relative z-10">
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowUpRight size={10} className="rotate-[225deg]" /> Back to Home
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-6 px-6 relative z-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent border border-border flex items-center justify-center">
          <Icon size={28} className="text-foreground/70" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">{cat?.label}</h1>
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
  const [fluidCursor, setFluidCursor] = useState(true);

  if (activePage) {
    return <FeaturePage page={activePage} onBack={() => setActivePage(null)} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      <FluidCanvas enabled={fluidCursor} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center gap-5 max-w-2xl w-full px-6 text-center"
      >
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">PeteZah</h1>
          <p className="text-[11px] text-muted-foreground">Your all-in-one hub</p>
        </div>

        <SearchBar />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 w-full max-w-md">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              desc={cat.desc}
              onClick={() => setActivePage(cat.id)}
            />
          ))}
        </div>

        <button
          onClick={() => setFluidCursor(!fluidCursor)}
          className="mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle border border-border"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${fluidCursor ? "bg-primary" : "bg-muted-foreground/30"}`} />
          Fluid cursor {fluidCursor ? "on" : "off"}
        </button>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      <FluidCanvas enabled={false} />
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
          <div className="w-16 h-16 rounded-full bg-foreground/5 border border-border" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-foreground/30" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 className="text-base font-medium text-foreground">Nothing to see</h2>
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
