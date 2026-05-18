import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Upload, Download, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import podImage from "../assets/pod_mode1.png";

const MAX_THRESHOLD = 100;

const EVENT_TYPES = [
  { value: "NE",  label: "No Event (NE)" },
  { value: "SE-T", label: "Single Event T (SE-T)" },
  { value: "SE-C", label: "Single Event C (SE-C)" },
  { value: "DE",  label: "Double Event (DE)" },
];

function generateHotspotData(frames) {
  return Array.from({ length: frames }, (_, i) => {
    const t = i * 5;
    const hs = 60 + i * 1.15 + Math.sin(i * 0.38) * 4.2;
    const s1 = 42 + i * 0.82 + Math.cos(i * 0.5) * 2.1;
    const s2 = 35 + i * 0.66 + Math.sin(i * 0.6) * 1.5;
    return { time: t, hotspot: +hs.toFixed(1), s1: +s1.toFixed(1), s2: +s2.toFixed(1) };
  });
}

export default function MonitorPage() {
  const [file, setFile] = useState(null);
  const [eventType, setEventType] = useState("NE");
  const [temp1, setTemp1] = useState("");
  const [temp2, setTemp2] = useState("");
  const [curr1, setCurr1] = useState("");
  const [curr2, setCurr2] = useState("");
  const [eventTimeT, setEventTimeT] = useState("");
  const [eventTimeC, setEventTimeC] = useState("");
  const [reconstructed, setReconstructed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [frame, setFrame] = useState(200);
  const [alert, setAlert] = useState(false);
  const fileRef = useRef();

  const handleReconstruct = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      const d = generateHotspotData(250);
      setData(d);
      const hs = d[200]?.hotspot || 95;
      setAlert(hs > MAX_THRESHOLD);
      setReconstructed(true);
      setLoading(false);
    }, 1400);
  };

  const handleReset = () => {
    setFile(null);
    setReconstructed(false);
    setData([]);
    setFrame(200);
    setAlert(false);
    setTemp1(""); setTemp2(""); setCurr1(""); setCurr2("");
    setEventTimeT(""); setEventTimeC("");
    setEventType("NE");
  };

  const currentHotspot = data[frame]?.hotspot;
  const frameData = data.length > 0 ? data.slice(0, frame + 1) : [];

  const SE = eventType === "SE-T" || eventType === "SE-C";
  const DE = eventType === "DE";

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 21, color: "#0f172a" }}>
            Data Analysis
          </h2>
          <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 2 }}>
            Upload sensor data, configure the event, and run thermal field reconstruction.
          </p>
        </div>
        {reconstructed && (
          <button className="btn-outline" onClick={handleReset}>
            <RefreshCw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Upload + Event config */}
      <div className="card" style={{ padding: 24 }}>
        {/* Upload row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              border: "1.5px dashed #cbd5e1", borderRadius: 9, padding: "9px 16px",
              cursor: "pointer", background: "#f8fafc", transition: "border-color 0.14s", flex: "0 0 auto",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#cbd5e1"}
          >
            <Upload size={14} color="#60a5fa" />
            <span style={{ fontSize: 13, color: file ? "#1e293b" : "#94a3b8", fontWeight: file ? 600 : 400 }}>
              {file ? file.name : "Upload event file…"}
            </span>
          </div>
          <input ref={fileRef} type="file" accept=".txt,.csv" style={{ display: "none" }}
            onChange={e => { setFile(e.target.files[0]); setReconstructed(false); }} />

          {file && <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "DM Mono, monospace" }}>{file.name}</span>}
        </div>

        {/* Event type + fields */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr", gap: 14, alignItems: "end", marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Event</label>
            <select className="input-field" style={{ fontFamily: "DM Sans, sans-serif" }}
              value={eventType} onChange={e => setEventType(e.target.value)}>
              {EVENT_TYPES.map(ev => (
                <option key={ev.value} value={ev.value}>{ev.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Temperature 1</label>
            <input className="input-field" placeholder="°C" value={temp1} onChange={e => setTemp1(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Temperature 2</label>
            <input className="input-field" placeholder="°C" value={temp2} onChange={e => setTemp2(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Event time T</label>
            <input className="input-field" placeholder="s" value={eventTimeT} onChange={e => setEventTimeT(e.target.value)}
              disabled={eventType === "NE"} style={{ opacity: eventType === "NE" ? 0.4 : 1 }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr", gap: 14, alignItems: "end", marginBottom: 22 }}>
          <div />
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Current 1</label>
            <input className="input-field" placeholder="A" value={curr1} onChange={e => setCurr1(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Current 2</label>
            <input className="input-field" placeholder="A" value={curr2} onChange={e => setCurr2(e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>Event time C</label>
            <input className="input-field" placeholder="s" value={eventTimeC} onChange={e => setEventTimeC(e.target.value)}
              disabled={eventType === "NE" || eventType === "SE-T"} style={{ opacity: (eventType === "NE" || eventType === "SE-T") ? 0.4 : 1 }} />
          </div>
        </div>

        <button className="btn-primary" onClick={handleReconstruct} disabled={!file || loading}
          style={{ opacity: !file ? 0.5 : 1 }}>
          {loading ? (
            <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Reconstructing…</>
          ) : "Reconstruct"}
        </button>
      </div>

      {/* Alert */}
      {alert && reconstructed && (
        <div style={{
          background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 11,
          padding: "13px 18px", display: "flex", alignItems: "center", gap: 10
        }} className="animate-fade-in">
          <AlertTriangle size={17} color="#ea580c" />
          <div>
            <div style={{ fontWeight: 700, color: "#9a3412", fontSize: 13.5 }}>
              Hotspot exceeded threshold ({MAX_THRESHOLD} °C)
            </div>
            <div style={{ color: "#c2410c", fontSize: 12 }}>
              Current peak: {currentHotspot?.toFixed(1)} °C — Check system immediately.
            </div>
          </div>
        </div>
      )}

      {/* Sensor time series */}
      {reconstructed && (
        <>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a", marginBottom: 14 }}>
              Sensor Readings
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={frameData}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[20, 90]} />
                <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={v => [`${v}°C`]} />
                <Line type="monotone" dataKey="s1" stroke="#f97316" strokeWidth={2} dot={false} name="Sensor 1" isAnimationActive={false} />
                <Line type="monotone" dataKey="s2" stroke="#7c3aed" strokeWidth={2} dot={false} name="Sensor 2" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Reconstruction + Hotspot */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
            {/* POD image */}
            <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a" }}>Reconstruction</div>
              <img
                src={podImage}
                alt="Thermal Field Reconstruction"
                style={{ height: 260, width: "auto", objectFit: "contain", borderRadius: 8 }}
              />
              {/* Time slider */}
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                  Time — Frame {frame}
                </div>
                <input
                  type="range" min={0} max={data.length - 1} value={frame}
                  onChange={e => setFrame(+e.target.value)}
                  style={{ width: "100%", accentColor: "#2563eb" }}
                />
              </div>
            </div>

            {/* Hotspot chart */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a" }}>Hotspot Temperature</div>
                <div style={{
                  fontFamily: "DM Mono, monospace", fontSize: 20, fontWeight: 500,
                  color: currentHotspot > MAX_THRESHOLD ? "#dc2626" : "#2563eb",
                }}>
                  {currentHotspot?.toFixed(1)} °C
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={frameData}>
                  <CartesianGrid stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} label={{ value: "Time (s)", position: "insideBottom", offset: -4, fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} domain={[50, 120]} />
                  <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={v => [`${v}°C`]} />
                  <ReferenceLine y={MAX_THRESHOLD} stroke="#ef4444" strokeDasharray="4 3"
                    label={{ value: "Limit", fill: "#ef4444", fontSize: 10 }} />
                  <ReferenceLine x={frameData[frame]?.time} stroke="#2563eb" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="hotspot" stroke="#dc2626" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Download */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-outline">
              <Download size={14} /> Download full reconstruction — {file?.name?.replace(".txt", "")}_reconstructed.txt
            </button>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
