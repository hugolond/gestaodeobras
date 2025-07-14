import React from 'react';

const PoliticaPrivacidade = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-800 bg-white">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <p className="mb-4">Última atualização: 9 de julho de 2025</p>

      <p className="mb-6">
        Bem-vindo ao <strong>Gestão Obra Fácil</strong>. Esta Política de Privacidade descreve como coletamos,
        usamos, armazenamos e protegemos os dados pessoais dos usuários que acessam nosso site e utilizam nossos
        serviços.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">1. Dados que Coletamos</h2>
      <p className="mb-2 font-medium">a) Informações fornecidas por você:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Nome completo</li>
        <li>E-mail</li>
        <li>CPF/CNPJ</li>
        <li>Endereço de cobrança</li>
        <li>Informações de pagamento (via Stripe)</li>
        <li>Dados de acesso (usuário e senha)</li>
      </ul>
      <p className="mb-2 font-medium">b) Informações coletadas automaticamente:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Endereço IP</li>
        <li>Dados de uso e navegação</li>
        <li>Tipo de navegador e dispositivo</li>
        <li>Registros de acesso e ações no sistema</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Finalidade do Uso dos Dados</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Processamento de pagamentos e assinatura de planos</li>
        <li>Acesso e autenticação de usuários</li>
        <li>Emissão de comprovantes e relatórios</li>
        <li>Envio de e-mails operacionais</li>
        <li>Melhoria da experiência e segurança da plataforma</li>
        <li>Cumprimento de obrigações legais e regulatórias</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Compartilhamento de Dados</h2>
      <p className="mb-4">
        Os dados podem ser compartilhados com:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Stripe (processamento de pagamentos)</li>
        <li>Serviços de autenticação (NextAuth)</li>
        <li>Serviços de e-mail (como Resend)</li>
        <li>Autoridades legais, se exigido por lei</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Armazenamento e Segurança</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Criptografia de senhas (via Bcrypt)</li>
        <li>Uso de HTTPS para comunicação segura</li>
        <li>Acesso restrito e monitorado</li>
        <li>Atualizações contínuas de segurança</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookies e Tecnologias de Rastreamento</h2>
      <p className="mb-6">
        Utilizamos cookies para gerenciar sessões, autenticar usuários e melhorar a navegação. Você pode gerenciar
        cookies nas configurações do navegador.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">6. Direitos dos Usuários</h2>
      <p className="mb-6">
        Você pode acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Basta entrar em contato pelo
        e-mail <strong>contato@gestaoobrafacil.com.br</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">7. Alterações nesta Política</h2>
      <p className="mb-6">
        Podemos atualizar esta Política a qualquer momento. Alterações significativas serão notificadas por e-mail ou
        na própria plataforma.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">8. Contato</h2>
      <p>
        Dúvidas sobre esta Política? Fale conosco pelo e-mail <strong>contato@gestaoobrafacil.com.br</strong> ou
        acesse <strong>www.gestaoobrafacil.com.br</strong>.
      </p>
    </div>
  );
};

export default PoliticaPrivacidade;