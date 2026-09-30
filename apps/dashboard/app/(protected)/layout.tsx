import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100dvh" }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            marginLeft: "var(--sidebar-width)",
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            background: "var(--surface-950)",
          }}
        >
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
