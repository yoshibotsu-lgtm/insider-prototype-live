// Dashboard.jsx — Main analytics dashboard
const { useState: useDashState } = React;

function TwoLineChart({ data1, data2, color1 = "#5B4CF5", color2 = "#a78bfa", w = 300, h = 72 }) {
  const all = [...data1, ...data2];
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const pts = (data) => data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 6) - 3,
  ]);
  const path = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = (pts) => `${path(pts)} L${w},${h} L0,${h} Z`;
  const p1 = pts(data1), p2 = pts(data2);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={area(p1)} fill={color1} fillOpacity={0.07} />
      <path d={path(p1)} stroke={color1} strokeWidth="1.5" fill="none" />
      <path d={path(p2)} stroke={color2} strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
    </svg>
  );
}

function BarGroup({ data1, data2, labels, c1 = "#d1d5db", c2 = "#5B4CF5", w = 240, h = 110 }) {
  const maxV = Math.max(...data1, ...data2);
  const bw = 20, gap = 5, gGap = 22, gw = bw * 2 + gap;
  const totalW = data1.length * (gw + gGap) - gGap;
  const sc = (v) => (v / maxV) * (h - 24);
  const yTicks = [2, 3, 4, 5, 6].map(v => v / 100);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {yTicks.map(t => {
        const y = h - 18 - sc(t);
        return (
          <g key={t}>
            <line x1={30} x2={w} y1={y} y2={y} stroke="#f0f0f2" strokeWidth="1" />
            <text x={26} y={y + 3} textAnchor="end" fontSize={8} fill="#c0c0c8">{(t * 100).toFixed(0)}%</text>
          </g>
        );
      })}
      {data1.map((v1, i) => {
        const v2 = data2[i];
        const x = 32 + i * (gw + gGap) + (totalW > w - 32 ? 0 : (w - 32 - totalW) / 2);
        return (
          <g key={i}>
            <rect x={x} y={h - 18 - sc(v1)} width={bw} height={sc(v1)} fill={c1} rx={2} />
            <rect x={x + bw + gap} y={h - 18 - sc(v2)} width={bw} height={sc(v2)} fill={c2} rx={2} />
            {labels && <text x={x + gw / 2} y={h - 4} textAnchor="middle" fontSize={8.5} fill="#aaa">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function MobileChart({ data, w = 288, h = 56 }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * (h - 4) - 2]);
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={areaPath} fill="#f59e0b" fillOpacity={0.1} />
      <path d={linePath} stroke="#f59e0b" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

const rev1 = [10.2, 10.5, 10.1, 10.8, 10.6, 11.0, 10.7, 10.9, 11.2, 10.8, 11.5, 11.1, 10.9, 11.3];
const rev2 = [9.8, 9.6, 10.0, 9.9, 10.2, 10.1, 10.3, 10.0, 10.4, 10.1, 10.6, 10.2, 10.5, 10.8];
const mob  = [800, 850, 780, 900, 920, 870, 950, 980, 930, 960, 1000, 940, 970, 1010];

function StatRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f3f5", fontSize: 11.5 }}>
      <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 3 }}>
        {label}
        <span style={{ fontSize: 9, color: "#d1d5db" }}>ⓘ</span>
      </span>
      <span style={{ color: "#111", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function DashboardView({ onOpenAssistant, tweaks = {} }) {
  const accent       = tweaks.accentColor    || "#5B4CF5";
  const userName     = tweaks.userName       || "Yosun";
  const showCTA      = tweaks.showCopilotCTA !== false;
  const bg           = tweaks.dashboardBg    || "#f4f4f6";

  const [crTab, setCrTab] = useDashState("Conversion Rates");
  const [mobTab, setMobTab] = useDashState("App Push");

  const tabActive = { color: accent, borderBottom: `2px solid ${accent}`, fontWeight: 600 };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "18px 20px", background: bg }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: "#0f0f10", marginBottom: 4 }}>
            Good Evening, {userName}!
          </h1>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            It's a good day to boost your business.{" "}
            <span style={{ color: accent, cursor: "pointer" }}>You can check the latest insights from your campaigns here</span>
            {" "}and{" "}
            <span style={{ color: accent, cursor: "pointer" }}>create new campaigns using the menu</span>.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>26.03.2026 — 26.04.2026</span>
          <button style={dsh.ghostBtn}>📅</button>
          <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#374151", cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ accentColor: accent }} />
            Compare with Previous Period
          </label>
        </div>
      </div>

      {/* Copilot CTA */}
      {showCTA && (
        <div
          onClick={onOpenAssistant}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.92"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          style={{
            background: `linear-gradient(130deg, ${accent} 0%, #7c3aed 100%)`,
            borderRadius: 8, padding: "11px 16px", marginBottom: 14,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
            boxShadow: `0 2px 10px ${accent}44`,
            transition: "opacity 0.15s",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "white",
            }}>✦</div>
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 13, marginBottom: 1 }}>Copilot is ready</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11.5 }}>Ask me anything — segments, insights, campaigns, copy</div>
            </div>
          </div>
          <button style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
            color: "white", borderRadius: 6, padding: "6px 14px",
            cursor: "pointer", fontSize: 11.5, fontWeight: 600, pointerEvents: "none",
          }}>Open Copilot →</button>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 12 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* OnSite Campaigns */}
          <div style={dsh.card}>
            <div style={dsh.cardHead}>
              <span style={dsh.label}>ONSITE CAMPAIGNS WITH CONTROL GROUP ANALYTICS</span>
              <div style={{ display: "flex", gap: 3 }}>
                <button style={dsh.iconBtn}>⋮⋮</button>
                <button style={dsh.iconBtn}>⣿</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 12 }}>
              {/* Revenue */}
              <div style={{ paddingRight: 18, borderRight: "1px solid #f0f0f3" }}>
                <div style={dsh.metricLabel}>INCREMENTAL REVENUE <span style={dsh.info}>ⓘ</span></div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "3px 0 6px" }}>
                  <span style={dsh.bigNum}>513,796 USD</span>
                  <span style={dsh.up}>↑ 4.7%</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                  {["Day", "Month"].map(t => (
                    <button key={t} style={{ ...dsh.tab, ...(t === "Day" ? tabActive : {}) }}>{t}</button>
                  ))}
                </div>
                <div style={{ fontSize: 9.5, color: "#aaa", marginBottom: 5 }}>
                  ℹ Only the data of the last 7 days is displayed in this chart.
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 9.5, color: "#aaa", marginBottom: 4 }}>
                  <span><span style={{ color: accent }}>──</span> 27.04.2026–28.04.2026</span>
                  <span><span style={{ color: "#a78bfa" }}>- -</span> 16.04.2027–21.04.2027</span>
                </div>
                <TwoLineChart data1={rev1} data2={rev2} color1={accent} color2="#a78bfa" w={260} h={72} />
              </div>

              {/* Conversion Rate */}
              <div style={{ paddingLeft: 18 }}>
                <div style={dsh.metricLabel}>CONVERSION RATE UPLIFT <span style={dsh.info}>ⓘ</span></div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "3px 0 6px" }}>
                  <span style={dsh.bigNum}>40.19%</span>
                  <span style={dsh.up}>↑ 14.8%</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  {["Conversion Rates", "Monthly Conversion Rates"].map(t => (
                    <button key={t} onClick={() => setCrTab(t)}
                      style={{ ...dsh.tab, ...(t === crTab ? tabActive : {}), fontSize: 10.5 }}>{t}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 4, fontSize: 9.5, color: "#aaa" }}>
                  <span><span style={{ display: "inline-block", width: 8, height: 8, background: "#d1d5db", borderRadius: 1, marginRight: 3 }}></span>Control CR</span>
                  <span><span style={{ display: "inline-block", width: 8, height: 8, background: accent, borderRadius: 1, marginRight: 3 }}></span>Insider CR</span>
                </div>
                <BarGroup data1={[0.032, 0.035, 0.031]} data2={[0.048, 0.051, 0.046]}
                  labels={["22.02–25.03", "26.03–28.04"]} c1="#d1d5db" c2={accent} w={240} h={110} />
              </div>
            </div>

            {/* All OnSite */}
            <div style={{ marginTop: 12, padding: "9px 12px", background: "#f9f9fb", borderRadius: 6, border: "1px solid #ebebef", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "#ebebef", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111", marginBottom: 2 }}>All OnSite Analytics</div>
                  <div style={{ fontSize: 11.5, color: "#6b7280" }}>
                    You can get detailed{" "}
                    <span style={{ color: accent }}>insights about all your OnSite campaigns</span>
                    {" "}with and without control groups, at your OnSite Analytics.
                  </div>
                </div>
              </div>
              <button style={{ background: "white", border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 13px", fontSize: 11.5, fontWeight: 500, cursor: "pointer", color: "#374151", whiteSpace: "nowrap" }}>
                Check OnSite Analytics
              </button>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {["WEB PUSH ANALYTICS", "EMAIL ANALYTICS", "ARCHITECT ANALYTICS"].map(t => (
              <div key={t} style={{ ...dsh.card, minHeight: 100 }}>
                <div style={dsh.cardHead}>
                  <span style={dsh.label}>{t}</span>
                  <button style={dsh.iconBtn}>⣿</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Mobile App Analytics */}
        <div style={dsh.card}>
          <div style={dsh.cardHead}>
            <span style={dsh.label}>MOBILE APP ANALYTICS</span>
            <button style={dsh.iconBtn}>⣿</button>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 8, borderBottom: "1px solid #f0f0f3", marginBottom: 10 }}>
            {["App Push", "Opt In", "App Templates", "General Data"].map(t => (
              <button key={t} onClick={() => setMobTab(t)}
                style={{ ...dsh.tab, ...(t === mobTab ? tabActive : {}), fontSize: 10.5, padding: "5px 6px" }}>{t}</button>
            ))}
          </div>

          <div style={dsh.metricLabel}>Click-Through Revenue <span style={dsh.info}>ⓘ</span></div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "3px 0 10px" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>2,513,071 USD</span>
            <span style={dsh.up}>↑ 8.6%</span>
          </div>

          <div style={{ fontSize: 9.5, color: "#aaa", marginBottom: 4 }}>
            <span style={{ color: "#f59e0b" }}>──</span> 20.03.76–16.04.70%{"  "}<span style={{ color: "#fb923c" }}>- -</span> 22.07.70–25.03.70%
          </div>
          <MobileChart data={mob} w={278} h={54} />

          <div style={{ marginTop: 10, display: "flex", flexDirection: "column" }}>
            <StatRow label="Delivered" value="9,044,354" />
            <StatRow label="Open Rate" value="27.19% (2,459,159)" />
            <StatRow label="View-Through CR" value="24.62% (2,226,714)" />
            <StatRow label="Click-Through CR" value="13.68% (1,237,267)" />
          </div>
        </div>
      </div>
    </div>
  );
}

const dsh = {
  card: { background: "white", borderRadius: 8, padding: "14px 16px", border: "1px solid #ebebef" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 10.5, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em" },
  metricLabel: { fontSize: 10.5, color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 },
  info: { fontSize: 9.5, color: "#d1d5db" },
  bigNum: { fontSize: 20, fontWeight: 700, color: "#111" },
  up: { fontSize: 11.5, color: "#22c55e", fontWeight: 600 },
  tab: { fontSize: 11.5, padding: "4px 0", border: "none", background: "none", color: "#9ca3af", borderBottom: "2px solid transparent", cursor: "pointer", fontWeight: 400, marginRight: 10, fontFamily: "inherit" },
  iconBtn: { background: "none", border: "none", color: "#d1d5db", cursor: "pointer", fontSize: 11, padding: "2px 4px" },
  ghostBtn: { background: "none", border: "1px solid #e5e7eb", borderRadius: 4, padding: "3px 7px", cursor: "pointer", fontSize: 11 },
};

Object.assign(window, { DashboardView });
