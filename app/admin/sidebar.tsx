"use client";

import AuthDados from "@/components/auth-dados";
import { SessionProvider, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Home from "../assets/home.svg";
import Logout from "../assets/logout.svg";
import Logo from "../assets/marca.png";
import Pedido from "../assets/pedido.svg";
import Setting from "../assets/setting.svg";
import Ship from "../assets/ship.svg";
import Cnpj from "../assets/cnpj.svg";
import Client from "../assets/client.svg";
import { BoxText } from "../admin/boxText";

import { DevicePhoneMobileIcon ,HomeModernIcon ,CreditCardIcon, PresentationChartBarIcon ,AdjustmentsHorizontalIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/solid'
import { ArrowUpIcon } from "lucide-react";


export default function Sidebar() {
  const [elementVisiblePedidos, setElementVisiblePedidos] = useState(false);
  const [elementVisibleShip, setElementVisibleShip] = useState(false);
  const [elementVisibleRegisterCNPJ, setElementVisibleRegisterCNPJ] = useState(false);
  const [showSidebar, setShowSideBar] = useState(false);

  const estiloicon = "size-8 text-gray-400"

  const sidebarBase =
    "flex items-center p-2 space-x-3 rounded-md text-white hover:bg-[#2C3E50] transition-colors duration-200";
  const sidebarButton =
    "flex w-full items-center p-3 space-x-3 rounded-md text-white font-semibold text-lg hover:bg-[#4169E1] transition-colors duration-200";
  const sidebarSpan = "flex-1 ms-3 text-left whitespace-nowrap";

  return (
    <SessionProvider>
      <button
        type="button"
        className="fixed top-4 left-4 z-50 flex items-center p-2 text-white bg-[#0D1B2A] rounded sm:hidden"
        onClick={() => setShowSideBar(!showSidebar)}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 w-72 h-screen p-2 transition-transform z-40 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } bg-[#0D1B2A] shadow-xl sm:translate-x-0`}
      >
        <div className="bg-[#0D1B2A] flex items-center justify-center h-20 rounded-t-xl">
          <Image className="h-auto m-2" priority src={Logo} alt="Logo" />
        </div>

        <div className="px-3 py-4 overflow-y-auto">
          <Link href="/admin">
            <button type="button" className={sidebarButton}>
            <DevicePhoneMobileIcon className= {estiloicon} />
              <span className={sidebarSpan}>Home</span>
            </button>
          </Link>

          <button
            type="button"
            className={sidebarButton}
            onClick={() => {
              setElementVisiblePedidos(!elementVisiblePedidos);
              setElementVisibleShip(false);
              setElementVisibleRegisterCNPJ(false);
            }}
          >
            <HomeModernIcon className= {estiloicon} />
            <span className={sidebarSpan}>Obras</span>
            <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none">
              <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {elementVisiblePedidos && (
            <ul className="py-2 space-y-2">
              <li>
                <BoxText className={sidebarBase} link="/admin/work/detail" text="Cadastro" draw="" children/>
              </li>
              <li>
                <BoxText className={sidebarBase} link="/admin/work/list" text="Listar" draw="" children/>
              </li>
            </ul>
          )}

          <button
            type="button"
            className={sidebarButton}
            onClick={() => {
              setElementVisibleShip(!elementVisibleShip);
              setElementVisiblePedidos(false);
              setElementVisibleRegisterCNPJ(false);
            }}
          >
            <CreditCardIcon className= {estiloicon} />
            <span className={sidebarSpan}>Pagamentos</span>
            <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none">
              <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {elementVisibleShip && (
            <ul className="py-2 space-y-2">
              <li>
                <BoxText className={sidebarBase} link="/admin/payment/detail" text="Registros" draw="" children/>
              </li>
              <li>
                <BoxText className={sidebarBase} link="/admin/payment/list" text="Listar" draw="" children/>
              </li>
            </ul>
          )}

          <button
            type="button"
            className={sidebarButton}
            onClick={() => {
              setElementVisibleRegisterCNPJ(!elementVisibleRegisterCNPJ);
              setElementVisiblePedidos(false);
              setElementVisibleShip(false);
            }}
          >
            <PresentationChartBarIcon className= {estiloicon} />
            <span className={sidebarSpan}>Acompanhamento</span>
            <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none">
              <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {elementVisibleRegisterCNPJ && (
            <ul className="py-2 space-y-2">
              <li>
                <BoxText className={sidebarBase} link="/admin/acomp" text="Consulta" draw="" children/>
              </li>
            </ul>
          )}

          <Link href="/">
            <button type="button" className={sidebarButton}>
            <AdjustmentsHorizontalIcon className= {estiloicon} />
              <span className={sidebarSpan}>Configurações</span>
            </button>
          </Link>

          <button type="button" className={sidebarButton} onClick={() => signOut()}>
          <ChevronDoubleLeftIcon className= {estiloicon} />
            <span className={sidebarSpan}>Logout</span>
          </button>
        </div>

        <footer className="bg-[#0D1B2A] rounded-b-xl">
          <AuthDados />
        </footer>
      </aside>
    </SessionProvider>
  );
}
