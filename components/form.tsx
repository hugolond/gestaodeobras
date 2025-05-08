"use client";
import React from "react";
import {TEInput} from "tw-elements-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  let option_id = [0,1,2,3]
  let options = [
    {name: 'Comercial'}, 
    {name: 'Logística'},
    {name: 'Atendimento'},
    {name: 'Tecnologia'}];
  let selectedOptionId = 0 
  
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
            // @ts-ignore
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
          fetchComToken("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: e.currentTarget.username.value,
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
              departament : "NA",
              emailmanager : "NA"
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
      className="w-full space-y-4 bg-gray-50"
    >
      {type === "register"? ( 
      <div>
            <TEInput
              id="username"
              name="username"
              type="text"
              label = "Nome Completo"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm" />
        </div>) :(<></>)
        }
      <div>
        <TEInput
          id="email"
          name="email"
          type="email"
          label = "E-mail"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <TEInput
          id="password"
          name="password"
          type="password"
          label="Senha"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {type === "register" ? (
        <></>
      ):(<div></div>)}
      <button
        disabled={loading}
        className={`${
          loading
            ? "cursor-not-allowed border-gray-200 bg-gray-100"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p>{type === "login" ? "Entrar" : "Criar Conta"}</p>
        )}
      </button>
      {type === "login" ? (
        <p className="text-center text-sm text-gray-600">
          Ainda não possui cadastro?{" "}
          <Link href="/register" className="font-semibold text-gray-800">
            Registre-se
          </Link>{" "}
          aqui.
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link href="/login" className="font-semibold text-gray-800">
            Entre
          </Link>{" "}
          aqui.
        </p>
      )}
    </form>
  );
}
