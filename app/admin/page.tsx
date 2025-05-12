"use client";

import React, { useEffect, useState } from "react";
import DefautPage from "@/components/defautpage";
import { getSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

interface ObraPagamento {
  idobra: string;
  nome: string;
  previsto: number;
  datapagamento: string;
  valor: number; 
  categoria: string;
}

interface ChartItem {
  name: string;
  valor: number;
}

export default function DashboardUnificado() {
  const [stats, setStats] = useState<ObraPagamento[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState<string | undefined>();
  const [ultimoRegistro, setUltimoRegistro] = useState<ObraPagamento | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const session = await getSession();
        const token = session?.token || (session?.user as any)?.token;
        const nameuser = session?.user?.username;
        setUser(nameuser);

        const res = await fetch(
          "https://backendgestaoobra.onrender.com/api/dashboard/obra-pagamento",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data: ObraPagamento[] | null = await res.json();
          const dadosValidos = Array.isArray(data) ? data : [];
          setStats(dadosValidos);

          if (dadosValidos.length > 0) {
            // Último registro
            const ultimo = dadosValidos.reduce((latest, item) => {
              return new Date(item.datapagamento) > new Date(latest.datapagamento)
                ? item
                : latest;
            }, dadosValidos[0]);
            setUltimoRegistro(ultimo);

            // Dados para o gráfico
            const resumoPorObra = dadosValidos.reduce((acc, curr) => {
              if (!acc[curr.nome]) {
                acc[curr.nome] = { valor: 0, previsto: 0 };
              }
              acc[curr.nome].valor += curr.valor;
              acc[curr.nome].previsto += curr.previsto;
              return acc;
            }, {} as Record<string, { valor: number; previsto: number }>);
            
            const chart = Object.entries(resumoPorObra)
              .map(([obra, valores]) => ({
                name: obra,
                valor: valores.valor,
                previsto: valores.previsto,
              }))
              .sort((a, b) => b.valor - a.valor);
            
            setChartData(chart);            
          }
        } else {
          setStats([]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setStats([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, []);

  const totalPagamentos = stats?.length ?? 0;
  const obrasUnicas = new Set(stats?.map((s) => s.nome) ?? []).size;
  const alturaGrafico = (chartData?.length ?? 0) * 60;

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-10">
        {carregando ? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold text-left">Bem-vindo, {user}</h1>
            <p className="text-left text-sm text-gray-500">Resumo da conta</p>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Obras ativas</p>
                  <p className="text-3xl font-bold text-gray-500">{obrasUnicas}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Pagamentos lançados</p>
                  <p className="text-3xl font-bold text-gray-500">{totalPagamentos}</p>
                </CardContent>
              </Card>
            </div>

            {chartData.length > 0 && (
              <>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Resumo de pagamentos por obra
                    </p>
                    <ResponsiveContainer width="100%" height={alturaGrafico}>
                      <ComposedChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 110, bottom: 5, left: 40 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip
                          formatter={(value: number) =>
                            value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          }
                        />
                        <Bar
                          dataKey="valor"
                          name="Pagamento"
                          fill="#aaaaaa"
                          radius={[4, 4, 4, 4]}
                          label={{
                            position: "right",
                            formatter: (value: number) =>
                              value.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }),
                          }}
                        />
                        <Line name="Previsto" type="monotone" dataKey="previsto" stroke="#ff7300" />
                        <Legend />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">Último lançamento</p>
                    <p className="text-base font-medium">
                      {ultimoRegistro
                        ? `${new Date(ultimoRegistro.datapagamento).toLocaleDateString(
                            "pt-BR",
                            { timeZone: "UTC" }
                          )} - ${ultimoRegistro.categoria} - ${ultimoRegistro.valor.toLocaleString(
                            "pt-BR",
                            { style: "currency", currency: "BRL" }
                          )}`
                        : "Sem dados"}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </section>
      <Link
        href="/admin/register/detail"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Adicionar pagamento"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Novo Pagamento</span>
      </Link>
    </DefautPage>
  );
}
