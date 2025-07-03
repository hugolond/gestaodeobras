import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardUnificado from "@/components/DashboardUnificado";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  return <DashboardUnificado session={session} />;
}
