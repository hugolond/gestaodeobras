'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from "next/link";
import { FaCheckCircle, FaMobileAlt, FaChartLine, FaShareAlt, FaArrowLeft, FaArrowRight, FaBook, FaPlane, FaBullhorn, FaPaypal, FaCreditCard, FaFolder } from 'react-icons/fa';
import PlanosSection from './admin/planossection';
import Logo from "app/assets/logo.svg";
import Image from "next/image";

export default function Home() {
  const toggleFAQ = (index: number) => {
  setActiveFAQ(activeFAQ === index ? null : index);
  };

  const scrollToPlans = () => {
    const plansSection = document.getElementById('planos');
    if (plansSection) plansSection.scrollIntoView({ behavior: 'smooth' });
  };

  const faqData = [
  {
    question: 'Como funciona o teste gratuito?',
    answer: 'Você pode usar todas as funcionalidades do plano Essencial por 15 dias gratuitamente. Após esse período, escolha um plano para continuar.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim. Você pode cancelar sua assinatura a qualquer momento diretamente pela plataforma, sem burocracia.'
  },
  {
    question: 'É possível usar com a minha equipe?',
    answer: 'Claro! O plano Equipe é ideal para construtoras com times administrativos e de obra.'
  },
  {
    question: 'No plano Essencial posso ter quantas obras ativas?',
    answer: 'Este plano e direcionado para construtores que utilizam no máximo 3 obras ativas.'
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim. Você pode fazer upgrade ou downgrade de plano conforme sua necessidade, acesso o portal clicando em configurações.'
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito. Em breve disponibilizaremos Pix.'
  },
  {
  question: 'Realizei o pagamento da assinatura, agora qual o próximo passo para acessar?',
  answer: 'Após a confirmação da assinatura será enviado um e-mail com link para o primeiro acesso. Caso não receba, <a href="/register" class="text-[#28a9b8] underline">clique aqui para se registrar</a>.'
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer: 'Não. A plataforma funciona direto no navegador, tanto em celular quanto em computador.'
  },
  {
    question: 'Consigo exportar meus dados?',
    answer: 'Sim. No plano Profissional você pode gerar relatórios e exportar para PDF ou Excel.'
  },
  {
    question: 'É possível cadastrar mais de um usuário por obra?',
    answer: 'Sim. O plano Profissional permite múltiplos usuários por obra com permissões específicas.'
  },
  {
    question: 'O sistema avisa quando um pagamento está atrasado?',
    answer: 'Sim. A plataforma exibe alertas visuais e envia notificações sobre pagamentos pendentes ou atrasados.'
  },
  {
    question: 'Qual é o tempo de suporte?',
    answer: 'Nosso suporte responde em até 24h úteis via e-mail ou WhatsApp (13) 4042-4748.'
  }
  ];

  const testimonials = [
    {
      text: "“Antes eu anotava tudo no caderno e vivia perdido. Agora tenho tudo em um só lugar.”",
      author: "João Mendes, Mestre de Obras",
      city: "Londrina/PR"
    },
    {
      text: "“Facilitou meu trabalho com o financeiro. Recomendo para qualquer construtora.”",
      author: "Fernanda Lopes, Engenheira Civil",
      city: "Astorga/PR"
    },
    {
      text: "“Economizei tempo e reduzi os erros. A equipe toda usa!”",
      author: "Carlos Silva, Gerente de obras",
      city: "Barra Velha/PR"
    },
    {
      text: "“Agora posso colocar meus pagamentos em apenas um lugar, muito bom!”",
      author: "Braga Neto, Mestre de Obras",
      city: "Rio Claro/SP"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const planClasses = (plan: string) =>
    `cursor-pointer bg-white rounded-lg p-6 transition border-2 ${
      selectedPlan === plan ? 'border-gray-800' : 'border-transparent'
    } hover:border-gray-600`;

  const iniciarCheckout = async (priceId: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="bg-white text-cyan-900">
      <Head>
        <title>Gestão Obra Fácil</title>
      </Head>
      {/* Banner topo com logo */}
      <div className="bg-cyan-800 text-white text-center py-2 px-4 text-sm">
        Promoção especial: Teste grátis por 15 dias!
      </div>
      <header className="bg-white px-6 py-6 shadow-md flex justify-between items-center">
        {/* Botão - visível no desktop como fixo à direita */}
        <div className="hidden md:block absolute right-6">
          <Link href="/admin">
            <button className="flex items-center gap-2 bg-cyan-800 hover:bg-cyan-900 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
              Acesse agora <FaArrowRight />
            </button>
          </Link>
        </div>

        {/* Botão no mobile (abaixo da logo, centralizado) */}
        <div className="block md:hidden mt-4 w-full text-center">
          <Link href="/admin">
            <button className="flex items-center bg-cyan-800 gap-2 hover:bg-cyan-900 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
              Acesse agora <FaArrowRight />
            </button>
          </Link>
        </div>
      </header>


      <header className="bg-white px-6 py-4 shadow-md flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <Image className="bg-white rounded-lg bg-white shadow-xl w-64 md:w-128 h-auto" priority src={Logo} alt="Logo" />
        </div>  
      </header>

    
      <section className="bg-gray-50 py-16 px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-900 mb-4">
          Controle os pagamentos da sua obra em um só lugar
        </h1>
        <p className="text-base sm:text-lg mb-6">
          Simples, rápido e sem planilhas.
        </p>
        <div>
          <button onClick={scrollToPlans} className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-900 transition">
            Ver planos
          </button>
        </div>
        <p className="text-sm mt-4">+100 construtores já organizam suas obras com mais controle.</p>
      </section>

      <section className="bg-white py-12 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-cyan-900 mb-6">
          Feito para quem vive o dia a dia da obra:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <ul className="text-left space-y-3">
            <li className="flex items-center gap-2"><FaCheckCircle className="text-gray-800" /> Acompanhe entradas e saídas em tempo real</li>
            <li className="flex items-center gap-2"><FaChartLine className="text-gray-800" /> Tenha relatórios simples e visuais</li>
            <li className="flex items-center gap-2"><FaFolder className="text-gray-800" /> Evite retrabalho e perda de notas</li>
            <li className="flex items-center gap-2"><FaCreditCard className="text-gray-800" /> Vários planos para melhor encaixar</li>
          </ul>
          <ul className="text-left space-y-3">
            <li className="flex items-center gap-2"><FaMobileAlt className="text-gray-800" /> Funciona no celular e no computador</li>
            <li className="flex items-center gap-2"><FaChartLine className="text-gray-800" /> Alertas e relatórios automáticos</li>
            <li className="flex items-center gap-2"><FaShareAlt className="text-gray-800" /> Compartilhamento fácil com sua equipe</li>
            <li className="flex items-center gap-2"><FaBook className="text-gray-800" /> Diário de obra para registar seu dia a dia</li>
          </ul>
        </div>
      </section>

      <section className="bg-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative text-center">
          <h2 className="text-2xl font-bold text-cyan-900 mb-6">O que dizem nossos usuários:</h2>
          <div className="flex items-center justify-center gap-4 relative">
            <button onClick={handlePrev} className="absolute left-0 p-2 bg-white border rounded-full hover:bg-gray-200">
              <FaArrowLeft />
            </button>
            <div className="transition-all duration-700 ease-in-out mx-10 min-h-[100px]">
              <blockquote className="text-lg italic text-gray-900">{testimonials[currentTestimonial].text}</blockquote>
              <p className="text-sm font-semibold mt-2 text-gray-900">{testimonials[currentTestimonial].author}</p>
              <p className="text-sm font-semibold text-gray-900">{testimonials[currentTestimonial].city}</p>
            </div>
            <button onClick={handleNext} className="absolute right-0 p-2 bg-white border rounded-full hover:bg-gray-200">
              <FaArrowRight />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  currentTestimonial === index ? 'bg-gray-800' : 'bg-gray-400'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

     <PlanosSection onPage={false} indicados={['Essencial']}/>
      <section className="bg-white py-16 px-4 sm:px-6 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Perguntas Frequentes</h2>
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left font-medium text-gray-800 text-lg"
            >
              {item.question}
              <span className="ml-4">{activeFAQ === index ? '−' : '+'}</span>
            </button>
            {activeFAQ === index && (
              <p
                className="mt-2 text-gray-600 transition-all"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}