import { useState } from "react";
import { Settings, Save, MapPin, Clock, AlertTriangle, Layers } from "lucide-react";
import { InteractiveSensorMap } from "../components/SensorMapViz";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    s1r: "102.88", s1z: "1111.74", s1n: "11855",
    s2r: "97", s2z: "332", s2n: "16488",
    interval: "60",
    maxHotspot: "100",
    frames: "10",
  });

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 22, color: "#0f172a" }}>
            Settings
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>
            Configure sensor positions, time intervals, and alert thresholds.
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={15} /> Save Settings
        </button>
      </div>

      {saved && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
          padding: "12px 18px", display: "flex", alignItems: "center", gap: 8
        }} className="animate-fade-in">
          <span>✅</span>
          <span style={{ fontWeight: 600, color: "#15803d", fontSize: 14 }}>Settings saved successfully.</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Sensor locations */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={14} color="#2563eb" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Sensor Locations</span>
          </div>

          {[
            { label: "Sensor 1", color: "#f97316", keys: [["r (mm):", "s1r"], ["z (mm):", "s1z"], ["node_id:", "s1n"]] },
            { label: "Sensor 2", color: "#a855f7", keys: [["r (mm):", "s2r"], ["z (mm):", "s2z"], ["node_id:", "s2n"]] },
          ].map(({ label, color, keys }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {keys.map(([lbl, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4, display: "block" }}>{lbl}</label>
                    <input className="input-field" style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12 }}
                      value={settings[key]} onChange={e => set(key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timing + Alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={14} color="#7c3aed" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Time Interval</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Interval (s)", "interval"], ["# frames", "frames"]].map(([lbl, key]) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 5, display: "block" }}>{lbl}</label>
                  <input className="input-field" style={{ fontFamily: "JetBrains Mono, monospace" }}
                    value={settings[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={14} color="#d97706" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Warning Level</span>
            </div>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 5, display: "block" }}>Max hotspot (°C)</label>
            <input className="input-field" style={{ fontFamily: "JetBrains Mono, monospace" }}
              value={settings.maxHotspot} onChange={e => set("maxHotspot", e.target.value)} />
            <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
              Alert triggers when hotspot exceeds this value during monitoring.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive sensor map */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Layers size={14} color="#2563eb" />
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Sensor Position Preview — Interactive</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
            Hover to inspect · Scroll to zoom · Drag to pan · Click to pin
          </span>
        </div>
        <InteractiveSensorMap hotspot={80} />
      </div>
    </div>
  );
}
