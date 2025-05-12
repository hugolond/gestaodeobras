"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefautPage from "@/components/defautpage";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  HomeIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";


type Lote = {
  ID: string;
  Nome: string;
  Endereco: string;
  Bairro: string;
  Area: string;
  Tipo: string;
  Casagerminada: boolean;
  Status: boolean;
};

const tiposObra: Record<number, { text: string; icon: JSX.Element }> = {
  1: { text: "Térrea", icon: <HomeIcon className="w-5 h-5 mr-1 text-gray-500" /> },
  2: { text: "2 Andares", icon: <BuildingLibraryIcon className="w-5 h-5 mr-1 text-gray-500" /> },
  3: { text: "3 Andares", icon: <BuildingOfficeIcon className="w-5 h-5 mr-1 text-gray-500" /> },
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

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8">
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
              {lotesPaginados.map((lote) => (
                <div
                  key={lote.ID}
                  onClick={() => router.push(`/admin/acomp?id=${lote.ID}`)}
                  className="cursor-pointer border rounded-lg p-4 shadow hover:shadow-md transition hover:bg-blue-50"
                >
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{lote.Nome}</h2>
                  <p className="text-sm text-gray-600"><strong>Endereço:</strong> {lote.Endereco}</p>
                  <p className="text-sm text-gray-600"><strong>Bairro:</strong> {lote.Bairro}</p>
                  <p className="text-sm text-gray-600"><strong>Área:</strong> {lote.Area} m²</p>
                  <div className="mt-2 flex items-center gap-2">
                    {tiposObra[parseInt(lote.Tipo)]?.icon}
                    <span className="text-sm">{tiposObra[parseInt(lote.Tipo)]?.text || "Tipo desconhecido"}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        lote.Status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lote.Status ? "Em Andamento" : "Concluída"}
                    </span>
                    {lote.Casagerminada && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Geminada)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition bg-white"
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
                        ? "bg-blue-600 text-white border-blue-600 shadow"
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
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition bg-white"
              >
                <span className="text-sm">Próximo</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* Botão flutuante para nova obra */}
      <Link
        href="/admin/obra/detalhes"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Adicionar pagamento"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Nova Obra</span>
      </Link>
    </DefautPage>
  );
}
