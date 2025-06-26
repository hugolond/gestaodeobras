import React from 'react';
import Link from 'next/link';

export default function ComparativoSistemaVsPlanilha() {
  return (
    <main className="max-w-3xl mx-auto bg-white px-4 py-2 rounded-md text-sm font-medium shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Sistema vs Planilha: Qual a melhor forma de gerenciar sua obra?
      </h1>
      <p className="text-gray-700 mb-6">
        Ainda está em dúvida entre usar planilhas ou um sistema para gerenciar sua obra? Este comparativo ajuda você a entender as diferenças, vantagens e riscos de cada abordagem.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Por que muitos começam com planilhas?</h2>
      <p className="text-gray-700 mb-4">
        Planilhas são fáceis de acessar e não exigem investimento inicial. No entanto, à medida que a obra cresce ou se multiplicam os lançamentos, os erros, repetições e dificuldades de análise aumentam.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Principais diferenças</h2>
      <table className="w-full text-left text-sm text-gray-700 border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Recurso</th>
            <th className="border px-3 py-2">Planilha</th>
            <th className="border px-3 py-2">Sistema Obra Fácil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-2">Visualização de dados</td>
            <td className="border px-3 py-2">Manual</td>
            <td className="border px-3 py-2">Gráficos automáticos</td>
          </tr>
          <tr>
            <td className="border px-3 py-2">Controle por obra</td>
            <td className="border px-3 py-2">Difícil com múltiplas abas</td>
            <td className="border px-3 py-2">Separação e filtro por obra</td>
          </tr>
          <tr>
            <td className="border px-3 py-2">Acesso remoto</td>
            <td className="border px-3 py-2">Limitado</td>
            <td className="border px-3 py-2">Online, qualquer dispositivo</td>
          </tr>
          <tr>
            <td className="border px-3 py-2">Alertas e relatórios</td>
            <td className="border px-3 py-2">Necessita fórmulas manuais</td>
            <td className="border px-3 py-2">Automatizados e visuais</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Conclusão</h2>
      <p className="text-gray-700 mb-4">
        Para obras pequenas e pontuais, a planilha pode resolver. Mas para quem precisa de controle contínuo, vários lançamentos, previsões e integração, o sistema Gestão Obra Fácil é a escolha ideal.
      </p>

      <Link
        href="/register"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md mt-6"
      >
        Testar o sistema gratuitamente
      </Link>
    </main>
  );
}