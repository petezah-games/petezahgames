import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, Bot, Music, Film, Gamepad2, AppWindow, ShieldCheck, Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
  onNavigateToPage?: (page: string) => void;
}

interface Preset {
  id: string;
  label: string;
  url: string;
  icon: string;
  builtIn?: boolean;
}

const DEFAULT_PRESETS: Preset[] = [
  { id: "games", label: "Games", url: "petezah.app/games", icon: "gamepad", builtIn: true },
  { id: "ai", label: "AI", url: "petezah.app/ai", icon: "bot", builtIn: true },
  { id: "music", label: "Music", url: "petezah.app/music", icon: "music", builtIn: true },
  { id: "movies", label: "Movies", url: "petezah.app/movies", icon: "film", builtIn: true },
  { id: "apps", label: "Apps", url: "petezah.app/apps", icon: "appwindow", builtIn: true },
  { id: "vpn", label: "VPN", url: "petezah.app/vpn", icon: "shield", builtIn: true },
];

const ICON_MAP: Record<string, typeof Bot> = {
  bot: Bot,
  music: Music,
  film: Film,
  gamepad: Gamepad2,
  appwindow: AppWindow,
  shield: ShieldCheck,
};

function getStoredPresets(): Preset[] {
  try {
    const stored = localStorage.getItem("petezah-presets");
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_PRESETS;
}

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

    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 140 + Math.random() * 200,
      hue: 200 + i * 10,
      saturation: 60 + Math.random() * 25,
      lightness: 40 + Math.random() * 15,
      opacity: 0.15 + Math.random() * 0.12,
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
        grad.addColorStop(0, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, ${b.opacity * 2.2})`);
        grad.addColorStop(0.4, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, ${b.opacity * 1.1})`);
        grad.addColorStop(1, `hsla(${b.hue}, ${b.saturation}%, ${b.lightness}%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      for (let i = 0; i < 3; i++) {
        const wx = w * (0.2 + i * 0.3) + Math.sin(time * 0.5 + i) * 60;
        const wy = h * (0.3 + i * 0.2) + Math.cos(time * 0.4 + i * 2) * 40;
        const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, 120);
        wg.addColorStop(0, "hsla(210, 70%, 90%, 0.07)");
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 rounded-2xl glass-heavy px-5 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-foreground/20">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          spellCheck={false}
        />
        <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-accent border border-border text-[10px] font-mono text-muted-foreground">
          {isMac ? "⌘" : "Ctrl"}+K
        </kbd>
      </div>
    </div>
  );
}

function PresetEditModal({ preset, onSave, onDelete, onClose }: {
  preset: Preset | null;
  onSave: (p: Preset) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(preset?.label || "");
  const [url, setUrl] = useState(preset?.url || "");
  const [iconData, setIconData] = useState(preset?.icon || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIconData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!label.trim()) return;
    onSave({
      id: preset?.id || String(Date.now()),
      label: label.trim(),
      url: url.trim() || "about:blank",
      icon: iconData || "bot",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 5 }}
        className="relative z-10 w-full max-w-xs bg-card border border-border rounded-2xl p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">{preset ? "Edit Preset" : "Add Preset"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent text-muted-foreground"><X size={14} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Title</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-accent border border-border text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl bg-accent border border-border text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Icon</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="w-full mt-1 px-3 py-2 rounded-xl bg-accent border border-border text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
              <Upload size={12} />
              <span>{iconData?.startsWith("data:") ? "Image selected" : "Upload image"}</span>
            </button>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
            {onDelete && (
              <button onClick={onDelete} className="px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PresetCard({ preset, onClick, onEdit }: { preset: Preset; onClick: () => void; onEdit: () => void }) {
  const IconComp = ICON_MAP[preset.icon];
  const isCustomImage = preset.icon?.startsWith("data:");

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="category-card group relative flex flex-col items-center gap-1.5 text-center py-2 px-2 cursor-pointer"
      onClick={onClick}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-accent/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-accent"
      >
        <Pencil size={9} className="text-foreground/60" />
      </button>
      <div className="w-8 h-8 rounded-xl bg-accent/60 border border-border flex items-center justify-center overflow-hidden">
        {isCustomImage ? (
          <img src={preset.icon} alt={preset.label} className="w-5 h-5 object-cover rounded" />
        ) : IconComp ? (
          <IconComp size={14} className="text-foreground/40" />
        ) : (
          <span className="text-[10px] text-foreground/40">{preset.label[0]}</span>
        )}
      </div>
      <p className="text-[11px] font-medium text-foreground/80">{preset.label}</p>
    </motion.div>
  );
}

function FeaturePage({ page, onBack }: { page: string; onBack: () => void }) {
  const preset = DEFAULT_PRESETS.find((c) => c.id === page);
  const IconComp = ICON_MAP[preset?.icon || "bot"] || Bot;

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
          <IconComp size={28} className="text-foreground/50" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">{preset?.label}</h1>
        <p className="text-muted-foreground text-sm max-w-md text-center">Connect your backend to bring this to life.</p>
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
  const [presets, setPresets] = useState<Preset[]>(getStoredPresets);
  const [editingPreset, setEditingPreset] = useState<Preset | null | "new">(null);

  const savePresets = useCallback((updated: Preset[]) => {
    setPresets(updated);
    localStorage.setItem("petezah-presets", JSON.stringify(updated));
  }, []);

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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">PeteZah</h1>
          <p className="text-[11px] text-muted-foreground">Your all-in-one hub</p>
        </div>

        <SearchBar />

        <div className="flex items-center justify-center gap-1.5 w-full max-w-2xl overflow-x-auto overflow-y-visible py-2">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onClick={() => setActivePage(preset.id)}
              onEdit={() => setEditingPreset(preset)}
            />
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditingPreset("new")}
            className="category-card flex flex-col items-center gap-1.5 text-center py-2 px-2"
          >
            <div className="w-8 h-8 rounded-xl bg-accent/40 border border-dashed border-border flex items-center justify-center">
              <Plus size={14} className="text-foreground/30" />
            </div>
            <p className="text-[11px] text-muted-foreground">Add</p>
          </motion.button>
        </div>

        <button
          onClick={() => setFluidCursor(!fluidCursor)}
          className="mt-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle border border-border"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${fluidCursor ? "bg-primary" : "bg-muted-foreground/30"}`} />
          Fluid cursor {fluidCursor ? "on" : "off"}
        </button>
      </motion.div>

      <AnimatePresence>
        {editingPreset && (
          <PresetEditModal
            preset={editingPreset === "new" ? null : editingPreset}
            onSave={(p) => {
              if (editingPreset === "new") {
                savePresets([...presets, p]);
              } else {
                savePresets(presets.map((x) => (x.id === p.id ? p : x)));
              }
              setEditingPreset(null);
            }}
            onDelete={editingPreset !== "new" ? () => {
              savePresets(presets.filter((x) => x.id !== (editingPreset as Preset).id));
              setEditingPreset(null);
            } : undefined}
            onClose={() => setEditingPreset(null)}
          />
        )}
      </AnimatePresence>
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
    <div className="flex-1 flex overflow-hidden">
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