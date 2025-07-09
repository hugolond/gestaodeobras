
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideUsers, LucideHammer, LucideDollarSign, LucideActivity } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

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


function DashboardCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow-md">
    <Card>
      <CardContent className="p-5 flex items-center justify-center">
        <div className="text-gray-400 px-4">{icon}</div>
        <div className='text-center'>
          <p className="text-xl text-gray-500">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default function TelaDashboard({ session }: any) {
  const [data, setData] = useState<Metrics | null>(null)
  const [logins, setLogins] = useState<LoginPorDia[]>([])

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
      }
    }

    fetchMetricsLogin()
  }, [])

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" , timeZone: "UTC" });
  };

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">Carregando métricas...</p>
  }
  return(
    <div> 
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Usuários Cadastrados"
        value={data.total_usuarios}
        icon={<LucideUsers className="w-6 h-6" />}
      />
      <DashboardCard
        title="Usuários Pagos"
        value={data.total_usuarios_pago}
        icon={<LucideUsers className="w-6 h-6 text-green-500" />}
      />
      <DashboardCard
        title="Usuários Free"
        value={data.total_usuarios_free}
        icon={<LucideUsers className="w-6 h-6 text-yellow-500" />}
      />
      <DashboardCard
        title="Obras Ativas"
        value={data.obras_ativas}
        icon={<LucideHammer className="w-6 h-6 text-blue-500" />}
      />
      <DashboardCard
        title="Total de Obras"
        value={data.total_obras}
        icon={<LucideHammer className="w-6 h-6" />}
      />
      <DashboardCard
        title="Pagamentos Registrados"
        value={data.total_pagamentos}
        icon={<LucideDollarSign className="w-6 h-6 text-emerald-600" />}
      />
    </div>
    <div className="flex p-6 grid"> 
      <div className="bg-white rounded-2xl shadow-md pt-6 px-6"> 
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
            ]}
          />
      </div>
          
    </div>
    </div>
  )
}