import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, ChevronDown, ChevronUp, Heart, Trash2, Send, Loader2, Plus } from "lucide-react";

interface Entry { id: string; title: string; content: string; username?: string; created_at: number; }

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ChangelogPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/changelog")
      .then(r => r.json())
      .then(d => setEntries(d.entries || []))
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          // is_admin: 1 = mod/admin set by first user logic, 2 = staff, 3 = admin
          // any value >= 1 can post changelog
          setIsAdmin((d.user.is_admin ?? 0) >= 1);
        }
      });
  }, []);

  async function post() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const r = await fetch("/api/changelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      if (r.ok) {
        const d = await r.json();
        setEntries(prev => [{ id: d.id, title: newTitle, content: newContent, created_at: Date.now() }, ...prev]);
        setNewTitle(""); setNewContent(""); setShowForm(false);
      }
    } finally { setPosting(false); }
  }

  async function del(id: string) {
    await fetch(`/api/changelog/${id}`, { method: "DELETE" });
    setEntries(p => p.filter(e => e.id !== id));
  }

  async function like(id: string) {
    const key = id;
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "changelog", targetId: id }),
    });
    setLiked(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "hsl(220 30% 7%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid hsl(220 18% 11%)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(215 85% 50%), hsl(250 75% 55%))" }}>
          <Megaphone size={14} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold" style={{ color: "hsl(220 15% 92%)" }}>Changelog</h1>
          <p className="text-[10px]" style={{ color: "hsl(220 15% 36%)" }}>Updates &amp; releases</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: showForm ? "hsl(215 85% 52% / 0.15)" : "hsl(220 22% 12%)",
              color: "hsl(215 85% 65%)",
              border: "1px solid hsl(215 85% 52% / 0.2)",
            }}>
            <Plus size={11} />
            New Update
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(220 18% 14%) transparent" }}>
        {/* Post form */}
        <AnimatePresence>
          {isAdmin && showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="p-4 rounded-2xl mb-1 space-y-3"
                style={{ background: "hsl(215 85% 52% / 0.05)", border: "1px solid hsl(215 85% 52% / 0.15)" }}>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Update title..."
                  className="w-full text-sm py-2.5 px-3 rounded-xl outline-none"
                  style={{ background: "hsl(220 25% 9%)", border: "1px solid hsl(220 18% 15%)", color: "hsl(220 15% 90%)", fontFamily: "inherit" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "hsl(215 85% 52% / 0.45)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 18% 15%)")} />
                <textarea value={newContent} onChange={e => setNewContent(e.target.value)}
                  placeholder="Describe what's new in this update..." rows={4}
                  className="w-full text-sm py-2.5 px-3 rounded-xl outline-none resize-none"
                  style={{ background: "hsl(220 25% 9%)", border: "1px solid hsl(220 18% 15%)", color: "hsl(220 15% 90%)", fontFamily: "inherit" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "hsl(215 85% 52% / 0.45)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 18% 15%)")} />
                <div className="flex items-center gap-2">
                  <button onClick={post} disabled={posting || !newTitle.trim() || !newContent.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: "linear-gradient(135deg, hsl(215 85% 50%), hsl(250 75% 55%))", color: "#fff", opacity: posting || !newTitle.trim() || !newContent.trim() ? 0.5 : 1 }}>
                    {posting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                    Publish
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-xs transition-all"
                    style={{ color: "hsl(220 15% 42%)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={22} className="animate-spin" style={{ color: "hsl(215 85% 52%)" }} />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: "hsl(220 15% 28%)" }}>
            <Megaphone size={32} className="mb-3 opacity-25" />
            <p className="text-sm">No updates yet</p>
          </div>
        ) : entries.map((entry, i) => (
          <motion.div key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.035 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 13%)" }}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: "hsl(215 85% 60%)" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "hsl(220 15% 88%)" }}>{entry.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "hsl(220 15% 36%)" }}>
                  {entry.username || "Team"} · {timeAgo(entry.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); like(entry.id); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all"
                  style={{
                    color: liked.has(entry.id) ? "hsl(0 65% 62%)" : "hsl(220 15% 36%)",
                    background: liked.has(entry.id) ? "hsl(0 65% 50% / 0.1)" : "transparent",
                  }}>
                  <Heart size={10} fill={liked.has(entry.id) ? "currentColor" : "none"} />
                </button>
                {isAdmin && (
                  <button onClick={e => { e.stopPropagation(); del(entry.id); }}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: "hsl(220 15% 26%)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "hsl(0 65% 52%)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "hsl(220 15% 26%)")}>
                    <Trash2 size={11} />
                  </button>
                )}
                {expanded === entry.id
                  ? <ChevronUp size={12} style={{ color: "hsl(220 15% 32%)" }} />
                  : <ChevronDown size={12} style={{ color: "hsl(220 15% 32%)" }} />}
              </div>
            </button>
            <AnimatePresence>
              {expanded === entry.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="px-4 pb-4 pt-3 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: "hsl(220 15% 58%)", borderTop: "1px solid hsl(220 18% 12%)" }}>
                    {entry.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}