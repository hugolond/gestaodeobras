"use client";
import React from "react";
import { TEInput } from "tw-elements-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);

        if (type === "login") {
          signIn("credentials", {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
          }).then(({ error }) => {
            if (error) {
              setLoading(false);
              toast.error(error);
            } else {
              router.refresh();
              router.push("/admin");
            }
          });
        } else {
          fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.currentTarget.username.value,
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
              departament: "NA",
              emailmanager: "NA",
            }),
          }).then(async (res) => {
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
          });
        }
      }}
      className="w-full max-w-md mx-auto p-6 rounded-lg bg-[#0D1B2A] shadow-xl space-y-6"
    >
      <h2 className="text-center text-white text-2xl font-bold">
        {type === "login" ? "Entrar no Sistema" : "Criar Conta"}
      </h2>

      {type === "register" && (
        <TEInput
          id="username"
          name="username"
          type="text"
          label="Nome Completo"
          required
          className="text-white"
        />
      )}

      <TEInput
        id="email"
        name="email"
        type="email"
        label="E-mail"
        required
        className="text-white placeholder-white"
      />

      <TEInput
        id="password"
        name="password"
        type="password"
        label="Senha"
        required
        className="text-white"
      />

      <button
        disabled={loading}
        className={`${
          loading
            ? "bg-gray-400 text-white"
            : "bg-[#1B263B] hover:bg-[#415A77] text-white"
        } flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition duration-300`}
      >
        {loading ? <LoadingDots color="#FFF" /> : <span>{type === "login" ? "Entrar" : "Criar Conta"}</span>}
      </button>

      <p className="text-center text-sm text-[#A9B8C9]">
        {type === "login" ? (
          <>
            Ainda não possui cadastro?{' '}
            <Link href="/register" className="font-semibold text-[#778DA9] hover:underline">
              Registre-se
            </Link>
            .
          </>
        ) : (
          <>
            Já possui uma conta?{' '}
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