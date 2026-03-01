import { motion } from "framer-motion";
import { Globe, Zap, Layout, Clock } from "lucide-react";
import { Tab } from "@/hooks/useBrowserState";

interface ContentAreaProps {
  activeTab: Tab | undefined;
  splitTab: Tab | undefined;
}

function TabContent({ tab }: { tab: Tab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center dot-pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl glass-heavy flex items-center justify-center">
          <Globe size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gradient mb-2">{tab.title}</h2>
          <p className="text-sm font-mono-dot text-muted-foreground">{tab.url}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {[
            { icon: Zap, label: "Boost", desc: "Performance" },
            { icon: Layout, label: "Split", desc: "View" },
            { icon: Clock, label: "Later", desc: "Read list" },
          ].map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="glass rounded-xl p-3 flex flex-col items-center gap-1.5 hover:bg-accent/60 transition-all group"
            >
              <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-[10px] font-mono-dot text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center dot-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full nothing-glyph animate-glyph-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gradient">Nothing to see</h2>
          <p className="text-xs font-mono-dot text-muted-foreground mt-1">Open a tab to begin</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContentArea({ activeTab, splitTab }: ContentAreaProps) {
  return (
    <div className="flex-1 flex">
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
