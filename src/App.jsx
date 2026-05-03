import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uoddvpafzcnhbjeazqzd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZGR2cGFmemNuaGJqZWF6cXpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzYwODkyNCwiZXhwIjoyMDkzMTg0OTI0fQ.ZVv3xBB5yKCmJkaOohn4MhfKz7KUgnoozqbrg0cxi8M"
);

const CHANNEL_ICON = { voice: "◉", whatsapp: "◈", web_chat: "◇" };
const CHANNEL_LABEL = { voice: "Voice", whatsapp: "WhatsApp", web_chat: "Web" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #f9f7f4;
    --surface:  #ffffff;
    --surface2: #f4f1ed;
    --border:   rgba(0,0,0,0.07);
    --border2:  rgba(0,0,0,0.13);
    --gold:     #9a7a3f;
    --gold-light: #c9a96e;
    --gold-dim: rgba(154,122,63,0.08);
    --gold-line: rgba(154,122,63,0.25);
    --text:     #1a1611;
    --text-dim: rgba(26,22,17,0.5);
    --text-muted: rgba(26,22,17,0.32);
    --green:    #1a7a4a;
    --green-bg: rgba(26,122,74,0.07);
    --red:      #b03030;
    --red-bg:   rgba(176,48,48,0.07);
    --blue:     #2457a0;
    --blue-bg:  rgba(36,87,160,0.07);
    --amber:    #9a6e1a;
    --amber-bg: rgba(154,110,26,0.07);
    --font-display: 'Cormorant Garamond', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-weight: 300;
    min-height: 100vh;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .header-left { display: flex; align-items: center; gap: 18px; }

  .logo-mark {
    width: 38px; height: 38px;
    border: 1.5px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 20px; color: var(--gold);
    letter-spacing: 0.05em;
    font-weight: 400;
  }

  .brand h1 {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text);
  }

  .brand p {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .header-right { display: flex; align-items: center; gap: 10px; }

  .status-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    border: 1px solid var(--border2);
    background: var(--surface);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    animation: pulse 2.5s ease-in-out infinite;
  }
  .dot-green { background: var(--green); }
  .dot-blue  { background: var(--blue); }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .stat-card {
    padding: 28px 40px;
    border-right: 1px solid var(--border);
    position: relative;
    transition: background 0.25s;
  }
  .stat-card:last-child { border-right: none; }
  .stat-card:hover { background: var(--gold-dim); }

  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 40px; right: 40px;
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
    margin-bottom: 10px;
  }

  .stat-value {
    font-family: var(--font-display);
    font-size: 52px;
    font-weight: 300;
    line-height: 1;
  }

  .stat-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 6px;
  }

  /* Layout */
  .main {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: calc(100vh - 153px);
  }

  /* Sidebar */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 28px 0;
  }

  .sidebar-section { padding: 0 20px; margin-bottom: 32px; }

  .sidebar-title {
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    color: var(--text-dim);
    letter-spacing: 0.02em;
    margin-bottom: 2px;
    border: 1px solid transparent;
  }

  .nav-item:hover { color: var(--text); background: var(--gold-dim); }

  .nav-item.active {
    color: var(--gold);
    background: var(--gold-dim);
    border-color: var(--gold-line);
  }

  .nav-icon { width: 16px; text-align: center; font-size: 13px; }

  .nav-count {
    margin-left: auto;
    font-size: 10px;
    background: var(--gold-dim);
    color: var(--gold);
    padding: 2px 8px;
    border: 1px solid var(--gold-line);
  }

  /* Content */
  .content { padding: 32px 40px; background: var(--bg); }

  .content-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .content-title {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.02em;
    color: var(--text);
  }

  .content-meta {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* Leads */
  .lead-list { display: flex; flex-direction: column; gap: 2px; }

  .lead-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    align-items: center;
    gap: 24px;
    padding: 20px 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s;
  }

  .lead-row:hover { border-color: var(--border2); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }

  .lead-row.selected {
    border-color: var(--gold);
    background: var(--gold-dim);
    box-shadow: 0 2px 12px rgba(154,122,63,0.1);
  }

  .lead-name {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0.01em;
  }

  .lead-meta {
    font-size: 12px;
    color: var(--text-dim);
    margin-top: 3px;
  }

  .lead-channel {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .score-number {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 300;
    line-height: 1;
    text-align: right;
  }

  .score-label {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: right;
    margin-top: 2px;
  }

  .status-tag {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border: 1px solid;
  }

  .tag-qualified      { color: var(--green); border-color: rgba(26,122,74,0.3); background: var(--green-bg); }
  .tag-new            { color: var(--blue);  border-color: rgba(36,87,160,0.3); background: var(--blue-bg);  }
  .tag-appointment_set{ color: var(--gold);  border-color: var(--gold-line);    background: var(--gold-dim); }
  .tag-nurturing      { color: var(--amber); border-color: rgba(154,110,26,0.3);background: var(--amber-bg); }
  .tag-lost           { color: var(--red);   border-color: rgba(176,48,48,0.3); background: var(--red-bg);   }

  /* Conversations */
  .convo-list { display: flex; flex-direction: column; gap: 2px; }

  .convo-row {
    padding: 18px 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition: all 0.2s;
  }

  .convo-row:hover { border-color: var(--border2); }

  .convo-row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .role-tag {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border: 1px solid;
  }

  .role-assistant { color: var(--gold); border-color: var(--gold-line); background: var(--gold-dim); }
  .role-user      { color: var(--text-dim); border-color: var(--border2); }

  .convo-time { font-size: 10px; color: var(--text-muted); }

  .convo-text {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.65;
  }

  /* Detail panel */
  .detail-panel {
    position: fixed;
    top: 0; right: 0;
    width: 400px;
    height: 100vh;
    background: var(--surface);
    border-left: 1px solid var(--border2);
    z-index: 100;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    box-shadow: -8px 0 40px rgba(0,0,0,0.08);
  }

  .detail-panel.open { transform: translateX(0); }

  .detail-header {
    padding: 28px 28px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: var(--bg);
  }

  .detail-name {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 300;
    font-style: italic;
    line-height: 1.1;
    color: var(--text);
  }

  .detail-contact {
    font-size: 12px;
    color: var(--text-dim);
    margin-top: 5px;
  }

  .close-btn {
    background: none;
    border: 1px solid var(--border2);
    color: var(--text-dim);
    width: 30px; height: 30px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .close-btn:hover { border-color: var(--gold); color: var(--gold); }

  .detail-body { flex: 1; overflow-y: auto; padding: 24px 28px; }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
  }

  .detail-field {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 12px 14px;
  }

  .field-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }

  .field-value {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 400;
    color: var(--text);
  }

  .takeover-btn {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1px solid var(--red);
    color: var(--red);
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 24px;
  }

  .takeover-btn:hover { background: var(--red-bg); }

  .section-title {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .bubble {
    margin-bottom: 10px;
    padding: 12px 14px;
    border: 1px solid var(--border);
  }

  .bubble.assistant { border-color: var(--gold-line); background: var(--gold-dim); }
  .bubble.user      { background: var(--bg); }

  .bubble-role {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }

  .bubble-role.assistant { color: var(--gold); }

  .bubble-text { font-size: 13px; color: var(--text); line-height: 1.6; }

  /* Empty */
  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 40px; text-align: center;
  }

  .empty-glyph {
    font-family: var(--font-display);
    font-size: 56px; font-style: italic;
    color: var(--text-muted); margin-bottom: 16px;
  }

  .empty-text { font-size: 13px; color: var(--text-muted); line-height: 1.7; }

  /* Divider */
  .gold-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
    opacity: 0.4;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
