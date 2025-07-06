'use client';

import { useState } from "react";
import Link from "next/link";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { Building2Icon } from "lucide-react";

type PlanosSectionProps = {
  onPage?: boolean;
  email?: string;
  indicados?: string[]; // <-- Novo!
  planoAtivo?: string;
};

type Plano = {
  nome: string;
  preco: string;
  descricao: string;
  beneficios: string[];
  status: boolean;
  priceId?: string;
};

export default function PlanosSection({ onPage = false, email, indicados = [] , planoAtivo}: PlanosSectionProps) {
  const iniciarCheckout = async (priceId: string, email: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, email }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const iniciarCheckoutSemEmail = async (priceId: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  };

  const planos: Plano[] = [
    {
      nome: "Gratuito",
      preco: "0",
      descricao: "Ideal para testar",
      beneficios: [
        "1 obra ativa",
        "Disponível por 15 dias",
        "Sem taxa de implantação"
      ],
      status: true,
      priceId: "price_1RTo7UQWxc0UfbT26soxfOrQ"
    },
    {
      nome: "Essencial",
      preco: "39,99",
      descricao: "Para 1 a 3 obras ativas",
      beneficios: [
        "Até 3 obras simultâneas",
        "Sem limite de pagamentos",
        "Sem taxa de implantação",
        "Ativação imediata"
      ],
      status: true,
      priceId: "price_1RhtcIHqDlGxRZfNe1wxXkpj"
    },
    {
      nome: "Profissional",
      preco: "89,99",
      descricao: "Mais controle e dados",
      beneficios: [
        "Até 10 obras simultâneas",
        "Sem limite de pagamentos",
        "Usuários ilimitados",
        "Relatórios e exportações",
        "Ativação imediata"
      ],
      status: true,
      priceId: "price_1RhteOHqDlGxRZfNJnMMt4VE"
    },
    {
      nome: "Equipe",
      preco: "149,99",
      descricao: "Para grandes times de obra e escritório",
      beneficios: [
        "Mais de 11 obras simultâneas",
        "3 contas de acesso",
        "Diário de obra incluso",
        "Ativação imediata"
      ],
      status: false, // Em breve
      priceId: "price_1RTn1dQWxc0UfbT25f6h5W6P"
    }
  ];

  const quantDiv = onPage
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch";

  const planosVisiveis = onPage ? planos.filter(p => p.nome !== "Gratuito") : planos;
  const ordemPlanos = ["Gratuito", "Essencial", "Profissional", "Equipe"];

  const podeContratar = (planoNome: string) => {
    if (!planoAtivo) return true;
    const indexPlano = ordemPlanos.indexOf(planoNome);
    const indexAtivo = ordemPlanos.indexOf(planoAtivo);
    return indexPlano >= indexAtivo; // impede downgrade
  };


  return (
    <section id="planos" className="bg-white py-20 px-4 font-manrope">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6">
        Escolha o plano ideal para a sua obra
      </h2>
      {/* Toggle mensal/anual - apenas visual por enquanto */}
      <div className="flex justify-center items-center gap-4 text-sm mb-10">
        <span className="font-semibold text-gray-800">Por mês</span>
        <div className="relative inline-block w-12 h-6">
          <input type="checkbox" className="sr-only peer" />
          <div className="bg-gray-300 peer-checked:bg-indigo-500 w-full h-full rounded-full transition-all duration-300"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-6" />
        </div>
        <span className="text-gray-500">Anual <span className="text-xs text-red-500">-10%</span></span>
      </div>

      <div className={quantDiv}>

        {planosVisiveis.map((plano) => {
          const isIndicado = indicados.includes(plano.nome);
          return (
            <div
            key={plano.nome}
            className={`relative border rounded-xl p-6 flex flex-col justify-between text-center h-full border-[#6366F159] shadow-[0px_4px_6px_0px_rgba(99,_102,_241,_0.9)]
              ${plano.nome === planoAtivo ? 'border-green-600 ring-2 ring-green-400' : ''} 
            `}
            >
              {isIndicado && plano.nome !== planoAtivo && (
                <div className="absolute -top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow">
                🎯 Indicado
                </div>
              )}

              {/* SELO PLANO ATUAL */}
              {plano.nome === planoAtivo && (
                <div className="absolute -top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">
                  ✔ Plano Atual
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">{plano.nome}</h3>
                   {plano.nome === "Gratuito" ? (
                    <p className="text-3xl font-extrabold text-gray-900 mb-2">
                    <span className="text-sm align-top font-normal">R$ </span>{plano.preco}
                    </p>):
                   (
                   <p className="text-3xl font-extrabold text-gray-900 mb-2">
                   <span className="text-sm align-top font-normal">R$ </span>{plano.preco}<span className="text-base font-normal text-xs">/mês</span>
                   </p>)} 

                <p className="text-sm text-gray-600 mb-4">{plano.descricao}</p>
                
                <hr className="my-4" />

                <ul className="text-sm text-gray-700 text-left space-y-2">
                  {plano.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-indigo-500">✓</span> {beneficio}
                    </li>
                  ))}
                </ul>
              </div>

              {plano.status ? (plano.nome === planoAtivo ? (
                  <button
                    disabled
                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded-md font-semibold cursor-default pointer-events-none"
                  >
                    Plano Atual
                  </button>
                ) :plano.nome === "Gratuito" ? (
                  <Link href="/register">
                    <button className="mt-6 w-full text-white bg-[#6366F1] border border-indigo-200 hover:border-indigo-400 py-2 px-4 rounded-xl font-semibold transition hover:shadow-lg hover:scale-105">
                      Iniciar teste
                    </button>
                  </Link>
                ) : (
                  <> {podeContratar(plano.nome) ? (
                      <button
                        onClick={() =>
                          plano.priceId &&
                          (email
                            ? iniciarCheckout(plano.priceId, email)
                            : iniciarCheckoutSemEmail(plano.priceId))
                        }
                        className="mt-6 w-full text-white bg-[#6366F1] border border-indigo-200 hover:border-indigo-400 py-2 px-4 rounded-xl font-semibold transition hover:shadow-lg hover:scale-105"
                      >
                        Assinar {plano.nome}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-6 bg-gray-300 text-gray-600 cursor-not-allowed py-2 px-4 rounded-md font-medium"
                      >
                        Indisponível
                      </button>
                    )}
                    </>
                )
              ) : (
                <button className="mt-6 bg-gray-300 text-gray-600 cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition"> Em breve</button>

              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
