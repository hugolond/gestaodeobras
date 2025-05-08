"use client";

import React, { useEffect, useState } from "react";
import DefautPage from "@/components/defautpage";
import { getSession } from "next-auth/react";
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
import { Loader2 } from "lucide-react";

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

type Obra = { ID: string; Nome: string };
type Pagamento = {
  idobra: string;
  datapagamento: string;
  valor: number;
  categoria: string;
};

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const getAno = (data: string) => new Date(data).getFullYear();
const getMes = (data: string) => new Date(data).getMonth();

const TelaDashboardPagamentos = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarValores, setMostrarValores] = useState(false);

  const cores = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#0ea5e9", "#22c55e",
  ];

  useEffect(() => {
    const fetchObras = async () => {
      const session = await getSession();
      const token = session?.token;

      const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) setObras(data);
    };

    fetchObras();
  }, []);

  useEffect(() => {
    const fetchPagamentos = async () => {
      setCarregando(true);
      const session = await getSession();
      const token = session?.token;

      const all: Pagamento[] = [];
      for (const obra of obras) {
        const res = await fetch(`https://backendgestaoobra.onrender.com/api/payment/v1/listpayment?idobra=${obra.ID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          all.push(...data.map((p: Pagamento) => ({ ...p, idobra: obra.ID })));
        }
      }
      setPagamentos(all);
      setCarregando(false);
    };

    if (obras.length) fetchPagamentos();
  }, [obras]);

  useEffect(() => {
    const anos = pagamentos.map(p => getAno(p.datapagamento));
    if (anos.length) {
      const maisRecente = Math.max(...anos);
      setAnoSelecionado(maisRecente);
    }
  }, [pagamentos]);

  const anosDisponiveis = Array.from(new Set(pagamentos.map(p => getAno(p.datapagamento)))).sort((a, b) => b - a);
  const dadosFiltrados = pagamentos.filter(p => getAno(p.datapagamento) === anoSelecionado);

  const porObraMes: Record<string, number[]> = {};
  const porCategoriaMes: Record<string, number[]> = {};
  const porCategoriaTotal: Record<string, number> = {};

  obras.forEach((obra) => {
    porObraMes[obra.Nome] = Array(12).fill(0);
  });

  dadosFiltrados.forEach(p => {
    const mes = getMes(p.datapagamento);
    const obra = obras.find(o => o.ID === p.idobra)?.Nome;
    if (obra) porObraMes[obra][mes] += p.valor;

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
      <section className="col-span-3 sm:col-span-8 px-2">
        {carregando ? (
          <div className="flex flex-col justify-center items-center py-20 text-gray-600">
            <Loader2 className="animate-spin h-10 w-10 mb-4" />
            Carregando dados do dashboard...
          </div>
        ) : (
          <div className="p-2 sm:p-4 max-w-full mx-auto space-y-10">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Dashboard Financeiro de Obras</h1>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
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
          </div>
        )}
      </section>
    </DefautPage>
  );
};

export default TelaDashboardPagamentos;