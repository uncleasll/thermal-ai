import {
  Activity,
  AlertTriangle,
  Cpu,
  Database,
  Gauge,
  Layers,
  Network,
  Radio,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  Zap,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import podImage from "../assets/pod_mode1.png";



const pipeline = [
  {
    title: "High-Fidelity Simulation",
    text: "COMSOL Multiphysics 6.3.0.290 generates transient cable thermal fields across current and ambient scenarios.",
    icon: Database,
  },
  {
    title: "Reduced-Order Compression",
    text: "Proper Orthogonal Decomposition maps the full temperature field into a compact latent coefficient space.",
    icon: Layers,
  },
  {
    title: "Sequence Learning",
    text: "LSTM learns how sparse sensor observations, current loading, and ambient temperature evolve over time.",
    icon: Network,
  },
  {
    title: "Real-Time Reconstruction",
    text: "Predicted POD coefficients reconstruct the full spatiotemporal thermal field for monitoring and digital twins.",
    icon: Radio,
  },
];

const significance = [
  { label: "Digital twin systems", icon: Cpu },
  { label: "Predictive maintenance", icon: Gauge },
  { label: "Thermal safety monitoring", icon: ShieldCheck },
  { label: "Power cable management", icon: Activity },
];

export default function OverviewPage() {
  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(140deg, #060f22 0%, #102a56 55%, #1e4dab 100%)",
        borderRadius: 18,
        padding: "36px 40px",
        color: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: 32,
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 60px rgba(37,99,235,0.2)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
            {["COMSOL", "POD", "LSTM", "Sparse sensors", "Digital twin"].map(item => (
              <span key={item} style={{
                border: "1px solid rgba(191,219,254,0.25)",
                background: "rgba(255,255,255,0.07)",
                borderRadius: 999, padding: "4px 10px",
                fontSize: 11, color: "#bfdbfe", fontWeight: 700,
              }}>{item}</span>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "#93c5fd", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 10 }}>
            REDUCED-ORDER THERMAL FIELD RECONSTRUCTION
          </div>

          <h1 style={{
            fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 34,
            marginBottom: 14, lineHeight: 1.1,
          }}>
            Real-Time Digital Twin<br />for Power Cable Thermal Fields
          </h1>

          <p style={{ color: "#dbeafe", fontSize: 14.5, maxWidth: 640, lineHeight: 1.78 }}>
            This study proposes a reduced-order modeling framework for real-time thermal field 
            reconstruction of power cable systems using Proper Orthogonal Decomposition (POD) 
            and Long Short-Term Memory (LSTM) networks. The objective is to estimate high-dimensional 
            spatiotemporal temperature distributions from sparse sensor measurements and operational 
            inputs such as electrical current loading and ambient temperature.
          </p>

          <div style={{ display: "flex", gap: 28, marginTop: 22, flexWrap: "wrap" }}>
            {[
              ["COMSOL 6.3", "simulation source"],
              ["POD + LSTM", "model architecture"],
              ["Real-time", "fast inference"],
            ].map(([value, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 18, color: "#fff", fontWeight: 500 }}>{value}</div>
                <div style={{ fontSize: 10.5, color: "#bfdbfe", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* POD Mode 1 image */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={podImage}
            alt="POD Mode 1 — Temperature Distribution"
            style={{
              height: 280,
              width: "auto",
              objectFit: "contain",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              padding: "4px",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: s.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div style={{ fontFamily: "DM Mono, monospace", fontSize: 22, fontWeight: 500, color: "#0f172a", marginTop: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Study Overview + Significance */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 14, alignItems: "stretch" }}>
        <div className="card" style={{ padding: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={15} color="#2563eb" />
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
              Study Overview
            </h2>
          </div>
          <p style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.85, marginBottom: 12 }}>
            High-fidelity thermal data is generated using COMSOL Multiphysics simulations under multiple 
            transient operating scenarios, including varying current and ambient conditions. POD is applied 
            to compress the full thermal field into a low-dimensional latent space, and an LSTM model is 
            trained to map sparse sensor observations and system inputs to POD coefficients, enabling 
            reconstruction of the full temperature field.
          </p>
          <p style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.85 }}>
            The proposed approach significantly reduces computational cost compared to full finite element 
            simulations while enabling fast inference suitable for digital twin and monitoring applications. 
            Results demonstrate accurate reconstruction of unseen thermal scenarios using limited sensor 
            information, indicating strong potential for real-time thermal monitoring and predictive maintenance.
          </p>
        </div>

        <div className="card" style={{
          padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={15} color="#059669" />
              </div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
                Significance
              </h2>
            </div>
            <p style={{ color: "#475569", fontSize: 13.5, lineHeight: 1.75 }}>
              By utilizing only sparse external sensor measurements together with operational conditions 
              such as current loading and ambient temperature, the framework can estimate the full 
              spatiotemporal temperature distribution in real time — significantly reducing computational 
              complexity compared to full numerical simulations.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18 }}>
            {significance.map(({ label, icon: Icon }) => (
              <div key={label} style={{
                border: "1px solid #e8edf3", borderRadius: 10, padding: "11px 13px",
                background: "#fff", display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icon size={14} color="#2563eb" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modeling Pipeline */}
      <div className="card" style={{ padding: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Network size={15} color="#7c3aed" />
          </div>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
            Modeling Pipeline
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
          {pipeline.map(({ title, text, icon: Icon }, index) => (
            <div key={title} style={{
              border: "1px solid #e8edf3", borderRadius: 12, padding: 16,
              background: index === 3 ? "#eff6ff" : "#fff", minHeight: 160,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: index === 3 ? "#dbeafe" : "#f8fafc",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={15} color={index === 3 ? "#1d4ed8" : "#64748b"} />
                </div>
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#94a3b8" }}>0{index + 1}</span>
              </div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 7 }}>{title}</div>
              <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.65 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Considerations */}
      <div className="card" style={{ padding: 22, borderColor: "#fed7aa", background: "#fffaf5" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: "#ffedd5",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <AlertTriangle size={16} color="#d97706" />
          </div>
          <div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 16, color: "#9a3412", marginBottom: 7 }}>
              Deployment Considerations
            </h2>
            <p style={{ color: "#9a3412", fontSize: 13.5, lineHeight: 1.75 }}>
              Since the model is trained on digitally synthesized COMSOL data, performance in real-world 
              deployments may be affected by sensor noise, material uncertainties, and modeling 
              discrepancies. Although the proposed model demonstrates promising reconstruction performance 
              on simulation-generated datasets, real-world deployment may introduce additional uncertainties 
              such as sensor noise, environmental disturbances, material inconsistencies, and unmodeled 
              physical phenomena. Therefore, further validation and domain adaptation using real operational 
              measurements will be necessary to improve robustness and ensure reliable performance in 
              practical industrial environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
