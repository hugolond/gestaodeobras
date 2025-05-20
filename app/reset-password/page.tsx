"use client";
import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://backendgestaoobra.onrender.com/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erro ao redefinir senha");

      toast.success("Senha redefinida com sucesso!");
      setPassword("");
      setConfirmPassword("");
      setMessage("Redefinição concluída. Redirecionando para login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      toast.error(err.message || "Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 px-4 sm:pt-4 pt-12 sm:ml-80 max-w-screen-lg">
      <section className="col-span-3 sm:col-span-4 pb-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Redefinir Senha</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="buttomForm"
          >
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
          {message && <p className="text-green-600 bg-green-100 px-4 py-2 rounded mt-4">{message}</p>}
        </form>
      </section>
      </div>
    </div>
  );
}