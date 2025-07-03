import React from 'react';
import Link from 'next/link';

export default function GestaoPagamentosConstrucao() {
  return (
    <main className="max-w-3xl mx-auto bg-white px-4 py-2 rounded-md text-sm font-medium shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Gestão de Pagamentos na Construção Civil
      </h1>
      <p className="text-gray-700 mb-6">
        O controle de pagamentos é um dos maiores desafios de quem gerencia obras. Atrasos, pagamentos duplicados ou esquecidos podem comprometer o orçamento e o cronograma. Pensando nisso, o <strong>Gestão Obra Fácil</strong> oferece uma solução prática e visual para centralizar e acompanhar todos os pagamentos da sua obra.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Benefícios da automação no controle de pagamentos
      </h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Aviso de pagamentos vencidos e futuros</li>
        <li>Categorização por tipo de gasto: material, mão de obra, etc.</li>
        <li>Relatórios por obra, período ou tipo de despesa</li>
        <li>Redução de falhas humanas</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Tudo em um só lugar, acessível de qualquer dispositivo
      </h2>
      <p className="text-gray-700 mb-4">
        Com o sistema Gestão Obra Fácil, você pode acessar seus lançamentos de qualquer lugar, manter o histórico atualizado e tomar decisões com base em dados reais da sua obra.
      </p>

      <Link
        href="/register"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md mt-6"
      >
        Começar agora gratuitamente
      </Link>
    </main>
  );
}
