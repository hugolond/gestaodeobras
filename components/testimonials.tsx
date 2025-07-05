import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { FaQuoteRight } from 'react-icons/fa';

const testimonials = [
  {
    text: "“Antes eu anotava tudo no caderno e vivia perdido. Agora tenho tudo em um só lugar.”",
    author: "João Mendes, Mestre de Obras",
    city: "Londrina/PR",
    gender: true
  },
  {
    text: "“Facilitou meu trabalho com o financeiro. Recomendo para qualquer construtora.”",
    author: "Fernanda Lopes, Engenheira Civil",
    city: "Astorga/PR",
    gender: false
  },
  {
    text: "“Economizei tempo e reduzi os erros. A equipe toda usa!”",
    author: "Carlos Silva, Gerente de obras",
    city: "Barra Velha/PR",
    gender: true
  },
  {
    text: "“Agora posso colocar meus pagamentos em apenas um lugar, muito bom!”",
    author: "Braga Neto, Mestre de Obras",
    city: "Rio Claro/SP",
    gender: true
  },
  {
    text: "“Consegui me organizar e saber quantos gastei em cada obra!”",
    author: "João Miguel, Construtor/Corretor",
    city: "Rosana/SP",
    gender: true
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const AUTOPLAY_INTERVAL_MS = 20000;

  const maxScrollIndex = Math.ceil(testimonials.length / visible) - 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        return prev >= maxScrollIndex ? 0 : prev + 1;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [maxScrollIndex]); 

  return (
    <section id= "depoimento" className="bg-white py-20 px-4 font-sans">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
        Depoimentos de nossos clientes
      </h2>
      <div className="max-w-6xl mx-auto overflow-x-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out min-w-[100%] gap-4"
          style={{
            transform: `translateX(-${current * (100 / visible)}%)`,
            width: `${(testimonials.length / visible) * 100}%`
          }}
        >
          {testimonials.map((item, index) => (
            <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-[320px] sm:w-[300px] flex-shrink-0 mx-auto sm:mx-2 flex flex-col justify-between min-h-[200px]"
              >
                {/* Citação */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute -top-6 -left-3">
                      <div className="bg-indigo-500 w-8 h-8 rounded-md flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          <FaQuoteRight />
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm pt-6 leading-relaxed line-clamp-3">
                      {item.text}
                    </p>
                  </div>
                </div>

                {/* Autor */}
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={item.gender ? "/46-avatar.svg" : "/46-avatar-w.svg"}
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="flex flex-col justify-center leading-snug">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.author}
                    </p>
                    <p className="text-xs text-gray-500">• {item.city}</p>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
