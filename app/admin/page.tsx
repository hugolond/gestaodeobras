"use client";

import React, { useEffect, useState } from "react";
import DefautPage from "@/components/defautpage";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, CalendarDays, DollarSign  } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

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
import { Loader } from "lucide-react";

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
  previsto: number;
}

export default async function DashboardUnificado() {
  const session = await getServerSession(authOptions);
  const { data: status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<ObraPagamento[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState<string | undefined>();
  const [ultimoRegistro, setUltimoRegistro] = useState<ObraPagamento | null>(null);

  const totalValor = chartData.reduce((acc, cur) => acc + cur.valor, 0);
  const totalPrevisto = chartData.reduce((acc, cur) => acc + cur.previsto, 0);

  if (!session) {
    redirect("/login");
  }

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
              acc[curr.nome].previsto = curr.previsto;
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
  const alturaGrafico = (chartData?.length ?? 0) * 90;

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-10 px-2 pb-24">
        {carregando ? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
            <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold text-left">Bem-vindo(a), {user}</h1>
            <p className="text-left text-sm text-gray-500">Resumo da sua conta</p>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="sm:text-xl text-sm text-muted-foreground">Obras ativas</p>
                  <p className="text-3xl font-bold text-[#28a9b8]">{obrasUnicas}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="sm:text-xl text-sm text-muted-foreground">Pagamentos lançados</p>
                  <p className="text-3xl font-bold text-[#28a9b8]">{totalPagamentos}</p>
                </CardContent>
              </Card>
            </div>

            {chartData.length > 0 && (
              <>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <p className="sm:text-xl text-sm text-center text-muted-foreground mb-4">
                      Resumo de pagamentos por obra
                    </p>
                    <ResponsiveContainer width="100%" height={alturaGrafico}>
                      <ComposedChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 110, bottom: 5, left: 40 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fontSize: 11 }} // Reduz um pouco a fonte
                        />
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
                          fill="#28a9b8"
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
                        <Line
                            name="Previsto"
                            type="monotone"
                            dataKey="previsto"
                            stroke="#ff6600"
                            strokeWidth={2}
                          />
                        <Legend />
                      </ComposedChart>
                    </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground">
                    Total Pagamento: <strong className="text-[#28a9b8]">{totalValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><br />
                    Total Previsto: <strong className="text-orange-600">{totalPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                  </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <CalendarDays className="w-4 h-4 text-[#28a9b8]" />
                      Último lançamento
                    </p>
                    <p className="text-base flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
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
        href="/admin/payment/detail"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#28a9b8] hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Adicionar pagamento"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Novo Pagamento</span>
      </Link>
    </DefautPage>
  );
}
