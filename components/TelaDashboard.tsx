
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideUsers, LucideHammer, LucideDollarSign, LucideActivity } from 'lucide-react'
import { toast } from 'sonner'
import DefautPage from "@/components/defautpage";
import dynamic from 'next/dynamic';
import { Loader } from "lucide-react";

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })


type Metrics = {
  obras_ativas: number
  total_obras: number
  total_pagamentos: number
  total_usuarios: number
  total_usuarios_free: number
  total_usuarios_pago: number
}

type LoginPorDia = {
  dia: string
  total: number
}

type UsuarioAdmin = {
  id: string
  nome: string
  email: string
  ultimo_login?: string
  plano: 'free' | 'pago'
  total_obras: number
  obras_ativas: number
  total_pagamentos: number
}

const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" , timeZone: "UTC" });
  };

const planosMap: {
  [key: string]: { nome: string; cor: string }} = {
  "prod_Sd9wZSP4KMB0fx": { nome: "Essencial", cor: "bg-blue-100 text-blue-700" },
  "prod_Sd9yGLZA8nbuCK": { nome: "Profissional", cor: "bg-green-100 text-green-700" },
  "free": { nome: "Grátis", cor: "bg-yellow-100 text-yellow-800" }
}



function DashboardCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <Card>
      <CardContent className="flex items-center justify-left">
        <div className='text-left'>
          <section className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-2xl">{icon}</section>
          <p className="text-sm py-2 text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

function UsuarioCard({ usuario }: { usuario: UsuarioAdmin }) {
  const planoInfo = planosMap[usuario.plano] || {
  nome: usuario.plano,
  cor: "bg-gray-200 text-gray-800"
}
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-2 text-lg font-semibold text-gray-800">{usuario.nome}</div>
      <p className="text-sm text-gray-500">{usuario.email}</p>
      <p className="text-sm text-gray-500">Último login: {formatarData(usuario.ultimo_login)}</p>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <LucideHammer className="w-4 h-4" />
          Obras: {usuario.total_obras}
        </div>
        <div className="flex items-center gap-1">
          <LucideHammer className="w-4 h-4 text-green-400" />
          Obras Ativas: {usuario.obras_ativas}
        </div>
        <div className="flex col-span-2 items-center gap-1">
          <LucideDollarSign className="w-4 h-4" />
          Pagamentos: {usuario.total_pagamentos}
        </div>
      </div>
      <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${planoInfo.cor}`}>
        Plano: {planoInfo.nome}
      </span>
    </div>
  )
}


export default function TelaDashboardAdmin({ session }: any) {
  const [data, setData] = useState<Metrics | null>(null)
  const [logins, setLogins] = useState<LoginPorDia[]>([])
  const [carregando, setCarregando] = useState(true);
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([])
  const [filtroPlano, setFiltroPlano] = useState<string>("todos")


  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = session?.token;
        const res = await fetch("https://backendgestaoobra.onrender.com/admin/dashboard", {
              method: "GET",
               headers: { Authorization: `Bearer ${token}` },
            });
        if (!res.ok) throw new Error('Erro ao buscar métricas')
        const json = await res.json()
        setData(json)
      } catch (err) {
        toast.error('Falha ao carregar o painel admin')
        console.error(err)
      }
    }

    fetchMetrics()
  }, [])
  
  useEffect(() => {
    const fetchMetricsLogin = async () => {
      try {
        const token = session?.token;
        const res = await fetch("https://backendgestaoobra.onrender.com/admin/logins-por-dia", {
              method: "GET",
               headers: { Authorization: `Bearer ${token}` },
            });
        if (!res.ok) throw new Error('Erro ao buscar métricas')
        const json = await res.json()
        setLogins(json)
      } catch (err) {
        toast.error('Falha ao carregar o painel admin')
        console.error(err)
      } finally {
              setCarregando(false);
      }
    }

    fetchMetricsLogin()
  }, [])

    useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = session?.token
        const res = await fetch("https://backendgestaoobra.onrender.com/admin/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erro ao buscar usuários")
        const json = await res.json()
        setUsuarios(json)
      } catch (err) {
        toast.error("Erro ao carregar lista de usuários")
        console.error(err)
      }
    }

    fetchUsuarios()
  }, [])


  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" , timeZone: "UTC" });
  };
  return(
    <DefautPage session={session}>
      <section className="col-span-3 sm:col-span-8 px-2 pb-24">

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

        {!carregando && data && (
          <>
          <div className='p-4'>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white rounded-2xl">
              <DashboardCard
                title="Usuários Cadastrados"
                value={data.total_usuarios}
                icon={<LucideUsers className="w-6 h-6" />} />
              <DashboardCard
                title="Usuários Pagos"
                value={data.total_usuarios_pago}
                icon={<LucideUsers className="w-6 h-6 text-green-500" />} />
              <DashboardCard
                title="Usuários Free"
                value={data.total_usuarios_free}
                icon={<LucideUsers className="w-6 h-6 text-yellow-500" />} />
              <DashboardCard
                title="Total de Obras"
                value={data.total_obras}
                icon={<LucideHammer className="w-6 h-6" />} />
              <DashboardCard
                title="Obras Ativas"
                value={data.obras_ativas}
                icon={<LucideHammer className="w-6 h-6 text-blue-500" />} />
              <DashboardCard
                title="Pagamentos Registrados"
                value={data.total_pagamentos}
                icon={<LucideDollarSign className="w-6 h-6 text-emerald-600" />} />
            </div>
          </div> 
          <div className="flex p-6 grid bg-white rounded-2xl shadow-md pt-6 px-6">
              <ApexChart
                type="area"
                height={300}
                options={{
                  chart: { id: 'logins-por-dia', zoom: { enabled: false } },
                  xaxis: {
                    categories: logins.map(l => formatarData(l.dia)),
                    title: { text: 'Dia' }
                  },
                  yaxis: {
                    title: { text: 'Total de acessos' }
                  },
                  stroke: { curve: 'smooth' },
                  dataLabels: { enabled: false },
                }}
                series={[
                  {
                    name: 'Logins',
                    data: logins.map(l => l.total),
                  }
                ]} />
                {usuarios.length > 0 && (
                  <><div className="flex items-center justify-between mt-10 mb-4">
                  <h2 className="text-xl font-semibold mb-4">Contas de Usuários</h2>
                  <select
                    value={filtroPlano}
                    onChange={(e) => setFiltroPlano(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="todos">Todos os planos</option>
                    <option value="free">Grátis</option>
                    <option value="prod_SOaB82dpdOrIqM">Essencial</option>
                    <option value="prod_Sd9wZSP4KMB0fx">Profissional</option>
                  </select>
                </div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {usuarios
                      .filter((u) => filtroPlano === "todos" || u.plano === filtroPlano)
                      .map((usuario) => (
                        <UsuarioCard key={usuario.id} usuario={usuario} />
                      ))}
                  </div></>

                )}
            </div></>
        )}

      </section>
    </DefautPage>
  )
}