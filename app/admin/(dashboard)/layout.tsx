import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  const userId = data.claims.sub;

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id, role, is_active")
    .eq("user_id", userId)
    .maybeSingle();

  if (
    adminError ||
    !admin ||
    !admin.is_active ||
    admin.role !== "admin"
  ) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-950">
      <AdminMobileHeader />

      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}