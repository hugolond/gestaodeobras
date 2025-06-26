"use client";
export const dynamic = "force-dynamic";

import { FormEvent, useRef, useState } from "react";
import dynamicImport from "next/dynamic";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

// Dynamic imports (SSR desabilitado)
const TEInput = dynamicImport(() => import("tw-elements-react").then(m => m.TEInput), { ssr: false });
const TEAlert = dynamicImport(() => import("tw-elements-react").then(m => m.TEAlert), { ssr: false });
const TESelect = dynamicImport(() => import("tw-elements-react").then(m => m.TESelect), { ssr: false });
const Image = dynamicImport(() => import("next/image"), { ssr: false });

export type Work = {
  nome: string;
  endereco: string;
  bairro: string;
  area: string;
  tipo: number;
  previsto: number;
  casagerminada: boolean;
  status: boolean;
  datainicioobra: string; // formato ISO: yyyy-mm-dd
  datafinalobra: string;  // formato ISO: yyyy-mm-dd
};

export default function PageConsultaStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [playload, setPlayload] = useState<Work | null>(null);
  const [selectValue, setSelectValue] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setPlayload(null);
    try {
      const session = await getSession();
      const token = session?.token;

      if (!formRef.current) throw new Error("Formulário não encontrado");
      const formData = new FormData(formRef.current);
      
      const valorInput = String(formData.get("previsto")).replace(",", ".");
      const valor = parseFloat(valorInput);
      if (isNaN(valor)) {
        toast.error("Valor inválido.");
        setIsLoading(false);
        return;
      }

      const payload: any = {
        nome: formData.get("nomeObra"),
        endereco: formData.get("endereco"),
        bairro: formData.get("bairro"),
        area: formData.get("area"),
        tipo: selectValue,
        previsto: valor,
        casagerminada: (formRef.current.elements.namedItem("flexSwitchCasaGeminada") as HTMLInputElement).checked,
        status: true,
        datainicioobra: formData.get("datainicioobra"),
        datafinalobra: formData.get("datafinalobra"),
      };

      const response = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/sendnewobra", {
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
            toast.success("Obra cadastrada com sucesso!");
            setPlayload(data); // Pode remover se não estiver mais usando
            formRef.current.reset(); // Opcional: limpa o formulário após envio
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
      <section className="col-span-3 sm:col-span-4 px-2 pb-24">
      <h1 className="text-3xl sm:text-2xl font-bold mb-6 text-gray-800">
          Cadastro da Obra
        </h1>
        <form ref={formRef} onSubmit={onSubmit} className="blockInput space-y-4">
          <TEInput required type="text" id="nomeObra" name="nomeObra" label="Descritivo" />
          <TEInput required type="text" id="endereco" name="endereco" label="Endereço" />
          <TEInput required type="text" id="bairro" name="bairro" label="Bairro" />
          <TEInput required type="text" id="area" name="area" label="Área da Obra (m²)" />
          <TEInput required type="text" id="previsto" name="previsto" label="Valor previsto (R$)" placeholder="Ex: 1500,00"/>
          <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">
            Tipo da Obra
          </label>
          <select
            required
            name="tipo"
            value={selectValue}
            onChange={(e) => setSelectValue(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Casa térrea</option>
            <option value={2}>2 Andares</option>
            <option value={3}>3 Andares</option>
          </select>

          <div className="flex items-center gap-3 my-4">
            <label htmlFor="flexSwitchCasaGeminada" className="text-sm font-medium text-gray-700">
              Casa Geminada
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="flexSwitchCasaGeminada"
                name="flexSwitchCasaGeminada"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition duration-300"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition duration-300"></div>
            </label>
          </div>
          <label>
            Data Início Obra
          <TEInput required type="date" id="datainicioobra" name="datainicioobra" label="" />
          </label>
          <label>
            Data Previsão Término
            <TEInput required type="date" id="datafinalobra" name="datafinalobra" label="" />
          </label>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="buttomForm bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-800 transition"
            >
              {isLoading ? "Enviando..." : "Registrar"}
            </button>
          </div>
        </form>
      </section>
    </DefautPage>
  );
}