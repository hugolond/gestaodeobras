"use client";
export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import dynamicImport from "next/dynamic";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { Invoiced } from "./invoiced";
import logoOk from "../../../assets/ok.svg";
import { getSession } from "next-auth/react";
import { fetchComToken } from "@/lib/fetchComToken";

// Dynamic imports (SSR desabilitado)
const TEInput = dynamicImport(() => import("tw-elements-react").then(m => m.TEInput), { ssr: false });
const TEAlert = dynamicImport(() => import("tw-elements-react").then(m => m.TEAlert), { ssr: false });
const TESelect = dynamicImport(() => import("tw-elements-react").then(m => m.TESelect), { ssr: false });
const Image = dynamicImport(() => import("next/image"), { ssr: false });

export default function PageConsultaStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [playload, setPlayload] = useState<Invoiced | null>(null);
  const [selectValue, setSelectValue] = useState(1);
  const [obraConcluida, setObraConcluida] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setPlayload(null);
    try {
      const session = await getSession();
      const token = session?.token;

      const formData = new FormData(event.currentTarget);
      const payload: any = {
        nome: formData.get("nomeObra"),
        endereco: formData.get("endereco"),
        bairro: formData.get("bairro"),
        area: formData.get("area"),
        tipo: selectValue,
        casagerminada: (event.currentTarget.elements.namedItem("flexSwitchCasaGeminada") as HTMLInputElement).checked,
        status: true,
        datainicioobra: formData.get("datainicioobra"),
        datafinalobra: formData.get("datainicioobra"),
      };
      if (obraConcluida) {
        payload.datafinalobra = formData.get("datafinalobra");
        payload.status = false;
      }

      const response = await fetchComToken("https://backendgestaoobra.onrender.com/api/obra/v1/sendnewobra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Erro ao cadastrar obra.");
      } else {
        setPlayload(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar o formulário.");
    } finally {
      setIsLoading(false);
    }
  }

  const tipoOptions = [
    { text: "Casa térrea", value: 1 },
    { text: "2 Andares", value: 2 },
    { text: "3 Andares", value: 3 },
  ];

  return (
    <DefautPage>
      <div className="col-span-3 sm:col-span-4">
        <label htmlFor="cadastroobra" className="titlePage">Cadastro Obra</label>

        <form onSubmit={onSubmit} className="blockInput">
          <TEInput required type="text" id="nomeObra" name="nomeObra" label="Obra" />
          <TEInput required type="text" id="endereco" name="endereco" label="Endereço" />
          <TEInput required type="text" id="bairro" name="bairro" label="Bairro" />
          <TEInput required type="text" id="area" name="area" label="Área da Obra (m²)" />
          <TESelect data={tipoOptions} value={selectValue} onValueChange={(e: any) => setSelectValue(e.value)} />

          <div className="my-2">
            <input type="checkbox" id="flexSwitchCasaGeminada" role="switch" />
            <label htmlFor="flexSwitchCasaGeminada" className="ml-2">Casa Geminada</label>
          </div>

          <TEInput required type="date" id="datainicioobra" name="datainicioobra" label="Data de Início da Obra" />

          <div className="my-2">
            <input type="checkbox" id="obraConcluida" checked={obraConcluida} onChange={() => setObraConcluida(!obraConcluida)} />
            <label htmlFor="obraConcluida" className="ml-2">Obra concluída</label>
          </div>

          {obraConcluida && (
            <TEInput required type="date" id="datafinalobra" name="datafinalobra" label="Data Final da Obra" />
          )}

          <button type="submit" disabled={isLoading} className="buttomForm">
            {isLoading ? "Enviando..." : "Registrar"}
          </button>
        </form>

        <TEAlert staticAlert open className="tAlert">
          Informar os dados da obra para o cadastro.
        </TEAlert>

        {playload && (
          <div className="flex items-center justify-between shadow-lg bg-gray-50 px-10 py-10 mt-6">
            <p className="text-xl text-gray-600">{playload.message}</p>
            <Image className="w-[70px]" src={logoOk} alt="ok" />
          </div>
        )}
      </div>
    </DefautPage>
  );
}