'use client';

import DefautPage from "@/components/defautpage";
import { useEffect, useState } from 'react';
import { getSession } from "next-auth/react";
import PlanosSection from "../app/admin/planossection";
import { Loader } from "lucide-react";

type Subscription = {
  ID: number;
  UserID: number;
  StripeCustomer: string;
  StripeSubscription: string;
  StripePriceID: string;
  StripeProductID: string;
  StripePlanAmount: number;
  Currency: string;
  Interval: string;
  IntervalCount: number;
  Status: string;
  CreatedAt: string;
};

export default function TelaConfig({ session }: any) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("pt-BR", { timeZone: "UTC" });

  const Plan = (value: any) => {
    switch (value) {
      case "price_1RhtcIHqDlGxRZfNe1wxXkpj": return "Essencial";
      case "price_1RhteOHqDlGxRZfNJnMMt4VE": return "Profissional";
      case "price_1RTn1dQWxc0UfbT25f6h5W6P": return "Equipe";
      default: return "Grátis";
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        const token = session?.token || (session?.user as any)?.token;
        const email = session?.user.email;
        setEmail(email ?? '');
        const res = await fetch("https://backendgestaoobra.onrender.com/api/subscriptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar os dados.");
        const data = await res.json();
        setSubscription(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch (err: any) {
        console.error("Erro ao carregar assinatura:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cancelSubscription = async () => {
    setCanceling(true);
    try {
      const session = await getSession();
      const token = session?.token || (session?.user as any)?.token;
      const res = await fetch('https://backendgestaoobra.onrender.com/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      setMessage(result.message || 'Assinatura cancelada');
    } catch (err) {
      setMessage("Erro ao cancelar assinatura.");
    } finally {
      setCanceling(false);
      setShowModal(false);
    }
  };

  if (!subscription) {
    return (
      <DefautPage session={session}>
         <section className="col-span-3 sm:col-span-6 px-2 pb-24">
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Você está usando o plano Gratuito</h2>
                <p className="text-gray-600 text-sm max-w-xl mx-auto">
                  Este plano é ideal para conhecer a plataforma e testar seus recursos. Você pode registrar 1 obra e testar gratuitamente por 15 dias.
                </p>
              </div>

              <div className="flex justify-center">
                <span className="bg-blue-100 text-blue-800 font-semibold text-sm px-3 py-1 rounded-full">
                  Gratuito - Limitado
                </span>
              </div>

              <div className="text-center">
                <p className="text-gray-700 text-sm mb-2">Para liberar recursos como múltiplas obras, relatórios, e equipe de usuários:</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded text-sm">
                  Experimente agora um plano completo
                </span>
              </div>

              <PlanosSection onPage={true} email={email} indicados={['Essencial']} planoAtivo="Gratuito" />
            </div>
          </section>
        </DefautPage>
    );
  }

  return (
    <DefautPage session={session}>
      <section className="col-span-3 sm:col-span-6 px-2 pb-24">
        {loading ? (
          <div className="flex items-center justify-center text-gray-600">
            <Loader className="animate-spin w-6 h-6 mr-2" />
            Carregando dados...
            <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
            </svg>
            Minha Assinatura — <span className="capitalize text-green-700">{Plan(subscription.StripePriceID)}</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
            <div className="space-y-1">
              <p><strong>Status:</strong> <span className={`ml-1 font-semibold ${subscription.Status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                {subscription.Status === 'active' ? 'Pago' : 'Cancelado'}
              </span></p>
              <p><strong>Valor:</strong> {(subscription.StripePlanAmount / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })} / {subscription.Interval.replace("month", "mês")}</p>
            </div>
            <div className="space-y-1">
              <p><strong>Assinado em:</strong> {formatDate(subscription.CreatedAt)}</p>
              {subscription.Status === "active" && (
                <p><strong>Renovação:</strong> {new Date(new Date(subscription.CreatedAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</p>
              )}
            </div>
          </div>

          {subscription.Status === "active" && (
  <div className="pt-4">
    <button
      onClick={() => setShowModal(true)}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
    >
      Cancelar Assinatura
    </button>

          {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full space-y-4">
                    <h3 className="text-lg font-semibold">Cancelar Assinatura</h3>
                    <p className="text-sm text-gray-700">Tem certeza que deseja cancelar sua assinatura?</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={async () => {
                          setCanceling(true);
                          await cancelSubscription();
                          setMessage("Assinatura cancelada com sucesso. Redirecionando...");
                            setTimeout(() => {
                              window.location.href = "/redirect";
                            }, 2000);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        disabled={canceling}
                      >
                        {canceling ? 'Cancelando...' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {subscription.Status === "canceled" && (
            <p className="text-red-600 font-semibold">Assinatura cancelada</p>
          )}
          <PlanosSection onPage={true} email={email} indicados={['Profissional']} planoAtivo={Plan(subscription.StripePriceID)} />
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </div>
        )}
      </section>
    </DefautPage>
  );
}