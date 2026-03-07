import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Trash2, Send, Loader2, Lock } from "lucide-react";

interface Entry { id: string; content: string; username?: string; email?: string; user_id: string; created_at: number; }

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function FeedbackPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState("");
  const [posting, setPosting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setAuthed(true);
          setUserId(d.user.id);
          setIsAdmin((d.user.is_admin ?? 0) >= 1);
          return fetch("/api/feedback").then(r => r.json()).then(fd => setEntries(fd.entries || []));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function post() {
    if (!newFeedback.trim()) return;
    setPosting(true);
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newFeedback }),
      });
      if (r.ok) {
        const d = await r.json();
        setEntries(p => [{ id: d.id, content: newFeedback, user_id: userId || "", created_at: Date.now() }, ...p]);
        setNewFeedback("");
      }
    } finally { setPosting(false); }
  }

  async function del(id: string) {
    await fetch(`/api/feedback/${id}`, { method: "DELETE" });
    setEntries(p => p.filter(e => e.id !== id));
  }

  async function like(id: string) {
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "feedback", targetId: id }),
    });
    setLiked(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "hsl(220 30% 7%)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid hsl(220 18% 11%)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(215 85% 50%), hsl(250 75% 55%))" }}>
          <MessageSquare size={14} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold" style={{ color: "hsl(220 15% 92%)" }}>Feedback</h1>
          <p className="text-[10px]" style={{ color: "hsl(220 15% 36%)" }}>
            {isAdmin ? "All submissions" : "Your submissions"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(220 18% 14%) transparent" }}>
        {!authed ? (
          /* Not signed in */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(220 22% 12%)", border: "1px solid hsl(220 18% 16%)" }}>
              <Lock size={18} style={{ color: "hsl(220 15% 32%)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1" style={{ color: "hsl(220 15% 55%)" }}>Sign in to leave feedback</p>
              <p className="text-xs" style={{ color: "hsl(220 15% 32%)" }}>Your account lets you track and manage your submissions</p>
            </div>
            <button onClick={() => onNavigate("petezah://account")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, hsl(215 85% 50%), hsl(250 75% 55%))", color: "#fff" }}>
              Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Submit form */}
            <div className="p-4 rounded-2xl space-y-3"
              style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 13%)" }}>
              <p className="text-xs" style={{ color: "hsl(220 15% 40%)" }}>
                Share a bug report, feature idea, or anything on your mind
              </p>
              <textarea
                value={newFeedback}
                onChange={e => setNewFeedback(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                maxLength={2000}
                className="w-full text-sm py-2.5 px-3 rounded-xl outline-none resize-none"
                style={{ background: "hsl(220 25% 8%)", border: "1px solid hsl(220 18% 14%)", color: "hsl(220 15% 88%)", fontFamily: "inherit" }}
                onFocus={e => (e.currentTarget.style.borderColor = "hsl(215 85% 52% / 0.45)")}
                onBlur={e => (e.currentTarget.style.borderColor = "hsl(220 18% 14%)")} />
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "hsl(220 15% 26%)" }}>{newFeedback.length}/2000</span>
                <button onClick={post} disabled={posting || !newFeedback.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg, hsl(215 85% 50%), hsl(250 75% 55%))",
                    color: "#fff",
                    opacity: posting || !newFeedback.trim() ? 0.45 : 1,
                  }}>
                  {posting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  Submit
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={20} className="animate-spin" style={{ color: "hsl(215 85% 52%)" }} />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12" style={{ color: "hsl(220 15% 28%)" }}>
                <MessageSquare size={28} className="mb-2 opacity-25" />
                <p className="text-sm">No feedback yet</p>
              </div>
            ) : entries.map((entry, i) => (
              <motion.div key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 rounded-2xl"
                style={{ background: "hsl(220 22% 10%)", border: "1px solid hsl(220 18% 13%)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {isAdmin && (entry.username || entry.email) && (
                      <p className="text-[10px] font-semibold mb-1.5" style={{ color: "hsl(215 85% 55%)" }}>
                        {entry.username || entry.email}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "hsl(220 15% 70%)" }}>
                      {entry.content}
                    </p>
                    <p className="text-[10px] mt-2" style={{ color: "hsl(220 15% 28%)" }}>{timeAgo(entry.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                    <button onClick={() => like(entry.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all"
                      style={{
                        color: liked.has(entry.id) ? "hsl(0 65% 62%)" : "hsl(220 15% 34%)",
                        background: liked.has(entry.id) ? "hsl(0 65% 50% / 0.1)" : "transparent",
                      }}>
                      <Heart size={10} fill={liked.has(entry.id) ? "currentColor" : "none"} />
                    </button>
                    {(isAdmin || entry.user_id === userId) && (
                      <button onClick={() => del(entry.id)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: "hsl(220 15% 26%)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "hsl(0 65% 52%)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "hsl(220 15% 26%)")}>
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}