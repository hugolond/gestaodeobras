'use client';

import { useState } from "react";
import Link from "next/link";

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
      descricao: "Ideal para testar - 15 dias",
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
      priceId: "price_1RTmzaQWxc0UfbT2xJHDYuZO"
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
      priceId: "price_1RTn0jQWxc0UfbT2aLtABvEB"
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
    ? "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8 items-stretch"
    : "grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8 items-stretch";

  const planosVisiveis = onPage ? planos.filter(p => p.nome !== "Gratuito") : planos;
  const ordemPlanos = ["Gratuito", "Essencial", "Profissional", "Equipe"];

  const podeContratar = (planoNome: string) => {
    if (!planoAtivo) return true;
    const indexPlano = ordemPlanos.indexOf(planoNome);
    const indexAtivo = ordemPlanos.indexOf(planoAtivo);
    return indexPlano >= indexAtivo; // impede downgrade
  };


  return (
    <section className="bg-white py-16 px-4 sm:px-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-10">
        Escolha o plano ideal para seu negócio:
      </h2>

      <div className={quantDiv}>
        
        {planosVisiveis.map((plano) => {
          const isIndicado = indicados.includes(plano.nome);
          return (
            <div
            key={plano.nome}
            className={`relative rounded-lg border p-6 shadow-sm flex flex-col justify-between
              ${isIndicado ? 'border-yellow-600 ring-2 ring-yellow-400' : 'border-gray-200'}
              ${plano.nome === planoAtivo ? 'border-green-600 ring-2 ring-green-400' : ''}
            `}
            >
              {isIndicado && plano.nome !== planoAtivo && (
                <div className="absolute -top-3 -right-3 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full shadow">
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
                <h3 className="text-xl font-semibold mb-1">{plano.nome}</h3>
                   {plano.nome === "Gratuito" ? (
                    <p className="text-xl font-bold italic text-gray-800 mb-1">
                    <span className="text-sm align-top">R$ </span>{plano.preco}
                    </p>):
                   (
                   <p className="text-2xl font-bold italic text-gray-800 mb-1">
                   <span className="text-xs align-top">R$ </span>{plano.preco}<span className="text-base font-normal text-xs">/mês</span>
                   </p>)} 

                <p className="text-sm text-gray-600 mb-4">{plano.descricao}</p>

                <ul className="text-sm text-gray-700 space-y-2 text-left mt-4">
                  {plano.beneficios.map((beneficio, idx) => (
                    <li key={idx}>• {beneficio}</li>
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
                    <button className="mt-6 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition">
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
                        className="mt-6 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium transition hover:shadow-lg hover:scale-105"
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
