import { Activity, BarChart2, Settings, Monitor, FlaskConical, Home, LogOut, Thermometer } from "lucide-react";

const navItems = [
  { id: "main", label: "Main", icon: Home },
  { id: "analysis", label: "Analysis", icon: BarChart2 },
  { id: "monitor", label: "Monitor", icon: Monitor },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "test", label: "Test", icon: FlaskConical },
];

export default function Sidebar({ active, setActive, onLogout }) {
  return (
    <aside style={{
      width: 216, minHeight: "100vh",
      background: "#fff",
      borderRight: "1px solid #e8edf3",
      display: "flex", flexDirection: "column",
      padding: "0 10px",
      position: "sticky", top: 0, height: "100vh",
    }}>
      <div style={{ padding: "18px 6px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #1e40af, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Thermometer size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a", lineHeight: 1.1 }}>
              Thermal AI
            </div>
            <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: "0.06em" }}>
              POD · LSTM
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 10, display: "flex", flexDirection: "column", gap: 1 }}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-link${active === id ? " active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <div style={{ paddingBottom: 14 }}>
        <div style={{
          background: "#f8fafc", borderRadius: 10, padding: "11px 12px",
          marginBottom: 6, border: "1px solid #f1f5f9"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 500 }}>System status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.2)"
            }} className="animate-pulse2" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>All systems nominal</span>
          </div>
        </div>
        <button className="nav-link" onClick={onLogout} style={{ color: "#ef4444" }}>
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </aside>
  );
}
