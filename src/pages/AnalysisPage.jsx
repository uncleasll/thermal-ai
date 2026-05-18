import { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Upload, BarChart2, TrendingUp, Map } from "lucide-react";
import SensorMapViz, { InteractiveSensorMap } from "../components/SensorMapViz";
import podImage from "../assets/pod_mode1.png";

const generateData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    time: i * 7,
    hotspot: 60 + i * 1.2 + Math.sin(i * 0.5) * 3,
    sensor1: 45 + i * 0.9 + Math.cos(i * 0.4) * 2,
    sensor2: 38 + i * 0.7 + Math.sin(i * 0.6) * 1.5,
  }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    }}>
      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>t = {label}s</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#475569" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "#0f172a", fontFamily: "JetBrains Mono, monospace" }}>
            {p.value.toFixed(1)}°C
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AnalysisPage() {
  const [file, setFile]       = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data]                = useState(generateData());
  const [tab, setTab]         = useState("charts"); // charts | map
  const fileRef               = useRef();

  const handleAnalyze = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1500);
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 22, color: "#0f172a" }}>
          Data Analysis
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 2 }}>
          Upload sensor event data and analyze temperature trends + full 2D field.
        </p>
      </div>

      {/* Upload */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Event File</div>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                border: "1.5px dashed #cbd5e1", borderRadius: 10, padding: "11px 16px",
                cursor: "pointer", background: "#f8fafc", transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#cbd5e1"}
            >
              <Upload size={15} color="#60a5fa" />
              <span style={{ fontSize: 13, color: file ? "#1e293b" : "#94a3b8" }}>
                {file ? file.name : "Click to upload .txt file…"}
              </span>
            </div>
            <input ref={fileRef} type="file" accept=".txt,.csv" style={{ display: "none" }}
              onChange={e => { setFile(e.target.files[0]); setAnalyzed(false); }} />
          </div>
          <button className="btn-primary" onClick={handleAnalyze}
            disabled={!file || loading}
            style={{ opacity: !file ? 0.5 : 1, alignSelf: "flex-end", marginTop: 22 }}>
            {loading ? (
              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing…</>
            ) : (
              <><BarChart2 size={15} /> Analyze</>
            )}
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {[
          { key: "charts", icon: TrendingUp, label: "Time Series" },
          { key: "map",    icon: Map,        label: "2D Thermal Map" },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: 8, border: "none",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            background: tab === key ? "#fff" : "transparent",
            color: tab === key ? "#2563eb" : "#64748b",
            boxShadow: tab === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.15s",
          }}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Charts tab */}
      {tab === "charts" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={15} color="#2563eb" />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Hotspot Temperature</span>
              <span className="tag tag-blue" style={{ marginLeft: "auto" }}>Time series</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: "Time (s)", position: "insideBottom", offset: -4, fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[30, 110]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hotspot" stroke="#2563eb" strokeWidth={2} dot={false} name="Hotspot" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BarChart2 size={15} color="#2563eb" />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Sensor Readings</span>
              <span className="tag tag-green" style={{ marginLeft: "auto" }}>S1 + S2</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[20, 80]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="sensor1" stroke="#f97316" strokeWidth={2} dot={false} name="Sensor 1 (S1)" />
                <Line type="monotone" dataKey="sensor2" stroke="#a855f7" strokeWidth={2} dot={false} name="Sensor 2 (S2)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 20, gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BarChart2 size={15} color="#2563eb" />
              <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>All Channels — Combined</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: "Time (s)", position: "insideBottom", offset: -4, fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[20, 110]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="hotspot" stroke="#2563eb" strokeWidth={2} dot={false} name="Hotspot" />
                <Line type="monotone" dataKey="sensor1" stroke="#f97316" strokeWidth={1.5} dot={false} name="Sensor 1" />
                <Line type="monotone" dataKey="sensor2" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Sensor 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2D Map tab */}
      {tab === "map" && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Map size={15} color="#2563eb" />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
              2D Thermal Field — Axisymmetric (r–z)
            </span>
            <span className="tag tag-blue" style={{ marginLeft: "auto" }}>Interactive</span>
          </div>
          <InteractiveSensorMap hotspot={95} />
        </div>
      )}

      {analyzed && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
          padding: "14px 18px", display: "flex", alignItems: "center", gap: 10
        }} className="animate-fade-in">
          
          <div>
            <div style={{ fontWeight: 600, color: "#15803d", fontSize: 14 }}>Analysis complete — {file?.name}</div>
            <div style={{ color: "#166534", fontSize: 12 }}>30 frames processed · Peak: 95.2°C at t=203s · Switch to 2D Thermal Map to explore the field</div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
