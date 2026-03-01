import { motion } from "framer-motion";
import { Space } from "@/hooks/useBrowserState";

interface SpaceSwitcherProps {
  spaces: Space[];
  activeSpaceId: string;
  onSwitch: (id: string) => void;
}

export default function SpaceSwitcher({ spaces, activeSpaceId, onSwitch }: SpaceSwitcherProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-3">
      {spaces.map((space) => {
        const isActive = space.id === activeSpaceId;
        return (
          <button
            key={space.id}
            onClick={() => onSwitch(space.id)}
            className="relative flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{ color: isActive ? `hsl(${space.color})` : undefined }}
          >
            {isActive && (
              <motion.div
                layoutId="space-indicator"
                className="absolute inset-0 rounded-lg glass"
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10 font-mono-dot uppercase tracking-widest">
              {space.name}
            </span>
            {isActive && (
              <motion.div
                layoutId="space-dot"
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: `hsl(${space.color})` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
