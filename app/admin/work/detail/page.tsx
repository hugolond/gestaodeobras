import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TelaCadastroObra from "@/components/TelaCadastroObra";

export default async function WorkPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  return <TelaCadastroObra session={session} />;
}
