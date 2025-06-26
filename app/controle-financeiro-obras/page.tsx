import React from 'react';
import Link from 'next/link';

export default function ControleFinanceiroObras() {
  return (
    <main className="max-w-3xl mx-auto bg-white px-4 py-2 rounded-md text-sm font-medium shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Controle Financeiro para Obras
      </h1>
      <p className="text-gray-700 mb-6">
        Se você trabalha com construção civil, sabe que controlar os pagamentos, recebimentos e previsões é essencial para não perder dinheiro e manter a obra no prazo. Pensando nisso, o <strong>Gestão Obra Fácil</strong> oferece um sistema completo para o controle financeiro da sua obra.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Por que usar um sistema ao invés de planilhas?
      </h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Centraliza todos os lançamentos em um só lugar</li>
        <li>Visualiza o previsto vs realizado por obra</li>
        <li>Recebe alertas e relatórios automáticos</li>
        <li>Evita erros manuais de planilhas</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Como funciona o Gestão Obra Fácil?
      </h2>
      <p className="text-gray-700 mb-4">
        Você cadastra suas obras, define valores previstos e insere os pagamentos conforme eles ocorrem. O sistema gera gráficos, relatórios e previsões de saldo automático. Simples, rápido e visual.
      </p>

      <Link
        href="/register"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md mt-6"
      >
        Criar conta grátis
      </Link>
    </main>
  );
}
