"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const logoutAndRedirect = async () => {
      try {
        await fetch("/api/logout"); // Limpa cookies no servidor
        setTimeout(() => {
          router.push("/login"); // Redireciona no client
        }, 1000);
      } catch (e) {
        console.error("Erro ao limpar cookies:", e);
      }
    };

    logoutAndRedirect();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tudo pronto!</h2>
        <p className="text-gray-700">Redirecionando para o login...</p>
      </div>
    </div>
  );
}
