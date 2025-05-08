"use client";

import React, { useEffect, useState } from "react";
import DefautPage from "@/components/defautpage";
import { getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface ObraPagamento {
  idobra: string;
  nome: string;
  datapagamento: string;
  valor: number;
  categoria: string;
}

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const getAno = (data: string) => new Date(data).getFullYear();
const getMes = (data: string) => new Date(data).getMonth();

export default function DashboardUnificado() {
  const [dados, setDados] = useState<ObraPagamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [mostrarValores, setMostrarValores] = useState(false);

  const cores = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#0ea5e9", "#22c55e",
  ];

  useEffect(() => {
    const fetchDados = async () => {
      const session = await getSession();
      const token = session?.token;

      const res = await fetch("https://backendgestaoobra.onrender.com/api/dashboard/obra-pagamento", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDados(data);
      }
      setCarregando(false);
    };

    fetchDados();
  }, []);

  useEffect(() => {
    const anos = dados.map(p => getAno(p.datapagamento));
    if (anos.length) {
      const maisRecente = Math.max(...anos);
      setAnoSelecionado(maisRecente);
    }
  }, [dados]);

  const dadosFiltrados = dados.filter(p => getAno(p.datapagamento) === anoSelecionado);
  const anosDisponiveis = Array.from(new Set(dados.map(p => getAno(p.datapagamento)))).sort((a, b) => b - a);

  const porObraMes: Record<string, number[]> = {};
  const porCategoriaMes: Record<string, number[]> = {};
  const porCategoriaTotal: Record<string, number> = {};

  dadosFiltrados.forEach(p => {
    const mes = getMes(p.datapagamento);
    porObraMes[p.nome] = porObraMes[p.nome] || Array(12).fill(0);
    porObraMes[p.nome][mes] += p.valor;

    porCategoriaMes[p.categoria] = porCategoriaMes[p.categoria] || Array(12).fill(0);
    porCategoriaMes[p.categoria][mes] += p.valor;

    porCategoriaTotal[p.categoria] = (porCategoriaTotal[p.categoria] || 0) + p.valor;
  });

  const topCategorias = Object.entries(porCategoriaTotal)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const datalabelsPlugin = mostrarValores
    ? {
        datalabels: {
          anchor: "end" as const,
          align: "top" as const,
          formatter: (value: number) => `R$ ${value.toLocaleString("pt-BR")}`,
          font: { weight: "bold" as const, size: 10 },
          color: "#333",
        },
      }
    : { datalabels: { display: false } };

  return (
    <DefautPage>
      <section className="p-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-6 text-gray-800">Dashboard Unificado de Pagamentos</h1>

        {carregando ? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Ano:</label>
                <select
                  value={anoSelecionado ?? ""}
                  onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                  className="border px-3 py-2 rounded text-sm"
                >
                  {anosDisponiveis.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={mostrarValores}
                  onChange={() => setMostrarValores(prev => !prev)}
                />
                Mostrar valores nos gráficos
              </label>
            </div>

            {["Gastos Mensais por Obra", "Gastos Empilhados por Categoria", "Top 5 Categorias", "Tendência Mensal por Obra"].map((title, index) => {
              const chart = (() => {
                if (index === 0) {
                  return <Bar data={{ labels: meses, datasets: Object.entries(porObraMes).map(([nome, valores], i) => ({ label: nome, data: valores, backgroundColor: cores[i % cores.length] })) }} options={{ responsive: true, plugins: { ...datalabelsPlugin, legend: { position: "top" } } }} />
                } else if (index === 1) {
                  return <Bar data={{ labels: meses, datasets: Object.entries(porCategoriaMes).map(([cat, valores], i) => ({ label: cat, data: valores, backgroundColor: cores[i % cores.length], stack: "stack1" })) }} options={{ responsive: true, plugins: { ...datalabelsPlugin, legend: { position: "bottom" } } }} />
                } else if (index === 2) {
                  return <Bar data={{ labels: topCategorias.map(c => c[0]), datasets: [{ label: "Valor total", data: topCategorias.map(c => c[1]), backgroundColor: "#3b82f6" }] }} options={{ indexAxis: "y", responsive: true, plugins: { ...datalabelsPlugin, legend: { display: false } } }} />
                } else {
                  return <Line data={{ labels: meses, datasets: Object.entries(porObraMes).map(([nome, valores], i) => ({ label: nome, data: valores, fill: true, backgroundColor: cores[i % cores.length] + "55", borderColor: cores[i % cores.length] })) }} options={{ responsive: true, plugins: { ...datalabelsPlugin, legend: { position: "bottom" } } }} />
                }
              })();
              return (
                <section key={index} className="bg-white p-4 rounded-xl shadow overflow-x-auto">
                  <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-700 text-center sm:text-left">
                    {title}
                  </h2>
                  <div className="min-w-[300px]">{chart}</div>
                </section>
              );
            })}
          </>
        )}
      </section>
    </DefautPage>
  );
}