import { useMemo, useState } from "react";

const SENSORS = [
  { label: "S1", node: "n-11855", r: 102.88, z: 1111.74, temp: 78.4, color: "#f97316", zone: "Upper hotspot" },
  { label: "S2", node: "n-16488", r: 97, z: 332, temp: 46.8, color: "#7c3aed", zone: "Lower reference" },
];

const MODE_MIN = 10;
const MODE_MAX = 52;

function gaussian(r, z, cr, cz, sr, sz, amp) {
  const dr = (r - cr) / sr;
  const dz = (z - cz) / sz;
  return Math.exp(-(dr * dr + dz * dz)) * amp;
}

function inThermalDomain(r, z) {
  if (r < 0 || r > 205 || z < 0 || z > 1580) return false;

  const leftWall = r <= 58 + 8 * Math.sin(z / 115);
  const upperBulge = z > 1380 && z < 1580 && r <= 78 - Math.abs(z - 1500) * 0.18;
  const core = r <= 100 + 40 * Math.exp(-Math.pow((z - 900) / 280, 2));
  const rightStepA = z > 740 && z < 860 && r <= 195;
  const rightStepB = z > 520 && z < 650 && r <= 185;
  const rightStepC = z > 450 && z < 600 && r > 105 && r <= 170;
  const lowerNose = z > 150 && z < 430 && r <= 105 - Math.abs(z - 290) * 0.15;
  const neck = z > 500 && z < 820 && r >= 58 && r <= 82;

  const cutoutA = z > 620 && z < 760 && r > 98 && r < 135;
  const cutoutB = z > 680 && z < 780 && r > 160 && r < 205;
  const cutoutC = z > 860 && z < 1070 && r > 112 && r < 155;

  return (leftWall || upperBulge || core || rightStepA || rightStepB || rightStepC || lowerNose || neck)
    && !cutoutA && !cutoutB && !cutoutC;
}

function modeIntensity(r, z) {
  const hotColumn = 38 * Math.exp(-r / 54) * (0.86 + 0.14 * Math.sin(z / 74));
  const coolPocket = gaussian(r, z, 118, 850, 58, 360, -22);
  const lowerCool = gaussian(r, z, 105, 520, 44, 210, -12);
  const upperHot = gaussian(r, z, 38, 1470, 38, 85, 10);
  const midHot = gaussian(r, z, 30, 1180, 34, 180, 7);
  const lowerHot = gaussian(r, z, 26, 380, 28, 120, 7);
  const ambient = 14 + (z / 1650) * 6;
  const value = ambient + hotColumn + upperHot + midHot + lowerHot + coolPocket + lowerCool;
  return Math.max(MODE_MIN, Math.min(MODE_MAX, value));
}

function generatePodNodes(compact) {
  const nodes = [];
  const zStep = compact ? 28 : 18;
  const rStep = compact ? 8 : 6;
  let id = 0;

  for (let z = 0; z <= 1580; z += zStep) {
    for (let r = 0; r <= 205; r += rStep) {
      const jitterR = ((id * 17) % 9 - 4) * 0.32;
      const jitterZ = ((id * 23) % 7 - 3) * 0.42;
      const rr = r + jitterR;
      const zz = z + jitterZ;
      if (!inThermalDomain(rr, zz)) continue;
      nodes.push({
        id: id++,
        r: rr,
        z: zz,
        value: modeIntensity(rr, zz),
      });
    }
  }

  return nodes;
}

