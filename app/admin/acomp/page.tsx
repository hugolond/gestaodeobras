"use client";

import React, { useEffect, useState, useRef } from "react";
import DefautPage from "@/components/defautpage";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { getSession } from "next-auth/react";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

type Obra = {
  ID: string;
  Nome: string;
  Area?: string;
};

type Pagamento = {
  id: number;
  idobra: string;
  datapagamento: string;
  detalhe: string;
  categoria: string;
  valor: number;
  observacao: string;
};

const TelaAcompanhamentoPagamentos = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState("");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [agrupados, setAgrupados] = useState<Record<string, number>>({});
  const [carregando, setCarregando] = useState(false);
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");
  const componenteRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    if (componenteRef.current) {
      const canvas = await html2canvas(componenteRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const nomeObra = obras.find(o => o.ID === obraSelecionada)?.Nome || "obra";
      const dataAtual = formatDate(new Date());
      const link = document.createElement("a");
      link.download = `pagamentos_${nomeObra}_${dataAtual}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    async function fetchObras() {
      try {
        const session = await getSession();
        if (!session?.token) {
          window.location.href = "/login"; // ou usar router.push se estiver usando `next/navigation`
          return;
        }
  
        const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
  
        if (!res.ok) throw new Error("Falha ao carregar obras");
        const data = await res.json();
        setObras(data);
        if (data.length) setObraSelecionada(data[0].ID);
      } catch (error) {
        console.error("Erro ao buscar obras:", error);
        window.location.href = "/login";
      }
    }
    fetchObras();
  }, []);
  
  useEffect(() => {
    if (!obraSelecionada) return;
    setCarregando(true);
    (async () => {
      const session = await getSession();
      const token = session?.token;
      const res = await fetch(`https://backendgestaoobra.onrender.com/api/payment/v1/listpayment?idobra=${obraSelecionada}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Pagamento[] = await res.json();
      setPagamentos(data);
      const agrupamento: Record<string, number> = {};
      data.forEach(p => {
        agrupamento[p.categoria] = (agrupamento[p.categoria] || 0) + p.valor;
      });
      setAgrupados(agrupamento);
      setCarregando(false);
    })();
  }, [obraSelecionada]);

  const totalGeral = Object.values(agrupados).reduce((acc, val) => acc + val, 0);
  const agrupadosOrdenados = Object.entries(agrupados).sort((a, b) => ordem === "asc" ? a[1] - b[1] : b[1] - a[1]);
  const obraSelecionadaObj = obras.find(o => o.ID === obraSelecionada);
  const nomeObraSelecionada = obraSelecionadaObj?.Nome;
  const dataAtual = formatDate(new Date());
  const areaObra = obraSelecionadaObj?.Area ? parseFloat(obraSelecionadaObj.Area) : 0;
  const custoPorMetro = areaObra > 0 ? totalGeral / areaObra : 0;

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8">
        <h1 className="text-3xl sm:text-2xl font-bold mb-6 text-gray-800">
          Acompanhamento de Pagamentos por Categoria
        </h1>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center mb-6">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Selecionar Obra:</label>
            <select
              className="border border-gray-300 px-3 py-2 rounded w-full sm:w-auto"
              value={obraSelecionada}
              onChange={(e) => setObraSelecionada(e.target.value)}
            >
              {obras.map(obra => (
                <option key={obra.ID} value={obra.ID}>{obra.Nome}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Ordenar por:</label>
            <select
              className="border border-gray-300 px-3 py-2 rounded text-sm w-full sm:w-auto"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Maior valor</option>
              <option value="asc">Menor valor</option>
            </select>
          </div>

          <button
            onClick={handleExportPNG}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow text-sm mt-2 sm:mt-6 w-full sm:w-auto"
          >
            Exportar PNG
          </button>
        </div>

        {carregando ? (
          <div className="flex justify-center items-center text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Carregando pagamentos...
          </div>
        ) : (
          <div
            ref={componenteRef}
            className="bg-white rounded-xl shadow p-4 sm:p-6 w-full min-w-[300px] sm:min-w-[768px] overflow-visible"
            style={{
              width: "100%",
              maxWidth: "768px",
              paddingBottom: "2rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <div className="text-center text-sm text-gray-500 mb-4">
              Obra: <strong>{nomeObraSelecionada}</strong> — Data: <strong>{dataAtual}</strong>
            </div>

            <ul className="divide-y divide-gray-200 text-xs sm:text-sm">
              <li className="py-2 px-1 sm:px-2 flex justify-between font-semibold text-gray-700">
                <span>Categoria</span>
                <span className="text-right">Valor / %</span>
              </li>

              {agrupadosOrdenados.map(([categoria, total]) => {
                const percentual = totalGeral > 0 ? (total / totalGeral) * 100 : 0;
                return (
                  <li
                    key={categoria}
                    className="py-3 px-1 sm:px-2 flex justify-between items-center leading-snug min-h-[36px]"
                  >
                    <span className="text-gray-700 font-medium w-1/2">{categoria}</span>
                    <div className="text-right w-1/2">
                      <div className="text-green-700 font-semibold">
                        {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <div className="text-[10px] text-gray-500">{percentual.toFixed(2)}%</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="pt-4 mt-4 border-t text-right text-gray-800 text-sm sm:text-base">
              <div className="font-bold text-base sm:text-lg">
                Total Geral: {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              {areaObra > 0 && (
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Custo por m²: {custoPorMetro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (Área: {areaObra} m²)
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </DefautPage>
  );
};

export default TelaAcompanhamentoPagamentos;