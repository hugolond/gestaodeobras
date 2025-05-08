"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import DefautPage from "@/components/defautpage";
import {
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { fetchComToken } from "@/lib/fetchComToken";

type Lote = {
  Sequence: number;
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

  const itensPorPagina = 10;
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
        if (!Array.isArray(data)) throw new Error("Formato inesperado da resposta.");
        setLotes(data);
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
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm text-left text-gray-700 bg-white">
                <thead className="bg-gray-100 text-xs text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-6 py-3">Endereço</th>
                    <th className="px-6 py-3">Bairro</th>
                    <th className="px-4 py-3 text-center">Área (m²)</th>
                    <th className="px-4 py-3 text-center">Tipo</th>
                    <th className="px-4 py-3 text-center">Geminada</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesPaginados.map((lote) => (
                    <tr key={lote.Sequence} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{lote.Nome}</td>
                      <td className="px-6 py-3">{lote.Endereco}</td>
                      <td className="px-6 py-3">{lote.Bairro}</td>
                      <td className="px-4 py-3 text-center">{lote.Area}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center justify-center gap-1">
                          {tiposObra[parseInt(lote.Tipo)]?.icon}
                          <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                            {tiposObra[parseInt(lote.Tipo)]?.text || "Desconhecido"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {lote.Casagerminada ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircleIcon className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            lote.Status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lote.Status ? "Em Andamento" : "Concluída"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
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
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition"
              >
                <span className="text-sm">Próximo</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </section>
    </DefautPage>
  );
}