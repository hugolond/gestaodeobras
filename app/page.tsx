'use client';

import React, { useState, useEffect, useRef} from 'react';
import Head from 'next/head';
import Link from "next/link";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { FaCheckCircle, FaMobileAlt, FaChartLine, FaShareAlt, FaArrowLeft, FaArrowRight, FaBook, FaPlane, FaBullhorn, FaPaypal, FaCreditCard, FaFolder, FaQuoteRight } from 'react-icons/fa';
import PlanosSection from './admin/planossection';
import Image from "next/image";
import Footer from '@/components/footer';
import { ArrowDown01Icon, BadgeDollarSignIcon, CircleArrowDownIcon, CircleArrowUpIcon, CircleChevronDown, EyeIcon, LucideMessageSquareQuote, MoveDownIcon, Quote, QuoteIcon, ShareIcon } from 'lucide-react';
import { ArrowDownCircleIcon, BellAlertIcon, ClipboardDocumentIcon, CogIcon, DevicePhoneMobileIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { Quattrocento_Sans } from 'next/font/google';

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

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [index2, setIndex2] = useState(0);
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const handleBulletClick = (i: number) => setCurrent(i);
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="bg-white text-cyan-900">
      <Head>
        <title>Gestão Obra Fácil</title>
      </Head>

      <header className="w-full bg-white border-b shadow-sm font-manrope">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo_hd.svg" alt="Logo" width={120} height={26} />
    </Link>

    {/* Botão "Entrar" */}
    <Link
      href="/login"
      className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-indigo-600 transition"
    >
      <PersonOutlineIcon className="h-4 w-4" /> Entrar
    </Link>
  </div>

  {/* Navegação responsiva */}
  <nav className="w-full border-t overflow-x-auto">
    <ul className="flex justify-start sm:justify-center gap-4 sm:gap-6 px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
      <li><Link href="#">Institucional</Link></li>
      <li><Link href="#">Política</Link></li>
      <li><Link href="#">Conta</Link></li>
      <li><Link href="#">Atendimento</Link></li>
      <li><Link href="/planos">Planos</Link></li>
    </ul>
  </nav>
</header>

      {/* Banner topo com logo */}
      <section className="relative bg-gradient-to-tr from-violet-50 via-indigo-50 to-fuchsia-100 text-white pt-20 px-4 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:max-w-xl z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-black font-manrope">
            Controle os pagamentos da sua obra em um só lugar
          </h1>
          <p className="text-md md:text-lg text-gray-800 mb-6 font-medium font-manrope">
            Gestão simples e ágil, sem complicações nem planilhas.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <button onClick={scrollToPlans} className="bg-[#6366F1] rounded-xl hover:bg-blue-700 text-white px-6 py-3 font-semibold ">
              Ver planos →
            </button>
            
          </div>
          <div className="flex items-center gap-2 text-gray-500 px-6 py-3 font-semibold">
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
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-manrope">
            Feito para quem vive o dia a dia de obra
          </h2>
          <p className="text-gray-700 mb-8">
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

      {/* Carrossel scrollável */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar justify-start md:justify-center gap-4 md:gap-8 px-2 md:px-0 mb-8"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full max-w-xs md:max-w-sm snap-center transition-all duration-300"
            onClick={() => setIndex(i)}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width={280}
              height={360}
              className={`rounded-xl mx-auto ${
                i === index ? 'scale-100 opacity-100' : 'opacity-50'
              } transition-all`}
            />
          </div>
        ))}
      </div>

      {/* Texto explicativo que muda conforme o scroll */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{slides[index]?.title}</h3>
        <p className="text-gray-600 text-sm">{slides[index]?.text}</p>
      </div>

      {/* Bullets visíveis apenas em telas maiores */}
      <div className="hidden md:flex justify-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const ref = containerRef.current;
              if (ref) {
                ref.scrollTo({
                  left: i * ref.offsetWidth,
                  behavior: 'smooth',
                });
              }
            }}
            className={`w-3 h-3 rounded-full ${index === i ? 'bg-indigo-600' : 'bg-gray-300'}`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </section>


    <div className="h-1 w-1/2 bg-violet-500 rounded-full" />

    <section className="bg-white py-20 px-4 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
        Depoimentos de nossos clientes
      </h2>

      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out min-w-[100%]"
          style={{ transform: `translateX(-${current * (100 / visible)}%)`, width: `${(testimonials.length / visible) * 100}%` }}
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-[320px] sm:w-[300px] flex-shrink-0 mx-auto sm:mx-2"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-3">
                  <div className="bg-indigo-500 w-8 h-8 rounded-md flex items-center justify-center">
                    <span className="text-white text-xl font-bold"><FaQuoteRight/></span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm pt-4 leading-relaxed">{item.text}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Image
                  src="/46-avatar.svg"
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.author}</p>
                  <p className="text-xs text-gray-500">• {item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bullets */}
        <div className="hidden sm:flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => handleBulletClick(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === current ? 'bg-indigo-600' : 'bg-gray-300'}`}
              aria-label={`Ver slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  
    
      

      

      

      
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