import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

const STORAGE_KEY = "petezah-discord-popup-last";

export default function DiscordPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    if (!last || now - Number(last) > 3600000) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 5 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative z-10 w-full max-w-sm bg-card border border-border rounded-2xl p-7 text-center shadow-2xl"
          >
            <button
              onClick={dismiss}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[hsl(235,86%,65%)] flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={22} className="text-white" />
            </div>

            <h2 className="text-base font-semibold text-foreground mb-1.5">
              Join our Discord
            </h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Connect with the PeteZah community. Get updates, share feedback, and hang out.
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="https://discord.gg/petezah"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="w-full py-2.5 rounded-xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-medium text-sm transition-colors"
              >
                Open Discord
              </a>
              <button
                onClick={dismiss}
                className="w-full py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
