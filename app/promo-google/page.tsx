// app/promo-google/page.tsx
'use client'

import Link from 'next/link'
import { Button } from '@heroui/button'
import { Banknote, Bell, BarChart, CheckCircle } from 'lucide-react'
import PlanosSection from '../admin/planossection'
import Testimonials from '@/components/testimonials'
import { BellAlertIcon, ClipboardDocumentIcon, DocumentTextIcon } from '@heroicons/react/24/solid'

export default function PromoGooglePage() {
    const scrollToPlans = () => {
    const plansSection = document.getElementById('planos');
    if (plansSection) plansSection.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <main className="bg-gradient-to-tr from-violet-50 via-indigo-50 to-fuchsia-100 min-h-screen text-gray-900 w-full overflow-x-hidden">
      {/* Hero */}
      <section className="text-center px-4 pt-20 pb-14 bg-white font-manrope w-full max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Controle financeiro de obras sem complicação
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl mt-4 max-w-md mx-auto">
          Registre pagamentos, receba alertas e visualize relatórios de forma simples e profissional.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <span className="text-sm sm:text-base px-5 py-3">
            Comece grátis agora — sem cartão de crédito
          </span>
          </div> 
          <div>
                <Link href="/register">
                    <button className="bg-[#6366F1] rounded-xl hover:bg-blue-700 text-white px-6 py-3 font-semibold">
                      Iniciar teste →
                    </button>
                  </Link>
        </div>
        <div className="flex justify-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-500 flex-wrap">
          <span>+200 usuários</span>
          <span>Suporte via WhatsApp</span>
          <span>Funciona no celular e computador</span>
        </div>
      </section>


      {/* Benefícios */}
      <section className="px-4 py-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-manrope">
        <Benefit icon={<ClipboardDocumentIcon className="w-6 h-6 text-purple-500" />} title="Entradas e saídas em tempo real">
            Veja o que entrou, saiu e o saldo de cada obra, sem abrir planilhas.
        </Benefit>
        <Benefit icon={<BellAlertIcon className="w-6 h-6 text-purple-500" />} title="Alertas de vencimento">
            Receba lembretes de pagamentos e evite atrasos ou esquecimentos.
        </Benefit>
        <Benefit icon={<DocumentTextIcon className="w-6 h-6 text-purple-500" />} title="Relatórios prontos e exportáveis">
            Tenha um resumo completo, pronto para imprimir ou compartilhar.
        </Benefit>
        </section>

      <div className="h-1 w-1/2 sm:w-1/3 bg-violet-500 rounded-full" />

      {/* Depoimentos */}
      <section className="px-4 py-12">
        <Testimonials/>
      </section>

      {/* Planos e CTA final */}
      <section className="px-4 py-8">
        <PlanosSection />
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          Teste grátis por 15 dias · Sem compromisso · Cancele a qualquer momento
        </p>
      </section>
    </main>
  )
}

// Componentes auxiliares
function Benefit({ icon, title, children }: { icon: React.ReactNode; title: string; children: string }) {
  return (
    <div className="p-4 sm:p-5 border rounded-xl shadow bg-white hover:shadow-md transition">
      <div className="flex items-center gap-3 text-sm sm:text-base font-semibold mb-2">
        {icon}
        {title}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{children}</p>
    </div>
  )
}
