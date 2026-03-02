import { motion } from "framer-motion";
import { Wifi, Battery, Shield, Download } from "lucide-react";

interface StatusBarProps {
  tabCount: number;
  spaceCount: number;
}

export default function StatusBar({ tabCount, spaceCount }: StatusBarProps) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between px-4 py-1.5 border-t border-border"
    >
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono tracking-wider text-muted-foreground">
          {tabCount} tabs · {spaceCount} spaces
        </span>
        <div className="w-px h-2.5 bg-border" />
        <div className="flex items-center gap-1.5">
          <Download size={9} className="text-muted-foreground" />
          <span className="text-[9px] font-mono text-muted-foreground">0</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Shield size={9} className="text-primary/60" />
          <span className="text-[9px] font-mono tracking-wider text-muted-foreground">
            Secure
          </span>
        </div>
        <div className="w-px h-2.5 bg-border" />
        <div className="flex items-center gap-2">
          <Wifi size={9} className="text-muted-foreground" />
          <Battery size={10} className="text-muted-foreground" />
          <span className="text-[9px] font-mono tracking-wider text-muted-foreground">
            {time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
