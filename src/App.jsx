import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uoddvpafzcnhbjeazqzd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZGR2cGFmemNuaGJqZWF6cXpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYwODkyNCwiZXhwIjoyMDkzMTg0OTI0fQ.ZVv3xBB5yKCmJkaOohn4MhfKz7KUgnoozqbrg0cxi8M"
);

const CHANNEL_ICON  = { voice: "◉", whatsapp: "◈", web_chat: "◇" };
const CHANNEL_LABEL = { voice: "Voice", whatsapp: "WhatsApp", web_chat: "Web" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #f5f3ef;
    --surface:    #faf9f7;
    --surface2:   #eeebe5;
    --border:     rgba(0,0,0,0.08);
    --border2:    rgba(0,0,0,0.15);
    --gold:       #8a6a2e;
    --gold-light: #b8935a;
    --gold-dim:   rgba(138,106,46,0.07);
    --gold-line:  rgba(138,106,46,0.22);
    --text:       #1c1713;
    --text-dim:   rgba(28,23,19,0.55);
    --text-muted: rgba(28,23,19,0.35);
    --green:      #1a6e42;
    --green-bg:   rgba(26,110,66,0.08);
    --red:        #a02828;
    --red-bg:     rgba(160,40,40,0.07);
    --blue:       #1e4d8c;
    --blue-bg:    rgba(30,77,140,0.07);
    --amber:      #8a5e1a;
    --amber-bg:   rgba(138,94,26,0.08);
    --font-display: 'Cormorant Garamond', serif;
    --font-body:    'Outfit', sans-serif;
    --font-mono:    'DM Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-weight: 300;
    min-height: 100vh;
    font-size: 14px;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 36px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .header-left { display: flex; align-items: center; gap: 16px; }

  .logo-mark {
    width: 34px; height: 34px;
    border: 1.5px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 17px; color: var(--gold);
    font-weight: 400; flex-shrink: 0;
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text);
    display: block;
  }

  .brand-sub {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 1px;
    display: block;
  }

  .header-right { display: flex; gap: 8px; }

  .status-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 13px;
    border: 1px solid var(--border2);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-dim);
    background: var(--surface);
  }

  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    animation: blink 2.5s ease-in-out infinite;
  }
  .dot-green { background: var(--green); }
  .dot-blue  { background: var(--blue); }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .gold-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-light) 40%, transparent 100%);
    opacity: 0.35;
  }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .stat-card {
    padding: 20px 36px;
    border-right: 1px solid var(--border);
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
  }
  .stat-card:last-child { border-right: none; }
  .stat-card:hover { background: var(--gold-dim); }

  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 36px; right: 36px;
    height: 1.5px;
    background: var(--gold-light);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .stat-card:hover::after { transform: scaleX(1); }

  .stat-label {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
    font-family: var(--font-body);
    font-weight: 400;
  }

  /* Numbers use Outfit (clean sans) so "1" renders as "1" not "I" */
  .stat-value {
    font-family: var(--font-body);
    font-size: 44px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .stat-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 5px;
    font-weight: 300;
  }

  /* ── Layout ── */
  .main {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: calc(100vh - 130px);
  }

  /* ── Sidebar ── */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 24px 0;
  }

  .sidebar-section { padding: 0 18px; margin-bottom: 28px; }

  .sidebar-title {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    cursor: pointer;
    transition: all 0.18s;
    font-size: 13px;
    color: var(--text);
    font-weight: 400;
    margin-bottom: 2px;
    border: 1px solid transparent;
    border-radius: 2px;
  }

  .nav-item:hover { background: var(--gold-dim); color: var(--gold); }

  .nav-item.active {
    color: var(--gold);
    background: var(--gold-dim);
    border-color: var(--gold-line);
  }

  .nav-icon { width: 15px; text-align: center; font-size: 12px; opacity: 0.7; }

  .nav-count {
    margin-left: auto;
    font-size: 10px;
    font-family: var(--font-mono);
    background: var(--gold-dim);
    color: var(--gold);
    padding: 1px 7px;
    border: 1px solid var(--gold-line);
    font-weight: 400;
  }

  .sys-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    font-size: 12px;
    color: var(--text-dim);
    font-weight: 300;
  }

  /* ── Content ── */
  .content { padding: 28px 36px; }

  .content-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .content-title {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 300;
    font-style: italic;
    color: var(--text);
  }

  .content-meta {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 400;
  }

  /* ── Lead rows ── */
  .lead-list { display: flex; flex-direction: column; gap: 2px; }

  .lead-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    align-items: center;
    gap: 20px;
    padding: 16px 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.18s;
  }

  .lead-row:hover {
    border-color: var(--border2);
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transform: translateY(-1px);
  }

  .lead-row.selected {
    border-color: var(--gold);
    background: var(--gold-dim);
  }

  .lead-name {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 400;
    color: var(--text);
  }

  .lead-meta {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 2px;
    font-weight: 300;
  }

  .lead-channel {
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  .score-wrap { text-align: right; }

  .score-number {
    font-family: var(--font-mono);
    font-size: 22px;
    font-weight: 400;
    line-height: 1;
  }

  .score-label {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: 2px;
    font-weight: 400;
  }

  .status-tag {
    font-size: 9px;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    padding: 3px 9px;
    border: 1px solid;
    font-weight: 400;
    white-space: nowrap;
  }

  .tag-qualified       { color: var(--green); border-color: rgba(26,110,66,0.3);  background: var(--green-bg); }
  .tag-new             { color: var(--blue);  border-color: rgba(30,77,140,0.3);  background: var(--blue-bg);  }
  .tag-appointment_set { color: var(--gold);  border-color: var(--gold-line);     background: var(--gold-dim); }
  .tag-nurturing       { color: var(--amber); border-color: rgba(138,94,26,0.3);  background: var(--amber-bg); }
  .tag-lost            { color: var(--red);   border-color: rgba(160,40,40,0.3);  background: var(--red-bg);   }

  /* ── Conversations ── */
  .convo-list { display: flex; flex-direction: column; gap: 2px; }

  .convo-row {
    padding: 14px 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: border-color 0.18s;
  }
  .convo-row:hover { border-color: var(--border2); }

  .convo-row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 7px;
  }

  .role-tag {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 9px;
    border: 1px solid;
    font-weight: 400;
  }
  .role-assistant { color: var(--gold); border-color: var(--gold-line); background: var(--gold-dim); }
  .role-user      { color: var(--text-dim); border-color: var(--border2); }

  .convo-time { font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); }

  .convo-text { font-size: 13px; color: var(--text-dim); line-height: 1.65; font-weight: 300; }

  /* ── Detail panel ── */
  .detail-panel {
    position: fixed;
    top: 0; right: 0;
    width: 390px;
    height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border2);
    z-index: 100;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -6px 0 32px rgba(0,0,0,0.07);
  }
  .detail-panel.open { transform: translateX(0); }

  .detail-header {
    padding: 24px 26px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: var(--bg);
  }

  .detail-name {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 300;
    font-style: italic;
    color: var(--text);
    line-height: 1.1;
  }

  .detail-contact {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 4px;
    font-weight: 300;
  }

  .close-btn {
    background: none;
    border: 1px solid var(--border2);
    color: var(--text-dim);
    width: 28px; height: 28px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .close-btn:hover { border-color: var(--gold); color: var(--gold); }

  .detail-body { flex: 1; overflow-y: auto; padding: 22px 26px; }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 20px;
  }

  .detail-field {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 11px 13px;
  }

  .field-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
    font-weight: 400;
  }

  .field-value {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 400;
    color: var(--text);
  }

  .takeover-btn {
    width: 100%;
    padding: 13px;
    background: transparent;
    border: 1px solid var(--red);
    color: var(--red);
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s;
    margin-bottom: 22px;
    font-weight: 400;
  }
  .takeover-btn:hover { background: var(--red-bg); }

  .section-title {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  .bubble {
    margin-bottom: 8px;
    padding: 11px 13px;
    border: 1px solid var(--border);
  }
  .bubble.assistant { border-color: var(--gold-line); background: var(--gold-dim); }
  .bubble.user      { background: var(--bg); }

  .bubble-role {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 4px;
    font-weight: 400;
  }
  .bubble-role.assistant { color: var(--gold); }

  .bubble-text { font-size: 13px; color: var(--text); line-height: 1.6; font-weight: 300; }

  /* ── Empty ── */
  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 40px; text-align: center;
  }
  .empty-glyph {
    font-size: 36px;
    color: var(--text-muted);
    margin-bottom: 14px;
    opacity: 0.5;
  }
  .empty-text { font-size: 13px; color: var(--text-muted); line-height: 1.7; font-weight: 300; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
`;

export default function App() {
  const [leads, setLeads]               = useState([]);
  const [conversations, setConversations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab]       = useState("leads");
  const [stats, setStats]               = useState({ total: 0, qualified: 0, appointments: 0, avgScore: 0 });

  useEffect(() => {
    fetchAll();
    const sub = supabase.channel("realtime-db")
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
      total:       ld.length,
      qualified:   ld.filter(x => x.status === "qualified").length,
      appointments:ld.filter(x => x.status === "appointment_set").length,
      avgScore:    ld.length ? Math.round(ld.reduce((s, x) => s + (x.intent_score || 0), 0) / ld.length) : 0,
    });
  }

  async function takeover(leadId) {
    await supabase.from("conversations").insert({
      lead_id: leadId, channel: "web_chat", direction: "outbound",
      role: "system", content: "Human agent took over this conversation.",
      human_takeover: true,
    });
    await supabase.from("leads").update({ status: "nurturing" }).eq("id", leadId);
    fetchAll();
    alert("You have taken over this conversation.");
  }

  const leadConvos = selectedLead
    ? conversations.filter(c => c.lead_id === selectedLead.id)
    : [];

  const scoreColor = s =>
    s > 70 ? "var(--green)" : s > 40 ? "var(--amber)" : "var(--red)";

  return (
    <>
      <style>{css}</style>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">B</div>
          <div>
            <span className="brand-name">Basel Realty</span>
            <span className="brand-sub">AI Command Center · Cristina Giral</span>
          </div>
        </div>
        <div className="header-right">
          <div className="status-pill"><span className="dot dot-green" /> Sofia Active</div>
          <div className="status-pill"><span className="dot dot-blue" /> Cal.com</div>
        </div>
      </header>

      <div className="gold-rule" />

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Total Leads",     value: stats.total,       sub: "All channels",       color: "var(--gold)"  },
          { label: "Qualified",       value: stats.qualified,   sub: "Ready to engage",    color: "var(--green)" },
          { label: "Tours Booked",    value: stats.appointments,sub: "Scheduled viewings", color: "var(--blue)"  },
          { label: "Avg Intent Score",value: stats.avgScore,    sub: "Out of 100",         color: scoreColor(stats.avgScore) },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="main">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Intelligence</div>
            {[
              { id: "leads",         label: "All Leads",     icon: "◈", count: stats.total },
              { id: "conversations", label: "Conversations", icon: "◉", count: conversations.length },
              { id: "appointments",  label: "Appointments",  icon: "—", count: appointments.length },
            ].map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => { setActiveTab(item.id); setSelectedLead(null); }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.count > 0 && <span className="nav-count">{item.count}</span>}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">System Status</div>
            {[
              { label: "Sofia — Voice Agent",  color: "var(--green)" },
              { label: "Cal.com Scheduling",   color: "var(--blue)"  },
              { label: "Supabase — Live DB",   color: "var(--gold)"  },
            ].map(s => (
              <div key={s.label} className="sys-item">
                <span style={{ color: s.color, fontSize: 8 }}>●</span>
                {s.label}
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          <div className="content-header">
            <div className="content-title">
              {activeTab === "leads"         && "Active Leads"}
              {activeTab === "conversations" && "Conversations"}
              {activeTab === "appointments"  && "Appointments"}
            </div>
            <div className="content-meta">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Leads */}
          {activeTab === "leads" && (
            <div className="lead-list">
              {leads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-glyph">◈</div>
                  <div className="empty-text">No leads yet.<br />Sofia will populate this when buyers start calling.</div>
                </div>
              ) : leads.map(lead => (
                <div
                  key={lead.id}
                  className={`lead-row ${selectedLead?.id === lead.id ? "selected" : ""}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <div>
                    <div className="lead-name">{lead.name || "Unknown Buyer"}</div>
                    <div className="lead-meta">
                      {lead.phone || lead.email || "No contact"} · {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="lead-channel">
                    {CHANNEL_ICON[lead.channel]} {CHANNEL_LABEL[lead.channel]}
                  </div>
                  <div className={`status-tag tag-${lead.status}`}>
                    {lead.status?.replace("_", " ")}
                  </div>
                  <div className="score-wrap">
                    <div className="score-number" style={{ color: scoreColor(lead.intent_score || 0) }}>
                      {lead.intent_score || 0}
                    </div>
                    <div className="score-label">Intent</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Conversations */}
          {activeTab === "conversations" && (
            <div className="convo-list">
              {conversations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-glyph">◉</div>
                  <div className="empty-text">No conversations yet.</div>
                </div>
              ) : conversations.map(c => (
                <div key={c.id} className="convo-row">
                  <div className="convo-row-header">
                    <span className={`role-tag role-${c.role}`}>
                      {c.role === "assistant" ? "Sofia" : "Buyer"}
                    </span>
                    <span className="convo-time">{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  <div className="convo-text">{c.content}</div>
                  {c.human_takeover && (
                    <div style={{ fontSize: 10, color: "var(--red)", marginTop: 7, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      ● Human takeover
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="lead-list">
              {appointments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-glyph">—</div>
                  <div className="empty-text">No tours booked yet.<br />Sofia will schedule these automatically.</div>
                </div>
              ) : appointments.map(a => (
                <div key={a.id} className="lead-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                  <div>
                    <div className="lead-name">{a.type?.replace(/_/g, " ")}</div>
                    <div className="lead-meta">{new Date(a.scheduled_at).toLocaleString()}</div>
                  </div>
                  <div className={`status-tag tag-${a.status}`}>{a.status}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Detail Panel */}
      <div className={`detail-panel ${selectedLead ? "open" : ""}`}>
        {selectedLead && (
          <>
            <div className="detail-header">
              <div>
                <div className="detail-name">{selectedLead.name || "Unknown Buyer"}</div>
                <div className="detail-contact">
                  {[selectedLead.phone, selectedLead.email].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedLead(null)}>✕</button>
            </div>

            <div className="detail-body">
              <div className="detail-grid">
                {[
                  ["Budget",       selectedLead.budget_max ? `$${selectedLead.budget_max.toLocaleString()}` : "—"],
                  ["Timeline",     selectedLead.timeline || "—"],
                  ["Language",     selectedLead.preferred_lang?.toUpperCase() || "EN"],
                  ["Channel",      CHANNEL_LABEL[selectedLead.channel] || "—"],
                  ["Intent Score", `${selectedLead.intent_score || 0} / 100`],
                  ["Status",       selectedLead.status?.replace("_", " ") || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="detail-field">
                    <div className="field-label">{k}</div>
                    <div className="field-value">{v}</div>
                  </div>
                ))}
              </div>

              <button className="takeover-btn" onClick={() => takeover(selectedLead.id)}>
                ● &nbsp; Take Over Conversation
              </button>

              <div className="section-title">Conversation History</div>

              {leadConvos.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "14px 0", fontWeight: 300 }}>
                  No messages yet.
                </div>
              ) : leadConvos.map(c => (
                <div key={c.id} className={`bubble ${c.role}`}>
                  <div className={`bubble-role ${c.role}`}>
                    {c.role === "assistant" ? "Sofia" : "Buyer"}
                  </div>
                  <div className="bubble-text">{c.content}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
