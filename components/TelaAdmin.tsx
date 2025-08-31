"use client";

import { useEffect, useState } from "react";
import DefautPage from '@/components/defautpage';
import { Plus, CalendarDays, DollarSign, Loader, Hammer, Activity, HousePlugIcon, LucideHousePlus, IdCardIcon, WalletCardsIcon, BanknoteArrowDownIcon, CirclePlusIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ObraPagamento {
  idobra: string;
  nome: string;
  previsto: number;
  datapagamento: string;
  valor: number;
  categoria: string;
}

interface ObraDetalhada {
  ID: string;
  Nome: string;
  Status: boolean;
  Previsto: number;
  DataInicioObra?: string;
  DataFinalObra?: string;
  Bairro?: string;
}

export default function TelaAdmin({ session }: any) {
  const token = session.token;
  const username = session.user.username;

  const [stats, setStats] = useState<ObraPagamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ultimoRegistro, setUltimoRegistro] = useState<ObraPagamento | null>(null);
  const [obrasDetalhadas, setObrasDetalhadas] = useState<ObraDetalhada[]>([]);

  useEffect(() => {
  const loadDados = async () => {
    try {
      const res = await fetch('https://backendgestaoobra.onrender.com/api/dashboard/obra-pagamento', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao buscar dados');

      const data: ObraPagamento[] | null = await res.json();

      if (!data || data.length === 0) {
        setStats([]); // define vazio
        setUltimoRegistro(null);
        return;
      }

      setStats(data);

      const ultimo = data.reduce((latest, item) =>
        new Date(item.datapagamento) > new Date(latest.datapagamento) ? item : latest
      );
      setUltimoRegistro(ultimo);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setCarregando(false);
    }
  };

  const carregarObras = async () => {
    try {
      const res = await fetch('https://backendgestaoobra.onrender.com/api/obra/v1/listallobra', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Erro ao buscar obras');

      const data = await res.json();

      if (!data || data.length === 0) {
        setObrasDetalhadas([]);
        return;
      }

      setObrasDetalhadas(data);
    } catch (err) {
      console.error('Erro ao buscar obras detalhadas:', err);
    }
  };

  loadDados();
  carregarObras();
}, [token]);

  function calcularProgresso(obra: ObraDetalhada): number {
    const inicio = obra.DataInicioObra ? new Date(obra.DataInicioObra) : null;
    const fim = obra.DataFinalObra ? new Date(obra.DataFinalObra) : null;
    const hoje = new Date();

    if (inicio && fim && fim > inicio) {
      const total = fim.getTime() - inicio.getTime();
      const atual = Math.min(hoje.getTime(), fim.getTime()) - inicio.getTime();
      return Math.round((atual / total) * 100);
    }
    return 0;
  }

  function diasDeObra(obra: ObraDetalhada): number {
    const inicio = obra.DataInicioObra ? new Date(obra.DataInicioObra) : null;
    const hoje = new Date();
    if (inicio) {
      const diffMs = hoje.getTime() - inicio.getTime();
      return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    return 0;
  }

  function totalValorPorObra(idobra: string): number {
    return stats
      .filter((s) => s.idobra === idobra)
      .reduce((total, item) => total + item.valor, 0);
  }

  return (
    <DefautPage session={session}>
      <section className="col-span-3 sm:col-span-10 px-2 pb-24">
        {carregando? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader className="animate-spin w-6 h-6 mr-2" /> Carregando dados...
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-4 w-full max-w-4xl mx-auto bg-gray-100 rounded-2xl shadow">
            <h1 className="text-xl sm:text-2xl font-semibold text-left">Bem-vindo(a), {username}</h1>
            {obrasDetalhadas.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="text-lg font-semibold text-gray-800">Minhas Obras</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {obrasDetalhadas.map((obra) => (
                    <Card key={obra.ID}>
                      <CardContent className="pb-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${obra.Status ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                            {obra.Status ? 'Em Andamento' : 'Concluída'}
                          </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LucideHousePlus className="w-8 h-8 text-gray-400 bg-gray-100 rounded-xl p-2" />
                            <div> 
                              <h3 className="text-md font-semibold text-gray-800 truncate">{obra.Nome}</h3>
                              <p className="text-xs text-gray-500 font-black">Bairro: <span className="font-normal"> {obra.Bairro || '-'}</span></p>
                            </div>
                          </div>
                        <p className="text-xs text-gray-500 font-black">Dias de obra: <span className="font-normal"> {diasDeObra(obra)}</span> </p>
                        
                        <p className="text-xs font-black text-gray-500">Total gasto: <span className="font-normal">{totalValorPorObra(obra.ID).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </span> / <span className="font-normal text-orange-400"> {obra.Previsto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> </p>
                        <p className="text-xs text-gray-500 font-black">Total de lançamentos: <span className="font-normal"> {stats.filter(s => s.idobra === obra.ID).length} </span></p>

                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-[#28a9b8] h-2 rounded-full"
                            style={{ width: `${calcularProgresso(obra)}%` }}
                          />
                          <div className="text-xs text-gray-500 font-normal">  {calcularProgresso(obra)}% </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {stats.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="text-lg font-semibold text-gray-800">Últimos Lançamentos</h2>
                <Card>
                  <CardContent className="divide-y">
                    {stats.slice(0, 5).map((registro, index) => {
                      const data = new Date(registro.datapagamento);
                      const hoje = new Date();
                      const diff = (hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24);
                      let tempo = "";
                      if (diff < 1) tempo = "Hoje";
                      else if (diff < 2) tempo = "Ontem";
                      else if (diff < 3) tempo = "Anteontem";
                      else if (diff <= 7) tempo = "Essa semana";
                      else tempo = "Este mês";

                      return (
                        <div key={index} className="flex items-start gap-4 py-3">
                          <div className="flex flex-col items-center">
                            <BanknoteArrowDownIcon className="w-8 h-8 text-gray-400 bg-gray-100 rounded-xl p-2" />
                            {index < 4 && <div className="h-full w-px bg-gray-300" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800 font-black">
                              {registro.nome} <p className="text-xs text-gray-400"> {registro.categoria} </p>
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {registro.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{tempo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            )}
            {obrasDetalhadas.length == 0 &&(
               <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-xl shadow-md">
                  <CirclePlusIcon className="w-12 h-12 text-cyan-500 mb-4"/>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma obra cadastrada</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Para começar, clique no botão <span className="font-medium text-cyan-600">"+ Nova Obra"</span> no canto inferior direito.
                  </p>
                </div>
            )}
          </div>
        )}
      </section>

      <Link
        href="/admin/work/detail"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#28a9b8] hover:bg-[#0f172a] text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="Adicionar pagamento"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Nova Obra</span>
      </Link>
    </DefautPage>
  );
}
