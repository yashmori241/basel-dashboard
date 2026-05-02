import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uoddvpafzcnhbjeazqzd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZGR2cGFmemNuaGJqZWF6cXpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYwODkyNCwiZXhwIjoyMDkzMTg0OTI0fQ.ZVv3xBB5yKCmJkaOohn4MhfKz7KUgnoozqbrg0cxi8M"
);

const CHANNELS = { voice: "📞", whatsapp: "💬", web_chat: "🌐" };

export default function App() {
  const [leads, setLeads] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");
  const [stats, setStats] = useState({ total: 0, qualified: 0, appointments: 0, avgScore: 0 });

  useEffect(() => {
    fetchAll();
    const sub = supabase.channel("realtime-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  async function fetchAll() {
    const [l, c, a] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("conversations").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("appointments").select("*").order("scheduled_at", { ascending: true }),
    ]);
    setLeads(l.data || []);
    setConversations(c.data || []);
    setAppointments(a.data || []);
    const ld = l.data || [];
    setStats({
      total: ld.length,
      qualified: ld.filter(x => x.status === "qualified").length,
      appointments: ld.filter(x => x.status === "appointment_set").length,
      avgScore: ld.length ? Math.round(ld.reduce((s, x) => s + (x.intent_score || 0), 0) / ld.length) : 0,
    });
  }

  async function takeover(leadId) {
    await supabase.from("conversations").insert({
      lead_id: leadId, channel: "web_chat", direction: "outbound",
      role: "system", content: "Human agent took over this conversation.",
      human_takeover: true
    });
    await supabase.from("leads").update({ status: "nurturing" }).eq("id", leadId);
    fetchAll();
    alert("✅ You have taken over this conversation.");
  }

  const leadConvos = selectedLead
    ? conversations.filter(c => c.lead_id === selectedLead.id)
    : [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#0f172a", color: "white", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>⚡ Basel Realty — AI Command Center</h1>
          <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>Live dashboard · Cristina Giral</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: "#22c55e", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>● Sofia Active</span>
          <span style={{ background: "#3b82f6", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>● Cal.com Connected</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "24px 32px 0" }}>
        {[
          { label: "Total Leads", value: stats.total, icon: "👥", color: "#3b82f6" },
          { label: "Qualified", value: stats.qualified, icon: "✅", color: "#22c55e" },
          { label: "Tours Booked", value: stats.appointments, icon: "📅", color: "#8b5cf6" },
          { label: "Avg Intent Score", value: `${stats.avgScore}/100`, icon: "🎯", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "24px 32px 0", display: "flex", gap: 8 }}>
        {["leads", "conversations", "appointments"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
            background: activeTab === t ? "#0f172a" : "white",
            color: activeTab === t ? "white" : "#64748b",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 32px 32px", display: "grid", gridTemplateColumns: selectedLead ? "1fr 1fr" : "1fr", gap: 16 }}>

        {activeTab === "leads" && (
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>All Leads</div>
            {leads.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No leads yet. Sofia will populate this when buyers start calling.</div>
            ) : leads.map(lead => (
              <div key={lead.id} onClick={() => setSelectedLead(lead)} style={{
                padding: "16px 20px", borderBottom: "1px solid #f8fafc", cursor: "pointer",
                background: selectedLead?.id === lead.id ? "#f0f9ff" : "white",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{lead.name || "Unknown"} {CHANNELS[lead.channel]}</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>{lead.phone || lead.email || "No contact"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(lead.created_at).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: lead.intent_score > 70 ? "#22c55e" : lead.intent_score > 40 ? "#f59e0b" : "#ef4444" }}>
                    {lead.intent_score || 0}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Intent</div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: lead.status === "qualified" ? "#dcfce7" : "#f1f5f9", color: lead.status === "qualified" ? "#16a34a" : "#64748b" }}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "conversations" && (
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>Recent Conversations</div>
            {conversations.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No conversations yet.</div>
            ) : conversations.map(c => (
              <div key={c.id} style={{ padding: "12px 20px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: c.role === "assistant" ? "#3b82f6" : "#0f172a" }}>
                    {c.role === "assistant" ? "🤖 Sofia" : "👤 Buyer"} {CHANNELS[c.channel]}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 14, marginTop: 4, color: "#334155" }}>{c.content}</div>
                {c.human_takeover && <span style={{ fontSize: 11, color: "#ef4444" }}>⚡ Human takeover</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "appointments" && (
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 700 }}>Upcoming Tours</div>
            {appointments.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No tours booked yet.</div>
            ) : appointments.map(a => (
              <div key={a.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ fontWeight: 600 }}>{a.type?.replace("_", " ").toUpperCase()}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{new Date(a.scheduled_at).toLocaleString()}</div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a" }}>{a.status}</span>
              </div>
            ))}
          </div>
        )}

        {selectedLead && (
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Lead Details</span>
              <button onClick={() => setSelectedLead(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedLead.name || "Unknown Buyer"}</div>
                <div style={{ color: "#64748b" }}>{selectedLead.phone} · {selectedLead.email}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[
                  ["Budget", selectedLead.budget_max ? `$${selectedLead.budget_max?.toLocaleString()}` : "Not set"],
                  ["Timeline", selectedLead.timeline || "Not set"],
                  ["Language", selectedLead.preferred_lang?.toUpperCase() || "EN"],
                  ["Channel", selectedLead.channel],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{k}</div>
                    <div style={{ fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => takeover(selectedLead.id)} style={{
                width: "100%", padding: "12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "#ef4444", color: "white", fontWeight: 700, fontSize: 15
              }}>
                ⚡ Take Over Conversation
              </button>
            </div>
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Conversation History</div>
              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {leadConvos.length === 0 ? (
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>No messages yet.</div>
                ) : leadConvos.map(c => (
                  <div key={c.id} style={{ marginBottom: 8, padding: 10, borderRadius: 8, background: c.role === "assistant" ? "#eff6ff" : "#f8fafc" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.role === "assistant" ? "🤖 Sofia" : "👤 Buyer"}</div>
                    <div style={{ fontSize: 13 }}>{c.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}