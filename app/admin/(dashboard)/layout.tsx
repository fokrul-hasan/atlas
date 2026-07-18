import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="wrap">
      <nav
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          marginBottom: 50,
          paddingBottom: 20,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/admin" style={{ fontFamily: "var(--font-fraunces)", fontSize: 20 }}>
          Dashboard
        </Link>
        <Link href="/admin/posts/new" className="cta-link" style={{ fontSize: 14 }}>
          New post
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <LogoutButton />
        </div>
      </nav>
      {children}
    </main>
  );
}