function coolWarm(value) {
  const t = Math.max(0, Math.min(1, (value - MODE_MIN) / (MODE_MAX - MODE_MIN)));
  const stops = [
    [0, [55, 76, 194]],
    [0.18, [92, 135, 238]],
    [0.38, [167, 197, 253]],
    [0.56, [224, 211, 203]],
    [0.72, [246, 172, 135]],
    [0.88, [224, 79, 61]],
    [1, [185, 15, 45]],
  ];

  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }

  const f = (t - lo[0]) / (hi[0] - lo[0] || 1);
  const rgb = lo[1].map((c, i) => Math.round(c + f * (hi[1][i] - c)));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function SensorLegend({ compact, activeSensor, setActiveSensor }) {
  if (compact) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, width: "100%" }}>
      {SENSORS.map(sensor => (
        <button key={sensor.label}
          type="button"
          onMouseEnter={() => setActiveSensor(sensor)}
          onMouseLeave={() => setActiveSensor(null)}
          style={{
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          background: activeSensor?.label === sensor.label ? "#f8fafc" : "#fff",
          padding: "10px 12px",
          minWidth: 0,
          textAlign: "left",
          cursor: "pointer",
          boxShadow: activeSensor?.label === sensor.label ? `0 10px 26px ${sensor.color}22` : "none",
          transform: activeSensor?.label === sensor.label ? "translateY(-1px)" : "none",
          transition: "all 0.18s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <span style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: sensor.color,
              boxShadow: `0 0 0 4px ${sensor.color}22`,
              flex: "0 0 auto",
            }} />
            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 12 }}>{sensor.label}</span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10,
              color: "#64748b",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {sensor.node}
            </span>
          </div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
            r = {sensor.r} mm<br />
            z = {sensor.z} mm
          </div>
        </button>
      ))}
    </div>
  );
}

