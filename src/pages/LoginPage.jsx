import { useState } from "react";
import { Thermometer, Lock, Mail, Eye, EyeOff, ArrowRight, Zap, Shield, Activity } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex" }}>
      {/* Left panel */}
      <div style={{
        width: "50%", background: "linear-gradient(145deg, #060f22 0%, #0d1f44 55%, #1a3a7a 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 56px", position: "relative", overflow: "hidden"
      }} className="hidden lg:flex">
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px", opacity: 1,
        }} />
        <div style={{
          position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -60, width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Thermometer size={19} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 17, color: "#fff" }}>Thermal AI</div>
              <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: "0.08em" }}>POD · LSTM MODEL</div>
            </div>
          </div>

          <div className="animate-fade-up">
            <h1 style={{
              fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 40,
              color: "#fff", lineHeight: 1.12, marginBottom: 16
            }}>
              Real-Time Thermal<br />
              <span style={{ color: "#60a5fa" }}>Field Reconstruction</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14.5, lineHeight: 1.75, maxWidth: 380 }}>
              Reduced-order modeling framework that reconstructs full spatiotemporal temperature 
              distributions from sparse sensor data using POD and LSTM networks.
            </p>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: Zap, label: "Sub-second reconstruction", desc: "Full field from 2 sensors" },
            { icon: Activity, label: "Mean error < 2.5 °C", desc: "Production-validated accuracy" },
            { icon: Shield, label: "Live monitoring", desc: "Configurable alert thresholds" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,255,255,0.04)", borderRadius: 11,
              border: "1px solid rgba(255,255,255,0.07)", padding: "12px 16px"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(37,99,235,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={15} color="#60a5fa" />
              </div>
              <div>
                <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{label}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1, fontSize: 11, color: "#334155" }}>
          COMSOL · PCA/POD · LSTM · v2.4.1
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: "100%", maxWidth: 360 }} className="animate-fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Thermometer size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Thermal AI</div>
              <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700 }}>POD · LSTM MODEL</div>
            </div>
          </div>

          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 24, color: "#0f172a", marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ color: "#64748b", fontSize: 13.5, marginBottom: 28 }}>
            Sign in to access the monitoring dashboard.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="email" className="input-field" style={{ paddingLeft: 38 }}
                  placeholder="engineer@thermal.ai" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type={showPass ? "text" : "password"} className="input-field"
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#b91c1c", fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, marginTop: 4 }}>
              {loading ? (
                <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
              Demo: any email + password
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
