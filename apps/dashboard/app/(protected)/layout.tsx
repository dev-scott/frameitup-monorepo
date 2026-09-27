import { Sidebar } from "@/components/layout/Sidebar";
import { ConvexClientProvider } from "@/lib/ConvexClientProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexClientProvider>
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
    </ConvexClientProvider>
  );
}
