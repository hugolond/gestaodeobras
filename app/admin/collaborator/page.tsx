import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendarioColaboradorMobile from "@/components/TelaCadastroColaborador";

export default async function CollaboratorPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  return <CalendarioColaboradorMobile session={session} />;
}
