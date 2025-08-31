
"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useRef, useState } from "react";
import dynamicImport from "next/dynamic";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { MapPin, Home, CalendarDays, Building, MapIcon, DollarSignIcon } from 'lucide-react';
import { NumericFormat } from 'react-number-format';


const TEInput = dynamicImport(() => import("tw-elements-react").then(m => m.TEInput), { ssr: false });

export type Work = {
  nome: string;
  endereco: string;
  bairro: string;
  area: string;
  tipo: number;
  previsto: number;
  casagerminada: boolean;
  status: boolean;
  datainicioobra: string;
  datafinalobra: string;
};

export default function TelaCadastroObra({ session }: any) {
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

      const valorInput = String(formData.get("previsto")).replace("R$", "").replace(/\./g, "").replace(",", ".");
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
        setPlayload(data);
        formRef.current.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar o formulário.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DefautPage session={session}>
      <section className="col-span-3 sm:col-span-10 px-2 pb-24 w-full max-w-2xl mx-auto p-4 sm:p-6 pb-24 bg-gray-100 rounded-2xl shadow">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-left flex items-center justify-left gap-2">
          <Building className="w-5 h-5 text-[#28a9b8]" /> Cadastro da Obra
        </h1>
        <form ref={formRef} onSubmit={onSubmit} className="space-y-6 px-2">
          <div>
            <span className="text-gray-500">Obra</span>
            <div className="relative">
              <TEInput required type="text" id="nomeObra" name="nomeObra" className="pl-10 bg-white"/>
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500">Endereço</span>
              <div className="relative">
                <TEInput required type="text" id="endereco" name="endereco" className="pl-10 bg-white"/>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
             </div>
             <div>
              <span className="text-gray-500">Bairro</span>
              <div className="relative">
              <TEInput required type="text" id="bairro" name="bairro" className="pl-10 bg-white"/>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div> 
              <span className="text-gray-500">Área da Obra (m²)</span>
              <div className="relative">
                <TEInput required type="text" id="area" name="area" className="pl-10 bg-white"/>
                <MapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
              
            <div className="relative">
              <div> 
              <span className="text-gray-500">Valor previsto (R$)</span>
              <div className="relative">
              <TEInput
                name="previsto"
                type="number"
                prefix="R$ "
                placeholder="Ex: R$ 150.000,00"
                className="pl-10 bg-white"
                required />
                
              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
              </div>
            </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
            <span className="text-gray-500">Tipo da Obra</span>
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
            </div>

            <div className="flex flex-col">
              <label htmlFor="flexSwitchCasaGeminada" className="text-gray-500 mb-1">
                Casa Geminada
              </label>
              <div className="flex justify-center">
              <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="flexSwitchCasaGeminada" name="flexSwitchCasaGeminada" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition duration-300"></div>
              </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className="block font-medium text-gray-500">Data Início Obra</span>
              <TEInput required type="date" id="datainicioobra" name="datainicioobra" className="bg-white" />
            </label>
            <label>
              <span className="block font-medium text-gray-500">Data Previsão Término</span>
              <TEInput required type="date" id="datafinalobra" name="datafinalobra" className="bg-white " />
            </label>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#28a9b8] text-white px-6 py-2 rounded shadow hover:bg-[#1f8b97] transition"
            >
              {isLoading ? "Enviando..." : "Registrar"}
            </button>
          </div>
        </form>
      </section>
    </DefautPage>
  );
}