`;

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
    alert("You have taken over this conversation.");
  }

  const leadConvos = selectedLead
    ? conversations.filter(c => c.lead_id === selectedLead.id)
    : [];

  const scoreColor = (s) =>
    s > 70 ? "var(--green)" : s > 40 ? "var(--amber)" : "var(--red)";

  return (
    <>
      <style>{css}</style>

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">B</div>
          <div className="brand">
            <h1>Basel Realty</h1>
            <p>AI Command Center · Cristina Giral</p>
          </div>
        </div>
        <div className="header-right">
          <div className="status-pill">
            <span className="dot dot-green" /> Sofia Active
          </div>
          <div className="status-pill">
            <span className="dot dot-blue" /> Cal.com
          </div>
        </div>
      </header>

      <div className="gold-rule" />

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value" style={{ color: "var(--gold)" }}>{stats.total}</div>
          <div className="stat-sub">All channels</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Qualified</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{stats.qualified}</div>
          <div className="stat-sub">Ready to engage</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tours Booked</div>
          <div className="stat-value" style={{ color: "var(--blue)" }}>{stats.appointments}</div>
          <div className="stat-sub">Scheduled viewings</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Intent Score</div>
          <div className="stat-value" style={{ color: scoreColor(stats.avgScore) }}>{stats.avgScore}</div>
          <div className="stat-sub">Out of 100</div>
        </div>
      </div>

      {/* Main */}
      <div className="main">

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-title">Intelligence</div>
            {[
              { id: "leads", label: "All Leads", icon: "◈", count: stats.total },
              { id: "conversations", label: "Conversations", icon: "◉", count: conversations.length },
              { id: "appointments", label: "Appointments", icon: "◇", count: appointments.length },
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
              { label: "Sofia — Voice Agent", color: "var(--green)" },
              { label: "Cal.com Scheduling", color: "var(--blue)" },
              { label: "Supabase — Live DB", color: "var(--gold)" },
            ].map(s => (
              <div key={s.label} className="nav-item" style={{ cursor: "default" }}>
                <span className="nav-icon" style={{ color: s.color }}>◉</span>
                <span style={{ fontSize: 12 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="content">
          <div className="content-header">
            <div className="content-title">
              {activeTab === "leads" && "Active Leads"}
              {activeTab === "conversations" && "Conversations"}
              {activeTab === "appointments" && "Appointments"}
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
                  <div>
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
                    <div style={{ fontSize: 10, color: "var(--red)", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      ◉ Human takeover
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
                  <div className="empty-glyph">◇</div>
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
                  ["Budget", selectedLead.budget_max ? `$${selectedLead.budget_max.toLocaleString()}` : "—"],
                  ["Timeline", selectedLead.timeline || "—"],
                  ["Language", selectedLead.preferred_lang?.toUpperCase() || "EN"],
                  ["Channel", CHANNEL_LABEL[selectedLead.channel] || "—"],
                  ["Intent Score", `${selectedLead.intent_score || 0} / 100`],
                  ["Status", selectedLead.status?.replace("_", " ") || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="detail-field">
                    <div className="field-label">{k}</div>
                    <div className="field-value">{v}</div>
                  </div>
                ))}
              </div>

              <button className="takeover-btn" onClick={() => takeover(selectedLead.id)}>
                ◉ &nbsp; Take Over Conversation
              </button>

              <div className="section-title">Conversation History</div>

              {leadConvos.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "16px 0" }}>No messages yet.</div>
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