function PodModePlot({ compact = false, showScanLine = false, hotspot = 95, activeSensor, setActiveSensor }) {
  const nodes = useMemo(() => generatePodNodes(compact), [compact]);
  const W = compact ? 250 : 430;
  const H = compact ? 390 : 720;
  const pad = compact
    ? { l: 42, r: 70, t: 38, b: 44 }
    : { l: 88, r: 118, t: 70, b: 76 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const toX = r => pad.l + (r / 205) * plotW;
  const toY = z => pad.t + (1 - z / 1650) * plotH;
  const dotRadius = compact ? 2.2 : 3.2;
  const colorbarX = W - pad.r + (compact ? 16 : 28);
  const colorbarW = compact ? 18 : 34;
  const ticks = compact ? [0, 800, 1600] : [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600];
  const modeTicks = compact ? [15, 30, 45, 50] : [15, 20, 25, 30, 35, 40, 45, 50];
  const active = activeSensor;
  const tooltipW = compact ? 104 : 142;
  const tooltipH = compact ? 48 : 66;
  const tooltipX = active ? Math.min(W - pad.r - tooltipW - 4, Math.max(pad.l + 4, toX(active.r) + 12)) : 0;
  const tooltipY = active ? Math.min(pad.t + plotH - tooltipH - 4, Math.max(pad.t + 4, toY(active.z) - tooltipH - 10)) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Temperature Distribution at t_200"
      style={{ width: "100%", height: "100%", display: "block", background: "#fff" }}
    >
      <defs>
        <linearGradient id={compact ? "podGradientCompact" : "podGradient"} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="rgb(55, 76, 194)" />
          <stop offset="18%" stopColor="rgb(92, 135, 238)" />
          <stop offset="38%" stopColor="rgb(167, 197, 253)" />
          <stop offset="56%" stopColor="rgb(224, 211, 203)" />
          <stop offset="72%" stopColor="rgb(246, 172, 135)" />
          <stop offset="88%" stopColor="rgb(224, 79, 61)" />
          <stop offset="100%" stopColor="rgb(185, 15, 45)" />
        </linearGradient>
        <clipPath id={compact ? "podClipCompact" : "podClip"}>
          <rect x={pad.l} y={pad.t} width={plotW} height={plotH} />
        </clipPath>
      </defs>

      <text x={W / 2} y={compact ? 24 : 42} textAnchor="middle"
        fontFamily="Inter, Syne, sans-serif" fontSize={compact ? 17 : 30} fontWeight="800" fill="#050505">
        Temperature Distribution at t_200
      </text>

      <rect x={pad.l} y={pad.t} width={plotW} height={plotH} fill="#fff" stroke="#111827" strokeWidth={compact ? 1.2 : 1.8} />

      {!compact && (
        <g opacity="0.58">
          {[0, 100, 200].map(r => (
            <line key={`gx-${r}`} x1={toX(r)} x2={toX(r)} y1={pad.t} y2={pad.t + plotH}
              stroke="#d9d9d9" strokeWidth="1" strokeDasharray="5 5" />
          ))}
          {ticks.map(z => (
            <line key={`gy-${z}`} x1={pad.l} x2={pad.l + plotW} y1={toY(z)} y2={toY(z)}
              stroke="#d9d9d9" strokeWidth="1" strokeDasharray="5 5" />
          ))}
        </g>
      )}

      <g clipPath={`url(#${compact ? "podClipCompact" : "podClip"})`}>
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={toX(node.r)}
            cy={toY(node.z)}
            r={dotRadius}
            fill={coolWarm(node.value)}
            opacity={0.96}
          />
        ))}

        {SENSORS.map(sensor => {
          const isActive = active?.label === sensor.label;
          return (
          <g
            key={sensor.label}
            onMouseEnter={() => setActiveSensor(sensor)}
            onMouseLeave={() => setActiveSensor(null)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={toX(sensor.r)}
              cy={toY(sensor.z)}
              r={isActive ? (compact ? 13 : 18) : (compact ? 8 : 11)}
              fill={sensor.color}
              opacity={isActive ? "0.18" : "0.12"}
            />
            <circle
              cx={toX(sensor.r)}
              cy={toY(sensor.z)}
              r={isActive ? (compact ? 7 : 9) : (compact ? 5 : 6)}
              fill="none"
              stroke={sensor.color}
              strokeWidth={isActive ? 2.2 : 1.4}
              opacity="0.85"
            />
            <circle cx={toX(sensor.r)} cy={toY(sensor.z)} r={compact ? 3.5 : 5} fill={sensor.color} stroke="#fff" strokeWidth="1.5" />
            {!compact && (
              <text x={toX(sensor.r) + 11} y={toY(sensor.z) - 9}
                fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" fill={sensor.color}>
                {sensor.label}
              </text>
            )}
          </g>
          );
        })}

        {showScanLine && (
          <line x1={pad.l} x2={pad.l + plotW} y1={toY(520)} y2={toY(520)}
            stroke="#22c55e" strokeWidth={compact ? 1.4 : 2} opacity="0.82">
            <animate attributeName="y1" values={`${pad.t};${pad.t + plotH};${pad.t}`} dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="y2" values={`${pad.t};${pad.t + plotH};${pad.t}`} dur="2.6s" repeatCount="indefinite" />
          </line>
        )}
      </g>

      {[0, 100, 200].map(r => (
        <g key={r}>
          <line x1={toX(r)} x2={toX(r)} y1={pad.t + plotH} y2={pad.t + plotH + 5} stroke="#111827" strokeWidth="1" />
          <text x={toX(r)} y={pad.t + plotH + (compact ? 18 : 28)} textAnchor="middle"
            fontFamily="Inter, sans-serif" fontSize={compact ? 10 : 16} fill="#111827">{r}</text>
        </g>
      ))}

      {ticks.map(z => (
        <g key={z}>
          <line x1={pad.l - 5} x2={pad.l} y1={toY(z)} y2={toY(z)} stroke="#111827" strokeWidth="1" />
          <text x={pad.l - 8} y={toY(z) + 4} textAnchor="end"
            fontFamily="Inter, sans-serif" fontSize={compact ? 9 : 15} fill="#111827">{z}</text>
        </g>
      ))}

      <text x={pad.l + plotW / 2} y={H - (compact ? 7 : 18)} textAnchor="middle"
        fontFamily="Inter, sans-serif" fontSize={compact ? 13 : 22} fill="#050505">
        Radial Coordinate r (mm)
      </text>
      <text x={compact ? 13 : 32} y={pad.t + plotH / 2} textAnchor="middle"
        transform={`rotate(-90 ${compact ? 13 : 32} ${pad.t + plotH / 2})`}
        fontFamily="Inter, sans-serif" fontSize={compact ? 13 : 22} fill="#050505">
        Axial Coordinate z (mm)
      </text>

      <rect x={colorbarX} y={pad.t} width={colorbarW} height={plotH}
        fill={`url(#${compact ? "podGradientCompact" : "podGradient"})`}
        stroke="#111827" strokeWidth={compact ? 1 : 2} />

      {modeTicks.map(v => {
        const y = pad.t + (1 - v / MODE_MAX) * plotH;
        return (
          <g key={v}>
            <line x1={colorbarX + colorbarW} x2={colorbarX + colorbarW + 6} y1={y} y2={y} stroke="#111827" strokeWidth="1" />
            <text x={colorbarX + colorbarW + 11} y={y + 4}
              fontFamily="Inter, sans-serif" fontSize={compact ? 10 : 17} fill="#050505">
              {v}
            </text>
          </g>
        );
      })}

      {!compact && (
        <text x={W - 10} y={pad.t + plotH / 2} textAnchor="middle"
          transform={`rotate(-90 ${W - 10} ${pad.t + plotH / 2})`}
          fontFamily="Inter, sans-serif" fontSize="20" fill="#050505">
          Temperature (°C)
        </text>
      )}

      <g transform={`translate(${pad.l + 8}, ${pad.t + 12})`}>
        <rect width={compact ? 66 : 96} height={compact ? 20 : 26} rx={compact ? 8 : 10} fill="rgba(15,23,42,0.82)" />
        <circle cx={compact ? 12 : 15} cy={compact ? 10 : 13} r={compact ? 3 : 4}
          fill={hotspot >= 95 ? "#f97316" : "#22c55e"} />
        <text x={compact ? 21 : 27} y={compact ? 14 : 18}
          fontFamily="Inter, sans-serif" fontSize={compact ? 8 : 11} fontWeight="700" fill="#fff">
          t_200
        </text>
      </g>

      {active && !compact && (
        <g pointerEvents="none">
          <line
            x1={toX(active.r)}
            x2={tooltipX}
            y1={toY(active.z)}
            y2={tooltipY + tooltipH / 2}
            stroke={active.color}
            strokeWidth="1.4"
            strokeDasharray="4 3"
            opacity="0.75"
          />
          <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="11"
            fill="#0f172a" opacity="0.94" />
          <text x={tooltipX + 12} y={tooltipY + 18}
            fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800" fill="#fff">
            {active.label} · {active.zone}
          </text>
          <text x={tooltipX + 12} y={tooltipY + 36}
            fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#cbd5e1">
            {active.node} · {active.temp.toFixed(1)} C
          </text>
          <text x={tooltipX + 12} y={tooltipY + 52}
            fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#93c5fd">
            r {active.r} / z {active.z}
          </text>
        </g>
      )}
    </svg>
  );
}

