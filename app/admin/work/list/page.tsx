"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon, DevicePhoneMobileIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefautPage from "@/components/defautpage";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import {
  HomeIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const estiloicon = "size-6 text-gray-500"

const tiposObra: Record<number, { text: string; icon: JSX.Element }> = {
  1: { text: "Térrea", icon: <HomeIcon className="w-6 h-6 mr-1 text-gray-500" /> },
  2: { text: "2 Andares", icon: <BuildingLibraryIcon className="w-6 h-6 mr-1 text-gray-500" /> },
  3: { text: "3 Andares", icon: <BuildingOfficeIcon className="w-6 h-6 mr-1 text-gray-500" /> },
};

type Lote = {
  ID: string;
  Nome: string;
  Endereco: string;
  Bairro: string;
  Area: string;
  Tipo: string;
  Casagerminada: boolean;
  Status: boolean;
  DataInicioObra?: string;
  DataFinalObra?: string;
};

export default function TabelaLotes() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const router = useRouter();
  const itensPorPagina = 9;
  const totalPaginas = Math.ceil(lotes.length / itensPorPagina);
  const lotesPaginados = lotes.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        const token = session?.token || (session?.user as any)?.token;

        const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar os dados.");
        const data = await res.json();
        if (data === null) {
          setLotes([]);
          setErro("Por favor, cadastre um nova obra para listar");
        } else if (!Array.isArray(data)) {
          throw new Error("Formato inesperado da resposta.");
        } else {
          setLotes(data);
        }
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido.");
      } finally {
        setCarregando(false);
      }
    }

    fetchData();
  }, []);

  const calcularProgresso = (inicio?: string, fim?: string): number => {
    if (!inicio || !fim) return 0;
    const dataInicio = new Date(inicio).getTime();
    const dataFim = new Date(fim).getTime();
    const agora = Date.now();
    if (agora < dataInicio) return 0;
    if (agora > dataFim) return 100;
    const progresso = ((agora - dataInicio) / (dataFim - dataInicio)) * 100;
    return Math.min(100, Math.max(0, progresso));
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" , timeZone: "UTC" });
  };

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8 pb-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Obras Cadastradas</h1>

        {carregando && (
          <p className="text-center text-gray-600 animate-pulse mt-10">Carregando dados...</p>
        )}

        {erro && (
          <p className="text-center text-red-600 bg-red-100 px-4 py-2 rounded mt-4">{erro}</p>
        )}

        {!carregando && !erro && lotes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhuma obra cadastrada.</p>
        )}

        {!carregando && !erro && lotes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 rounded-lg p-4 shadow bg-white shadow-md">
              {lotesPaginados.map((lote) => {
                const progresso = calcularProgresso(lote.DataInicioObra, lote.DataFinalObra);
                const agora = new Date();
                const dataFinal = lote.DataFinalObra ? new Date(lote.DataFinalObra) : null;
                const diasRestantes = dataFinal ? Math.ceil((dataFinal.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)) : null;

                return (
                  <div
                    key={lote.ID}
                    onClick={() => router.push(`/admin/acomp?id=${lote.ID}`)}
                    className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-blue-50"
                  >
                    <h2 className="text-2xl font-bold text-gray-500 mb-1">{lote.Nome}</h2>
                    <p className="text-sm text-gray-600"><strong>Endereço:</strong> {lote.Endereco}</p>
                    <p className="text-sm text-gray-600"><strong>Bairro:</strong> {lote.Bairro}</p>
                    <p className="text-sm text-gray-600"><strong>Área:</strong> {lote.Area} m²</p>
                    
                    <div className="mt-2 flex items-center gap-2">
                      {tiposObra[parseInt(lote.Tipo)]?.icon}
                      <span className="text-sm">{tiposObra[parseInt(lote.Tipo)]?.text || "Tipo desconhecido"}</span>
                      {lote.Casagerminada && (
                        <span className="ml-2 text-xs text-[#28a9b8] font-medium">(Geminada)</span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <InformationCircleIcon className= {estiloicon}/> 
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          lote.Status ? "bg-[#28a9b8] text-white" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {lote.Status ? "Em Andamento" : "Concluída"}
                      </span>
                    </div>
                      
                      
                    
                    <div className="">
                    <p className="text-sm text-gray-600">
                    <div className="mt-2 flex items-center gap-1">
                      <CalendarIcon className= {estiloicon}/> 
                      <strong>  Prazo:</strong> {formatarData(lote.DataInicioObra)} a {formatarData(lote.DataFinalObra)}
                    </div>
                      
                    </p>
                      <div className="h-2 mt-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-[#28a9b8] rounded-full"
                          style={{ width: `${progresso}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-left text-gray-500 mt-1">{progresso.toFixed(0)}%</p>
                      {diasRestantes !== null && diasRestantes <= 30 && progresso < 100 && (
                        <div className="flex items-center mt-1 text-xs text-yellow-600">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {diasRestantes} dia(s) restantes para o final.
                        </div>
                      )}
                      {diasRestantes !== null && progresso >= 100 && lote.Status && (
                        <div className="flex items-center mt-1 text-xs text-red-600">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          Atrasada!
                        </div>
                      )}
                      
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-80 transition bg-white"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-sm">Anterior</span>
              </button>

              {[...Array(totalPaginas)].map((_, index) => {
                const numero = index + 1;
                const ativo = paginaAtual === numero;
                return (
                  <button
                    key={numero}
                    onClick={() => setPaginaAtual(numero)}
                    className={`px-4 py-1 text-sm rounded-full border font-medium transition ${
                      ativo
                        ? "bg-[#28a9b8] text-white border-[#28a9b8] shadow"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {numero}
                  </button>
                );
              })}

              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-80 transition bg-white"
              >
                <span className="text-sm">Próximo</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </section>

      <Link
        href="/admin/work/detail"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#28a9b8] hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Adicionar pagamento"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Nova Obra</span>
      </Link>
    </DefautPage>
  );
}
