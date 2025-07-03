import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TelaCadastroPagamento from "@/components/TelaCadastroPagamento";

export default async function PaymentPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  return <TelaCadastroPagamento session={session} />;
}
