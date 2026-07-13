import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminMobileBar from "@/components/admin/AdminMobileBar";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-light lg:flex">
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminNav email={session.email} />
        </div>
      </div>
      <AdminMobileBar />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
