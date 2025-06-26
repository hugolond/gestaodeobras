"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon, DevicePhoneMobileIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefautPage from "@/components/defautpage";
import Link from "next/link";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

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
  const [modalAberto, setModalAberto] = useState(false);
  const [obraConcluidaNome, setObraConcluidaNome] = useState("");
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const router = useRouter();
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [obraSelecionada, setObraSelecionada] = useState<Lote | null>(null);



  const itensPorPagina = 9;
  const totalPaginas = Math.ceil(lotes.length / itensPorPagina);
  const lotesPaginados = lotes.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const calcularDiasTotais = (inicio?: string, fim?: string): number => {
  if (!inicio || !fim) return 0;
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    const diffMs = dataFim.getTime() - dataInicio.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

    const confirmarConclusaoObra = async () => {
    if (!obraSelecionada) return;

    try {
      const session = await getSession();
      const token = session?.token || (session?.user as any)?.token;

      const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...obraSelecionada,
          Status: false,
           DataFinalObra: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar obra.");

      setLotes((prev) =>
        prev.map((o) => (o.ID === obraSelecionada.ID ? { ...o, Status: false } : o))
      );

      setObraConcluidaNome(obraSelecionada.Nome);
      setModalConfirmar(false);
      setModalAberto(true);
      setObraSelecionada(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao concluir a obra.");
    }
  };

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
      <section className="col-span-3 sm:col-span-8 px-2 pb-24">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Obras Cadastradas</h1>

        {carregando && (
          <div className="flex items-center justify-center text-gray-600">
            <Loader className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
            <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
          </div>
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
                    className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-blue-50 flex flex-col justify-between h-[360px]"
                  >
                    {/* Bloco superior */}
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-500 mb-1 h-[60px]">{lote.Nome}</h2>
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

                      {!lote.Status && lote.DataInicioObra && lote.DataFinalObra && (
                        <div className="mt-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className={estiloicon} />
                            <span><strong>Período:</strong> {formatarData(lote.DataInicioObra)} até {formatarData(lote.DataFinalObra)}</span>
                          </div>
                          <div className="text-xs text-gray-600 ml-8">
                            Tempo total: <strong>{calcularDiasTotais(lote.DataInicioObra, lote.DataFinalObra)} dias</strong>
                          </div>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <InformationCircleIcon className={estiloicon} />
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            lote.Status ? "bg-[#28a9b8] text-white" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {lote.Status ? "Em Andamento" : "Concluída"}
                        </span>
                      </div>
                    </div>

                    {/* Bloco inferior */}
                    <div>
                      {lote.Status && (
                        <>
                          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                            <CalendarIcon className={estiloicon} />
                            <strong>Prazo:</strong> {formatarData(lote.DataInicioObra)} a {formatarData(lote.DataFinalObra)}
                          </div>

                          <div className="h-2 mt-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-[#28a9b8] rounded-full"
                              style={{ width: `${calcularProgresso(lote.DataInicioObra, lote.DataFinalObra)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-left text-gray-500 mt-1">
                            {calcularProgresso(lote.DataInicioObra, lote.DataFinalObra).toFixed(0)}%
                          </p>

                          {(() => {
                            const diasRestantes = lote.DataFinalObra
                              ? Math.ceil((new Date(lote.DataFinalObra).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                              : null;
                            const progresso = calcularProgresso(lote.DataInicioObra, lote.DataFinalObra);

                            if (diasRestantes !== null && diasRestantes <= 30 && progresso < 100) {
                              return (
                                <div className="flex items-center mt-1 text-xs text-yellow-600">
                                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                  {diasRestantes} dia(s) restantes para o final.
                                </div>
                              );
                            }

                            if (diasRestantes !== null && progresso >= 100 && lote.Status) {
                              return (
                                <div className="flex items-center mt-1 text-xs text-red-600">
                                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                  Atrasada!
                                </div>
                              );
                            }

                            return null;
                          })()}

                          <div className="flex justify-center mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setObraSelecionada(lote);
                                setModalConfirmar(true);
                              }}
                              className="mt-2 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition"
                            >
                              Obra Concluída
                            </button>
                          </div>
                        </>
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
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Obra Concluída</h3>
              <p className="text-gray-600 mb-4">
                A obra <strong>{obraConcluidaNome}</strong> foi marcada como <span className="text-green-600 font-medium">concluída</span>.
              </p>
              <button
                onClick={() => setModalAberto(false)}
                className="bg-[#28a9b8] hover:bg-[#1b778a] text-white px-4 py-2 rounded-md font-medium transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
        {modalConfirmar && obraSelecionada && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmar Conclusão </h3>
                <p className="text-gray-600 mb-4">
                  Deseja realmente marcar a obra <strong>{obraSelecionada.Nome}</strong> como <span className="text-green-600 font-medium">concluída</span>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmarConclusaoObra}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => {
                      setModalConfirmar(false);
                      setObraSelecionada(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
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
