"use client";
import { useEffect, useState } from "react";
import DefautPage from '@/components/defautpage';
import { Plus, CalendarDays, DollarSign, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
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
} from 'recharts';
import { setuid } from "process";

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

export default function DashboardUnificado({ session }: any) {
  const token = session.token;
  const username = session.user.username;

  const [stats, setStats] = useState<ObraPagamento[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ultimoRegistro, setUltimoRegistro] = useState<ObraPagamento | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('https://backendgestaoobra.onrender.com/api/dashboard/obra-pagamento', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao buscar dados');
        const data: ObraPagamento[] = await res.json();

        setStats(data);
        if (data.length > 0) {
          const ultimo = data.reduce((latest, item) =>
            new Date(item.datapagamento) > new Date(latest.datapagamento) ? item : latest
          );
          setUltimoRegistro(ultimo);

          const resumo = data.reduce((acc, item) => {
            if (!acc[item.nome]) acc[item.nome] = { valor: 0, previsto: 0 };
            acc[item.nome].valor += item.valor;
            acc[item.nome].previsto = item.previsto;
            return acc;
          }, {} as Record<string, { valor: number; previsto: number }>);

          const chart = Object.entries(resumo).map(([obra, valores]) => ({
            name: obra,
            valor: valores.valor,
            previsto: valores.previsto,
          }));

          setChartData(chart);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setCarregando(false);
      }
    };
    load();
  }, [token]);

  const obrasUnicas = new Set(stats.map((s) => s.nome)).size;
  const totalPagamentos = stats.length;
  const totalValor = chartData.reduce((acc, cur) => acc + cur.valor, 0);
  const totalPrevisto = chartData.reduce((acc, cur) => acc + cur.previsto, 0);
  const alturaGrafico = chartData.length * 90;

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-10 px-2 pb-24">
        {carregando ? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
          </div>
        ) : (
          <div className="p-4 space-y-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold text-left">Bem-vindo(a), {username}</h1>
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
                  <CardContent className="p-4">
                    <ResponsiveContainer width="100%" height={alturaGrafico}>
                      <ComposedChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 110, bottom: 5, left: 40 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="valor" name="Pagamento" fill="#28a9b8" />
                        <Line dataKey="previsto" name="Previsto" stroke="#ff6600" strokeWidth={2} />
                        <Legend />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <p className="text-sm text-muted-foreground">
                      Total Pagamento:{' '}
                      <strong className="text-[#28a9b8]">
                        {totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
                      <br />
                      Total Previsto:{' '}
                      <strong className="text-orange-600">
                        {totalPrevisto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </strong>
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
                        ? `${new Date(ultimoRegistro.datapagamento).toLocaleDateString('pt-BR')} - ${
                            ultimoRegistro.categoria
                          } - ${ultimoRegistro.valor.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}`
                        : 'Sem dados'}
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
