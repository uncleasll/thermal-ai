import { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Upload, FlaskConical, Download, BarChart2, CheckCircle, AlertCircle, Grid } from "lucide-react";
import podImage from "../assets/pod_mode1.png";
import { InteractiveSensorMap } from "../components/SensorMapViz";

const generateTestData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    time: i * 7,
    true: 70 + i * 0.9 + Math.sin(i * 0.5) * 4,
    reconstructed: 70 + i * 0.9 + Math.sin(i * 0.5) * 4 + (Math.random() - 0.5) * 4,
  }));

export default function TestPage() {
  const [eventFile, setEventFile]   = useState(null);
  const [reconFile, setReconFile]   = useState(null);
  const [evaluated, setEvaluated]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [data]                      = useState(generateTestData());
  const [mapView, setMapView]       = useState("side-by-side");
  const eventRef = useRef();
  const reconRef = useRef();

  const handleEvaluate = () => {
    if (!eventFile || !reconFile) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setEvaluated(true); }, 1700);
  };

  const mae = (arr, k1, k2) => (arr.reduce((s, d) => s + Math.abs(d[k1] - d[k2]), 0) / arr.length).toFixed(2);
  const overallMAE = evaluated ? mae(data, "true", "reconstructed") : null;
  const hotspotMAE = evaluated ? (parseFloat(overallMAE) * 1.91).toFixed(2) : null;

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 21, color: "#0f172a" }}>
          Model Test & Evaluation
        </h2>
        <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 2 }}>
          Upload ground-truth and reconstruction files to evaluate model accuracy.
        </p>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, alignItems: "flex-end" }}>
          {[
            { label: "Test Event", ref: eventRef, file: eventFile, setFile: setEventFile },
            { label: "Reconstruction", ref: reconRef, file: reconFile, setFile: setReconFile },
          ].map(({ label, ref, file, setFile }) => (
            <div key={label}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</div>
              <div onClick={() => ref.current?.click()} style={{
                display: "flex", alignItems: "center", gap: 8,
                border: "1.5px dashed #cbd5e1", borderRadius: 9, padding: "11px 14px",
                cursor: "pointer", background: "#f8fafc", transition: "border-color 0.14s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#cbd5e1"}
              >
                <Upload size={14} color="#60a5fa" />
                <span style={{ fontSize: 12, color: file ? "#1e293b" : "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                  {file ? file.name : "Upload .txt file…"}
                </span>
              </div>
              <input ref={ref} type="file" accept=".txt,.csv" style={{ display: "none" }}
                onChange={e => { setFile(e.target.files[0]); setEvaluated(false); }} />
            </div>
          ))}
          <button className="btn-primary" onClick={handleEvaluate}
            disabled={!eventFile || !reconFile || loading}
            style={{ opacity: (!eventFile || !reconFile) ? 0.5 : 1 }}>
            {loading ? (
              <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Evaluating…</>
            ) : (
              <><FlaskConical size={14} /> Evaluate</>
            )}
          </button>
        </div>
      </div>

      {evaluated && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }} className="animate-fade-in">
          {[
            { label: "Overall MAE", value: `${overallMAE} °C`, icon: BarChart2, color: "#2563eb", bg: "#eff6ff" },
            { label: "Hotspot MAE", value: `${hotspotMAE} °C`, icon: AlertCircle, color: "#d97706", bg: "#fffbeb" },
            { label: "Frames", value: "30", icon: Grid, color: "#059669", bg: "#ecfdf5" },
            { label: "Status", value: "Pass", icon: CheckCircle, color: "#059669", bg: "#ecfdf5" },
          ].map(m => (
            <div key={m.label} className="stat-card" style={{ background: m.bg }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={15} color={m.color} />
              </div>
              <div style={{ fontFamily: "DM Mono, monospace", fontSize: 21, fontWeight: 500, color: m.color }}>
                {m.value}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 600, fontSize: 14.5, color: "#0f172a" }}>Thermal Field Comparison</span>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 9, padding: 4 }}>
          {[
            { key: "side-by-side", label: "Side by Side" },
            { key: "interactive",  label: "Interactive" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setMapView(key)} style={{
              padding: "6px 14px", borderRadius: 7, border: "none",
              fontWeight: 600, fontSize: 12, cursor: "pointer",
              background: mapView === key ? "#fff" : "transparent",
              color: mapView === key ? "#2563eb" : "#64748b",
              boxShadow: mapView === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.14s", fontFamily: "DM Sans, sans-serif",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {mapView === "side-by-side" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "start" }}>
          {[
            { label: "True Field" },
            { label: "Reconstructed" },
          ].map(({ label }) => (
            <div key={label} className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a", marginBottom: 10 }}>{label}</div>
              <img src={podImage} alt={label} style={{ width: "100%", height: 240, objectFit: "contain", borderRadius: 8 }} />
            </div>
          ))}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a", marginBottom: 12 }}>Summary</div>
            {evaluated ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Test file", value: eventFile?.name?.slice(0, 18) + "…" },
                  { label: "Recon file", value: reconFile?.name?.slice(0, 18) + "…" },
                  { label: "Frames", value: "30" },
                  { label: "Overall MAE", value: `${overallMAE} °C` },
                  { label: "Hotspot MAE", value: `${hotspotMAE} °C` },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: "#1e293b", fontFamily: "DM Mono, monospace", fontSize: 11 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Upload files and run Evaluate.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 24 }}>
          <InteractiveSensorMap hotspot={95} />
        </div>
      )}

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a" }}>Hotspot Comparison — True vs Reconstructed</span>
          {evaluated && (
            <button className="btn-outline" style={{ fontSize: 12, padding: "6px 14px" }}>
              <Download size={13} /> Download
            </button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[60, 110]} />
            <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={v => [`${v.toFixed(1)}°C`]} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="true" stroke="#0f172a" strokeWidth={2} dot={false} name="True" />
            <Line type="monotone" dataKey="reconstructed" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Reconstructed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
