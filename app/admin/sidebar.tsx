"use client";
//import { Smiley,Truck, Horse } from "@phosphor-icons/react";
import AuthDados from "@/components/auth-dados";
import { SessionProvider, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Cliqueretire from "../assets/cliqueretire.svg";
import Client from "../assets/client.svg";
import Cnpj from "../assets/cnpj.svg";
import Home from "../assets/home.svg";
import Logout from "../assets/logout.svg";
import Logo from "../assets/marca.png";
import Pedido from "../assets/pedido.svg";
import Setting from "../assets/setting.svg";
import Ship from "../assets/ship.svg";
import { BoxText } from "../admin/boxText";

export default function Sidebar(){
  const [elementVisiblePedidos, setElementVisiblePedidos] = useState(false);
  const [elementVisibleShip, setElementVisibleShip] = useState(false);
  const [elementVisiblePickup, setElementVisiblePickup] = useState(false);
  const [elementVisibleRegister, setElementVisibleRegister] = useState(false);
  const [elementVisibleRegisterCNPJ, setElementVisibleRegisterCNPJ] = useState(false);
  const [showSidebar, setShowSideBar] = useState(true);

  const sideBarIn =    "flex items-center p-2 space-x-3 hover:shadow-black hover:bg-gray-400 hover:text-white rounded-md border-black text-gray-700"
  const sideBarBlock = "flex items-center p-2 space-x-3 hover:shadow-black hover:bg-gray-300 select-none line-through hover:text-white rounded-md border-black text-gray-700 cursor-no-drop"
  const sideBarButtom= "flex w-full hover:shadow-black hover:bg-gray-400 hover:text-white items-center p-3 space-x-3 rounded-md border-black text-gray-700 font-semibold text-lg"
  const sideBarSpan =  "flex-1 ms-3 hover:shadow-black hover:bg-gray-400 hover:text-white text-left rtl:text-right whitespace-nowrap  "

  return (
    <>
     <SessionProvider>
      {" "}
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="flex items-center mt-2 max-w-10 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-140 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setShowSideBar(!showSidebar)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <aside
        id="sidebar-multi-level-sidebar"
        className={
          showSidebar
            ? "fixed top-0 left-0 w-72 p-2 transition-transform -translate-x-full sm:translate-x-0 shadow-lg"
            : "fixed top-0 left-0 w-72  z-[1035] p-2 h-screen "
        }
        aria-label="Sidebar"
        aria-hidden="true"
      >
        <div className="topcolor flex w-full h-20 justify-center rounded-[16px_16px_0px_0px]" >
        <Image className="h-auto m-2 bg-no-repeat bg-cover" priority src={Logo} alt="" />
        <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="flex items-center text-sm text-[#FFC44D] rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={() => setShowSideBar(!showSidebar)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
        </div>
        <div className="sidebar px-3 py-4 overflow-y-auto dark:bg-gray-700 backdrop-blur-sm bg-white/30">
        <Link href={"/admin/home"}>
        <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
          >
            <Image className="w-6" src={Cnpj} alt="" ></Image>
            <span className={sideBarSpan}>
              Home
            </span>
          </button>
          </Link>
          <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={() => {setElementVisiblePedidos(!elementVisiblePedidos), 
                            setElementVisibleRegisterCNPJ(false),
                            setElementVisibleShip(false),
                            setElementVisiblePickup(false), 
                            setElementVisibleRegister(false), 
                            setElementVisibleShip(false)}}
          >
            <Image className="w-6" src={Home} alt="" ></Image>
            <span className={sideBarSpan}>
              Obras
            </span>
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {elementVisiblePedidos ? (
            <ul id="dropdown-example" className="py-2 space-y-2 ">
              <li>
                <BoxText 
                 className={sideBarIn} 
                  link="/admin/obra/detalhes"
                  text="Cadastro"
                  draw=""
                  // eslint-disable-next-line react/no-children-prop
                  children
                />
              </li> 
              <li>
                <BoxText 
                 className={sideBarIn} 
                  link="/admin/obra/list"
                  text="Listar"
                  draw=""
                  // eslint-disable-next-line react/no-children-prop
                  children
                />
              </li>               
            </ul>
            
          ) : null}
          <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={() => {setElementVisiblePedidos(false), 
              setElementVisibleRegisterCNPJ(false),
              setElementVisibleShip(!elementVisibleShip),
              setElementVisiblePickup(false), 
              setElementVisibleRegister(false)}}
          >
             <Image className="w-6" src={Ship} alt="" ></Image>
             <span className={sideBarSpan}>
              Pagamentos
            </span>
            <svg
              className="w-3 h-3"
              //aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {elementVisibleShip ? (
            <ul id="dropdown-example" className="py-2 space-y-2">
              <li>
                <BoxText
                 className={sideBarIn}
                  link="/admin/register/detail"
                  text="Registros"
                  draw=""
                  // eslint-disable-next-line react/no-children-prop
                  children
                />
              </li>
              <li>
                <BoxText
                 className={sideBarIn}
                  link="/admin/register/list"
                  text="Listar"
                  draw=""
                  // eslint-disable-next-line react/no-children-prop
                  children
                />
              </li>
            </ul>
          ) : null}
          
          
          <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={() => {setElementVisiblePedidos(false), 
                            setElementVisibleRegisterCNPJ(!elementVisibleRegisterCNPJ),
                            setElementVisibleShip(false),
                            setElementVisiblePickup(false), 
                            setElementVisibleRegister(false), 
                            setElementVisibleShip(false)}}
          >
            <Image className="w-6" src={Client} alt="" ></Image>
            <span className={sideBarSpan}>
              Acompanhamento
            </span>
            <svg
              className="w-3 h-3"
              //aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {elementVisibleRegisterCNPJ ? (
            <ul id="dropdown-example" className="py-2 space-y-2">
              <li>
                <BoxText
                  className={sideBarIn}
                  link="/admin/acomp"
                  text="Consulta"
                  draw=""
                  // eslint-disable-next-line react/no-children-prop
                  children
                />
              </li>
            </ul>
          ) : null}
          <Link href={"/"}>
          <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
          >
            <Image className="w-6" src={Setting} alt="" ></Image>
            <span className={sideBarSpan}>
              Configurações
            </span>
          </button>
          </Link>
          <button
            type="button"
            className={sideBarButtom}
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
            onClick={()=>signOut()}
          >
            <Image className="w-6" src={Logout} alt="" ></Image>
            <span className={sideBarSpan}>
              Logout
            </span>
          </button>
        </div>
        <footer className="topcolor flex bottom-0 left-0 z-20 rounded-[0px_0px_16px_16px]">
        <AuthDados/>
        </footer>
      </aside>
      </SessionProvider>
      </>
  );
};

