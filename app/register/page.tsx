import Form from "@/components/form";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (    
    <main className="min-h-screen bg-white font-sans">
      {/* Topo com logo */}
    <header className="w-full px-8 py-6">
        <Link href="/">
          <Image src="/logo_hd.svg" alt="Logo Obra Fácil" width={360} height={140} />
        </Link>
    </header>
    <section className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Crie sua conta</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Crie sua conta para acessar todos os nossos serviços e aproveitar as melhores ferramentas. É rápido e fácil!
          </p>
          <Form type="register" />
           </div>
          <div className="text-center">
          <Image
            src="/logo_hd_r.svg" // substitua pela sua imagem real
            alt="Imagem do sistema"
            width={480}
            height={300}
            className="mx-auto"
          />
          </div>
        </div>
    </section>
    </main>
  );
}