function PodSimulationPanel({ hotspot = 95, showScanLine = false, compact = false, interactive = false }) {
  const [activeSensor, setActiveSensor] = useState(null);
  const maxWidth = compact ? 210 : interactive ? 560 : 340;
  const panelHeight = compact ? 330 : interactive ? 760 : 520;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 8 : 12, width: "100%" }}>
      <div style={{
        width: "100%",
        maxWidth,
        height: panelHeight,
        borderRadius: compact ? 10 : 14,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: compact ? "none" : "0 14px 40px rgba(15, 23, 42, 0.12)",
      }}>
        <PodModePlot
          compact={compact}
          showScanLine={showScanLine}
          hotspot={hotspot}
          activeSensor={activeSensor}
          setActiveSensor={setActiveSensor}
        />
      </div>

      <SensorLegend compact={compact} activeSensor={activeSensor} setActiveSensor={setActiveSensor} />

      {!compact && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          color: "#64748b",
          fontSize: 12,
        }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>Frame: t_200</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>Peak: {Number(hotspot).toFixed(1)} C</span>
          <span style={{ color: "#cbd5e1" }}>|</span>
          <span>Temperature field</span>
        </div>
      )}
    </div>
  );
}

export function InteractiveSensorMap({ hotspot = 95, showScanLine = false }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(300px, 480px) minmax(240px, 1fr)",
      gap: 24,
      alignItems: "center",
    }}>
      <PodSimulationPanel hotspot={hotspot} showScanLine={showScanLine} interactive />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc", padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, marginBottom: 8 }}>
            Temperature Distribution at t_200
          </div>
          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
            Generated as a COMSOL-style r-z scatter field with the same visual language as the project plots: dashed grid, temperature colorbar, and sensor inspection.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {[
            ["Field", "17k nodes"],
            ["Modes", "4 retained"],
            ["Energy", "99.99%"],
            ["Input", "2 sensors"],
          ].map(([label, value]) => (
            <div key={label} className="stat-card" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{label}</div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, color: "#0f172a", marginTop: 4 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SensorMapViz({ hotspot = 95, showScanLine = false, compact = false }) {
  return (
    <PodSimulationPanel hotspot={hotspot} showScanLine={showScanLine} compact={compact} />
  );
}
