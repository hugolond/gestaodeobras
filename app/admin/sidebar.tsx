"use client";

import AuthDados from "@/components/auth-dados";
import { SessionProvider, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "../../public/logo_hd.svg";
import { BoxText } from "../admin/boxText";
import { DevicePhoneMobileIcon ,HomeModernIcon ,CreditCardIcon, PresentationChartBarIcon ,AdjustmentsHorizontalIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/solid'
import { BookMarkedIcon, SidebarClose } from "lucide-react";

export default function Sidebar({ session }: any) {
  const [elementVisiblePedidos, setElementVisiblePedidos] = useState(false);
  const [elementVisibleShip, setElementVisibleShip] = useState(false);
  const [elementVisibleRegisterCNPJ, setElementVisibleRegisterCNPJ] = useState(false);
  const [showSidebar, setShowSideBar] = useState(false);

  const estiloicon = "size-8 text-gray-200"

  const estiloiconAdmin = "size-8 text-orange-200"

  const estiloiconClose = "size-8 text-gray-400"

  const sidebarBase =
    "flex items-center p-2 space-x-3 rounded-md text-white font-semibold hover:bg-[#475569] transition-colors duration-200";
  const sidebarButton =
    "flex w-full items-center p-3 space-x-3 rounded-md text-white font-bold text-lg hover:bg-[#475569] transition-colors duration-200";

  const sidebarButtonAdmin =
    "flex w-full items-center p-3 space-x-3 rounded-md text-orange-200 font-bold text-lg hover:bg-[#475569] transition-colors duration-200";
  const sidebarSpan = "flex-1 ms-3 text-left whitespace-nowrap";

  const sidebarButtonClose = "flex w-full items-center p-3 space-x-3 rounded-md font-semibold text-lg bg-gray-300 text-gray-600 cursor-not-allowed text-white transition-colors duration-200";

  return (
      <div>
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
        } bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#0f172a]  to-[#334155] shadow-xl sm:translate-x-0`}
      >
        <div className="pt-2">
          <Image className="p-2 bg-white rounded-t-xl w-full shadow-xl" priority src={Logo} alt="Logo" />
        </div>

        <div className="px-3 overflow-y-auto">
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
                <BoxText className={sidebarBase} link="/admin/work/detail" text="Cadastrar" draw="" children/>
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
                <BoxText className={sidebarBase} link="/admin/payment/detail" text="Registrar" draw="" children/>
              </li>
              <li>
                <BoxText className={sidebarBase} link="/admin/payment/list" text="Listar" draw="" children/>
              </li>
            </ul>
          )}

          <button
            type="button"
            className={sidebarButtonClose}
            onClick={() => {
            }}
          >
            <BookMarkedIcon className= {estiloiconClose} />
            <span className={sidebarSpan}>Diário de Obra</span>
          </button>
          
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
                <BoxText className={sidebarBase} link="/admin/acomp" text="Consultar" draw="" children/>
              </li>
            </ul>
          )}

          <Link href="/admin/settings">
            <button type="button" className={sidebarButton}>
            <AdjustmentsHorizontalIcon className= {estiloicon} />
              <span className={sidebarSpan}>Configurações</span>
            </button>
          </Link>
          
          {session?.user?.roles?.includes("admin") && (
            <Link href="/admin/dashboard">
              <button type="button" className={sidebarButtonAdmin}>
                <AdjustmentsHorizontalIcon className={estiloiconAdmin} />
                <span className={sidebarSpan}>Admin</span>
              </button>
            </Link>
          )}

          <button type="button" className={sidebarButton} onClick={() => signOut()}>
          <ChevronDoubleLeftIcon className= {estiloicon} />
            <span className={sidebarSpan}>Logout</span>
          </button>
        </div>
        <footer className="bg-white rounded-b-xl">
          <AuthDados session={session}/>
        </footer>
      </aside>
      </div>
  );
}
