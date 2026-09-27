export default function Loading() {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Topbar skeleton */}
      <div
        style={{
          height: 64,
          background: "var(--surface-900)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 2rem",
          gap: "1rem",
        }}
      >
        <div className="skeleton" style={{ width: 160, height: 22 }} />
      </div>

      {/* KPI row skeleton */}
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, marginBottom: "1.25rem" }} />
              <div className="skeleton" style={{ width: "60%", height: 30, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: "80%", height: 14 }} />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", height: 340 }}>
            <div className="skeleton" style={{ width: 160, height: 22, marginBottom: 24 }} />
            <div className="skeleton" style={{ width: "100%", height: 260, borderRadius: 12 }} />
          </div>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div className="skeleton" style={{ width: 120, height: 22, marginBottom: 16 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8, borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
