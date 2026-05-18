// Simulated cylindrical heat distribution visualization
export default function HeatMapViz({ hotspot = 95, showScanLine = false, label = "Heat Distribution" }) {
  // Generate fake temperature grid (r x z)
  const rows = 20;
  const cols = 10;

  const getColor = (r, c, rows, cols) => {
    // Simulate hotspot near top-center
    const rNorm = r / rows;
    const cNorm = c / cols;
    const dist = Math.sqrt(Math.pow(rNorm - 0.25, 2) + Math.pow(cNorm - 0.5, 2));
    const val = Math.max(0, 1 - dist * 2.2);
    // Map val to temperature colors
    if (val > 0.85) return "#dc2626";
    if (val > 0.7) return "#f97316";
    if (val > 0.55) return "#facc15";
    if (val > 0.4) return "#34d399";
    if (val > 0.25) return "#0ea5e9";
    if (val > 0.1) return "#3b82f6";
    return "#1d4ed8";
  };

  const cellW = 16;
  const cellH = 9;
  const svgW = cols * cellW + 40;
  const svgH = rows * cellH + 20;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ position: "relative" }}>
        <svg width={svgW} height={svgH} style={{ borderRadius: 8, overflow: "hidden" }}>
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * cellW + 20}
                y={r * cellH}
                width={cellW - 1}
                height={cellH - 1}
                fill={getColor(r, c, rows, cols)}
                rx={1}
                opacity={0.9}
              />
            ))
          )}
          {/* r axis label */}
          <text x={6} y={svgH / 2} textAnchor="middle" fill="#94a3b8" fontSize={9}
            transform={`rotate(-90, 6, ${svgH / 2})`}>r</text>
          {/* z axis label */}
          <text x={svgW / 2} y={svgH - 2} textAnchor="middle" fill="#94a3b8" fontSize={9}>z</text>
        </svg>
        {showScanLine && <div className="scan-line" />}
      </div>

      {/* Color scale */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
          {hotspot}°C
        </span>
        <div className="heat-gradient" style={{ width: 12, height: rows * cellH, borderRadius: 6 }} />
        <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
          20°C
        </span>
      </div>
    </div>
  );
}
