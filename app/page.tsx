'use client';

import React, { useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import Link from "next/link";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { FaCheckCircle, FaMobileAlt, FaChartLine, FaShareAlt, FaArrowLeft, FaArrowRight, FaBook, FaPlane, FaBullhorn, FaPaypal, FaCreditCard, FaFolder, FaQuoteRight } from 'react-icons/fa';
import PlanosSection from './admin/planossection';
import Image from "next/image";
import Footer from '@/components/footer';
import { ArrowDown01Icon, BadgeDollarSignIcon, CircleArrowDownIcon, CircleArrowUpIcon, CircleChevronDown, EyeIcon, LucideMessageSquareQuote, MoveDownIcon, Quote, QuoteIcon, ShareIcon } from 'lucide-react';
import { ArrowDownCircleIcon, BellAlertIcon, ClipboardDocumentIcon, CogIcon, DevicePhoneMobileIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { Quattrocento_Sans } from 'next/font/google';
import Testimonials from '@/components/testimonials';

export default function Home() {
  const toggleFAQ = (index: number) => {
  setActiveFAQ(activeFAQ === index ? null : index);
  };

  const scrollToPlans = () => {
    const plansSection = document.getElementById('planos');
    if (plansSection) plansSection.scrollIntoView({ behavior: 'smooth' });
  };

  const slides = [
  {
    image: '/como1.svg',
    title: 'Passo 1. Cadastro',
    text: 'Cadastre-se para ter acesso o período de teste.'
  },
  {
    image: '/como2.svg',
    title: 'Passo 2. Login',
    text: 'Realizei o login pelo email e senha cadastrado.'
  },
  {
    image: '/como3.svg',
    title: 'Passo 3. Registro da Obra',
    text: 'Cadastre a obra com os dados mais importantes trazendo previsibilidade.'
  },
  {
    image: '/como4.svg',
    title: 'Passo 4. Registro Pagamento',
    text: 'Registre os pagamentos organizando por tipo e data.'
  },
  {
    image: '/como5.svg',
    title: 'Passo 5. Relatórios',
    text: 'Gere relatórios visuais e compartilhe facilmente com sua equipe ou cliente.'
  }
  ];

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

  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [index2, setIndex2] = useState(0);

  
  
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);



  

  const scrollByAmount = 300; // px

  const handleScrollMobile = (direction: 'left' | 'right') => {
    const ref = containerRef.current;
    if (ref) {
      ref.scrollBy({
        left: direction === 'left' ? -scrollByAmount : scrollByAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollLeft = containerRef.current.scrollLeft;
    const slideWidth = containerRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== index) setIndex(newIndex);
  };

   useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    ref.addEventListener('scroll', handleScroll, { passive: true });
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [index2]);

  return (
    <div className="bg-white text-cyan-900">
      <Head>
        <title>Gestão Obra Fácil</title>
      </Head>

      <header className="w-full bg-white border-b shadow-sm font-manrope">
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-center sm:justify-between">
        {/* Logo centralizada no mobile, alinhada à esquerda no desktop */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo_hd.svg" alt="Logo" width={120} height={26} />
        </Link>

        {/* Botão "Entrar" visível à direita no mobile com position absolute */}
        <Link
          href="/login"
          className="absolute right-4 sm:static flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
        >
          <PersonOutlineIcon className="h-4 w-4" /> Entrar
        </Link>
      </div>


        {/* Navegação responsiva */}
        <nav className="hidden sm:flex w-full border-t overflow-x-auto">
          <div className="max-w-7xl mx-auto w-full">
            <ul className="flex justify-center gap-4 sm:gap-6 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              <li><Link href="#">Institucional</Link></li>
              <li><Link href="#">Política</Link></li>
              <li><Link href="#">Conta</Link></li>
              <li><Link href="#">Atendimento</Link></li>
              <li><Link href="/planos">Planos</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <section className="relative bg-gradient-to-tr from-violet-50 via-indigo-50 to-fuchsia-100 text-white pt-20 px-4 overflow-hidden font-sans">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            
            <div className="md:max-w-xl z-10 w-full sm:text-left text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-black font-manrope">
                Controle os pagamentos da sua obra em um só lugar
              </h1>
              <p className="text-md md:text-lg text-gray-800 mb-6 font-medium font-manrope">
                Gestão simples e ágil, sem complicações nem planilhas.
              </p>

              {/* Botão visível só no desktop */}
              <div className="w-full sm:flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <button
                  onClick={scrollToPlans}
                  className="bg-[#6366F1] rounded-xl hover:bg-blue-700 text-white px-6 py-3 font-semibold"
                >
                  Ver planos →
                </button>
              </div>

              {/* "Descubra mais" visível só no desktop */}
              <div className="hidden sm:flex items-center gap-2 text-gray-500 px-6 py-3 font-semibold">
                <ExpandCircleDownIcon width={64} height={64} className="text-gray-400" />
                <span>Descubra mais</span>
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:ml-10 z-10">
              <Image
                src="/tela_lp.svg"
                alt="App Screenshot"
                width={400}
                height={600}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* overlay visual */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-40 pointer-events-none" />
        </section>


    <section className="bg-white py-20 px-4 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Imagem esquerda */}
        <div className="w-full md:w-1/2 hidden md:flex">
          <Image
            src="/tela_lp2.svg" 
            alt="App Screenshot"
            width={500}
            height={500}
            className="mx-auto"
          />
        </div>

        {/* Texto + recursos */}
        <div className="w-full md:w-1/2 px-4">
          <h2 className="text-center sm:flex text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-manrope">
            Feito para quem vive o dia a dia de obra
          </h2>
          <p className="text-center sm:text-left text-gray-700 mb-8">
            Quem vive o dia a dia de obra não tem tempo a perder. Por isso, criamos uma ferramenta que descomplica a gestão e te ajuda a manter tudo no controle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-manrope">
            {[
              {
                icon: <ClipboardDocumentIcon className="w-6 h-6 text-purple-500 " />, title: 'Acompanhamento', desc: 'Acompanhe entradas e saídas em tempo real.'
              },
              {
                icon: <DevicePhoneMobileIcon className="w-6 h-6 text-purple-500" />, title: 'Acessibilidade', desc: 'Funciona no celular ou no computador.'
              },
              {
                icon: <DocumentTextIcon className="w-6 h-6 text-purple-500" />, title: 'Relatórios', desc: 'Tenha acesso a relatórios simples e visuais.'
              },
              {
                icon: <BellAlertIcon className="w-6 h-6 text-purple-500" />, title: 'Notificações', desc: 'Contém alertas e relatórios automatizados.'
              },
              {
                icon: <EyeIcon className="w-6 h-6 text-purple-500" />, title: 'Documentação', desc: 'Evite retrabalho e perda de notas fiscais.'
              },
              {
                icon: <ShareIcon className="w-6 h-6 text-purple-500" />, title: 'Compartilhamento', desc: 'Compartilhamento fácil com a sua equipe.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

      

    <section className="bg-gradient-to-tr from-fuchsia-50 via-indigo-50 to-violet-100 py-20 px-4 text-center font-manrope">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
        Saiba como funciona
      </h2>

      {/* MOBILE: com setas e carrossel */}
      <div className="relative md:hidden mb-8">
        {/* SETA ESQUERDA */}
        <button
          onClick={() => handleScrollMobile('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
          aria-label="Voltar"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full shadow p-2">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </div>
        </button>

        {/* SETA DIREITA */}
        <button
          onClick={() => handleScrollMobile('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
          aria-label="Avançar"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full shadow p-2">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </div>
        </button>

        {/* CARROSSEL MOBILE */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar justify-start gap-4 px-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full max-w-xs snap-center transition-all duration-300"
              onClick={() => setIndex(i)}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`rounded-xl mx-auto ${
                  i === index ? 'scale-100 opacity-100' : 'opacity-50'
                } transition-all`}
                width={280}
                height={360}
              />
            </div>
          ))}
        </div>
      </div>


      {/* DESKTOP: um slide centralizado, muda via bullet */}
      <div className="hidden md:block mb-8">
        <div className="flex justify-center">
          <Image
            src={slides[index]?.image}
            alt={slides[index]?.title}
            width={480}
            height={360}
            className="rounded-xl transition-all duration-300 mx-auto"
          />
        </div>
      </div>

      {/* Texto explicativo */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{slides[index]?.title}</h3>
        <p className="text-gray-600 text-sm">{slides[index]?.text}</p>
      </div>

      {/* Bullets visíveis no desktop */}
      <div className="hidden md:flex justify-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === i ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </section>



    <div className="h-1 w-1/2 bg-violet-500 rounded-full" />

    <Testimonials/>
  
    <div className="h-1 w-1/3 bg-violet-500 rounded-full" />

    <PlanosSection onPage={false} indicados={['Essencial']}/>
      <section className="bg-white py-20 px-4 sm:px-6 max-w-4xl mx-auto font-sans">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-4">
        <p>
          Dúvidas Frequentes 
        </p>
        Tudo que você precisa saber sobre nossa solução
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Respostas claras e rápidas para as perguntas que mais recebemos, para facilitar sua experiência.
      </p>

      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden">
        {faqData.map((item, index) => {
          const isOpen = activeFAQ === index;
          return (
            <div key={index} className="bg-white">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left font-medium text-gray-900 hover:bg-gray-50 transition"
              >
                <span>{item.question}</span>
                {isOpen ? (
                   <KeyboardArrowUpIcon sx={{ color: 'indigo'}}/>
                ) : (
                  <ExpandCircleDownIcon color="action"/>
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-gray-600 text-sm">
                  {item.answer === 'custom-link' ? (
                    <p>
                      Após a confirmação da assinatura será enviado um e-mail com link para o primeiro acesso. Caso não receba,{' '}
                      <Link href="/register" className="text-indigo-500 underline">clique aqui para se registrar</Link>.
                    </p>
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
    <Footer/>
    </div>
  );
}