"use client";
import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("https://backendgestaoobra.onrender.com/forgot-password", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao solicitar redefinição");
      setMessage(data.message);
      setEmail("");
      setTimeout(() => router.push("/login"), 10000);
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado ao enviar solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-4 px-4 sm:pt-4 pt-12 sm:ml-80 max-w-screen-lg">
      <section className="col-span-3 sm:col-span-4 pb-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Esqueci minha Senha</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="buttomForm"
          >
            {isLoading ? "Enviando..." : "Solicitar Redefinição"}
          </button>

          {message && <p className="text-green-600 bg-green-100 px-4 py-2 rounded mt-4">{message}</p>}
        </form>
      </section>
      </div>
      </div>
  );
}
