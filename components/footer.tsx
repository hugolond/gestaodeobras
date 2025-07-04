'use client';

import { useState } from 'react';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

type LinkItem = {
  label: string;
  href: string;
};

const FooterSection = ({ title, links }: { title: string; links: LinkItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden border-b py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center font-semibold text-gray-800 text-left"
      >
        {title}
        <ExpandCircleDownIcon
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fontSize="small"
        />
      </button>
      {isOpen && (
        <ul className="mt-2 space-y-1 pl-2 text-sm text-gray-600">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} className="hover:underline">{link.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm border-t mt-16 font-manrope">
      {/* Mobile – Accordion */}
      <div className="px-4 py-6 sm:hidden">
        <FooterSection
          title="Institucional"
          links={[
            { label: 'Quem somos', href: '/sobre' },
            { label: 'Trabalhe conosco', href: '/trabalhe-conosco' },
            { label: 'Seja um cliente', href: '/seja-cliente' },
            { label: 'Nossos sistemas', href: '/sistemas' },
          ]}
        />
        <FooterSection
          title="Política"
          links={[
            { label: 'Assinaturas', href: '/planos' },
            { label: 'Pagamento', href: '/pagamento' },
            { label: 'Privacidade', href: '/privacidade' },
            { label: 'Dúvidas frequentes', href: '/faq' },
          ]}
        />
        <FooterSection
          title="Conta"
          links={[
            { label: 'Minha conta', href: '/login' },
            { label: 'Assinar Plus+', href: '/plus' },
            { label: 'Consulte seu plano', href: '/planos' },
          ]}
        />
        <FooterSection
          title="Atendimento"
          links={[
            { label: 'SAC', href: '/sac' },
            { label: 'FAQ', href: '/faq' },
          ]}
        />
      </div>

      {/* Desktop – Grid layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 hidden sm:grid grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Institucional</h4>
          <ul className="space-y-1">
            <li><a href="/sobre" className="hover:underline">Quem somos</a></li>
            <li><a href="/trabalhe-conosco" className="hover:underline">Trabalhe conosco</a></li>
            <li><a href="/seja-cliente" className="hover:underline">Seja um cliente</a></li>
            <li><a href="/sistemas" className="hover:underline">Nossos sistemas</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Política</h4>
          <ul className="space-y-1">
            <li><a href="/planos" className="hover:underline">Assinaturas</a></li>
            <li><a href="/pagamento" className="hover:underline">Pagamento</a></li>
            <li><a href="/privacidade" className="hover:underline">Privacidade</a></li>
            <li><a href="/faq" className="hover:underline">Dúvidas frequentes</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Conta</h4>
          <ul className="space-y-1">
            <li><a href="/login" className="hover:underline">Minha conta</a></li>
            <li><a href="/plus" className="hover:underline">Assinar Plus+</a></li>
            <li><a href="/planos" className="hover:underline">Consulte seu plano</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Atendimento</h4>
          <ul className="space-y-1">
            <li><a href="/sac" className="hover:underline">SAC</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
      </div>

      {/* Rodapé final */}
      <div className="border-t border-gray-300 text-center text-xs text-gray-500 py-4">
        © 2025 Gestão Obra Fácil. Todos os direitos reservados.
      </div>
    </footer>
  );
}