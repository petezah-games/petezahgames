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
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative z-10 w-full max-w-sm liquid-glass rounded-3xl p-8 text-center"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-[hsl(235,86%,65%)] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[hsl(235,86%,65%,0.3)]"
            >
              <MessageCircle size={28} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg font-semibold text-foreground mb-2"
            >
              Join our Discord
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground mb-6 leading-relaxed"
            >
              Connect with the PeteZah community. Get updates, share feedback, and hang out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col gap-2"
            >
              <a
                href="https://discord.gg/petezah"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="w-full py-3 rounded-2xl bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-[hsl(235,86%,65%,0.25)]"
              >
                Open Discord
              </a>
              <button
                onClick={dismiss}
                className="w-full py-2.5 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
