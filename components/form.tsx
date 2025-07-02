"use client";
import React, { useState } from "react";
import { TEInput } from "tw-elements-react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [termoAceito, setTermoAceito] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (type === "register" && !termoAceito) {
          toast.error("Você deve aceitar os termos para continuar.");
          return;
        }

        setLoading(true);

        if (type === "login") {
          const result = await signIn("credentials", {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
          });
          console.log('Login result:', result); // 👈 isso vai ajudar muito no devtools
          if (!result) {
            setLoading(false);
            toast.error("Erro inesperado no login.");
            return;
          }

          if (result.error) {
            setLoading(false);
            toast.error(result.error);
          } else {
            router.push("/admin");
          }
        } else {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: e.currentTarget.username.value,
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
              departament: "NA",
              emailmanager: "NA",
            }),
          });

          setLoading(false);

          if (res.status === 200) {
            toast.success("Conta criada com sucesso! Redirecionando para login...");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            const { error } = await res.json();
            toast.error(error);
          }
        }
      }}
      className="w-full max-w-md mx-auto p-6 rounded-lg bg-white shadow-xl space-y-6"
    >
      <h2 className="text-center text-gray-500 text-2xl font-bold">
        {type === "login" ? "Entrar no Sistema" : "Criar Conta"}
      </h2>

      {type === "register" && (
        <TEInput
          id="username"
          name="username"
          type="text"
          label="Nome Completo"
          required
          className="text-black"
        />
      )}

      <TEInput
        id="email"
        name="email"
        type="email"
        label="E-mail"
        required
        className="text-black"
      />

      <TEInput
        id="password"
        name="password"
        type="password"
        label="Senha"
        required
        className="text-black"
      />

      {/* Checkbox de aceite */}
      {type === "register" && (
        <div className="flex items-start text-sm text-gray-600 mt-2">
          <input
            id="termos"
            name="termos"
            type="checkbox"
            checked={termoAceito}
            onChange={(e) => setTermoAceito(e.target.checked)}
            className="mt-1 mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="termos" className="leading-snug">
            Li e aceito os{" "}
            <a
              href="/docs/termo-aceite.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium hover:underline"
            >
              Termos de Uso e Política de Privacidade
            </a>
            .
          </label>
        </div>
      )}

      {/* Botão ou aviso leve */}
      {type === "login" || termoAceito ? (
        <button
          disabled={loading}
          className={`${
            loading
              ? "bg-gray-400 text-white"
              : "bg-[#1B263B] hover:bg-[#415A77] text-white"
          } flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition duration-300`}
        >
          {loading ? (
            <LoadingDots color="#FFF" />
          ) : (
            <span>{type === "login" ? "Entrar" : "Criar Conta"}</span>
          )}
        </button>
      ) : (
        <div className="text-sm text-gray-500 text-center border border-gray-200 rounded-md px-4 py-2 bg-gray-50 flex items-center justify-center gap-2">
        ⚠️ Para criar sua conta, é necessário aceitar os Termos de Uso.
      </div>
      )}

      {/* Link auxiliar */}
      <p className="text-center text-sm text-[#A9B8C9]">
        {type === "login" ? (
          <>
            Esqueceu sua senha?{" "}
            <Link href="/forgot-password" className="font-semibold text-[#0D1B2A] hover:underline">
              Clique aqui
            </Link>
            .
          </>
        ) : (
          <>
            Já possui uma conta?{" "}
            <Link href="/login" className="font-semibold text-[#778DA9] hover:underline">
              Entre
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
