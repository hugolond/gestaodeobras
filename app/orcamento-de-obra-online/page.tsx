import React from 'react';
import Link from 'next/link';

export default function OrcamentoObraOnline() {
  return (
    <main className="max-w-3xl mx-auto bg-white px-4 py-2 rounded-md text-sm font-medium shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Orçamento de Obra Online
      </h1>
      <p className="text-gray-700 mb-6">
        Fazer o orçamento de uma obra não precisa ser complicado. Com o <strong>Gestão Obra Fácil</strong>, você consegue planejar os custos da sua construção de forma prática, online e com visão clara do previsto vs realizado.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Como funciona o orçamento no sistema?
      </h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Você cadastra as etapas da obra e define valores previstos</li>
        <li>Insere pagamentos conforme ocorrem</li>
        <li>Acompanha gráficos que comparam o orçado com o gasto real</li>
        <li>Gera relatórios por etapa, obra ou categoria</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
        Benefícios de fazer orçamento com o Obra Fácil
      </h2>
      <p className="text-gray-700 mb-4">
        - Reduz erros e esquecimentos
        <br />- Mantém o controle mesmo com várias obras ativas
        <br />- Acesso online de qualquer lugar
        <br />- Visual intuitivo e fácil de usar
      </p>

      <Link
        href="/register"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md mt-6"
      >
        Planejar minha obra agora
      </Link>
    </main>
  );
}
