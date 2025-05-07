"use client";
import React, { useState, FormEvent, Component} from "react";
import DefautPage from "@/components/defautpage";
import { TEAlert, TEInput } from "tw-elements-react";
import {SaldoPickup}  from "./saldopickup";
import toast from "react-hot-toast";
import { CpfMask, FormatDate, MoedaBR } from "../../../../lib/util/utils";
import copy from "copy-to-clipboard";
import Select from "react-select";

import ButtonSucess from "@/components/button";
import { Table } from "@phosphor-icons/react";
// Initialization for ES Users

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
export default function PageReprocessa() {
  const [playload, setPlayload] = useState<SaldoPickup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNumber, setNumber] = useState<string>("a");
  
  const sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
  

  const DataPedido = () => {
    return (
      <>{playload && <> {FormatDate(playload?.data.productHistory.skuName).toString()} </>}</>
    );
  };

  const copylink = async () => {
    try {
      {
        playload &&  copy("Utilizar novo Pedido PDV : " + playload.data.toString());
        toast.success("Copia realizada com sucesso!");
      }
    } catch (err) {
      toast.error("Falha ao copiar o texto " + err);
    }
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const pickup = formData.get("pickup");
      const sku = formData.get("sku");
      const response = await fetch(
        //"http://localhost:8080/api/conta-franquia/v1/saldo?pickup="+ pickup +"&sku=" + sku,
          "https://servico-vtex.onrender.com/api/conta-franquia/v1/saldo?pickup="+ pickup +"&sku=" + sku,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setPlayload(data);
      if (!response.ok) {
        toast.error("Erro ao consultar SKU!");
      } else {
        setNumber("OrderNumber:" + playload?.data.toString());
        console.log(isNumber);
      }
      // Handle response if necessary
    } catch (error) {
      // Capture the error message to display to the user
      console.log(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DefautPage>
      <div className="col-span-3 sm:col-span-4">
        <label
          htmlFor="orderid"
          className="titlePage">
          Consulta Saldo Conta Franquia
        </label>
        <form
          onSubmit={onSubmit}
          className="blockInput">
          <TEInput
            id="pickup"
            name="pickup"
            label="Nome Conta"
            type="text"
            required
            placeholder="pernambucanas244"
            className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
          />
          <TEInput
            id="sku"
            name="sku"
            label="Código SKU"
            type="text"
            required
            placeholder="12345"
            className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="buttomForm"
          >
            {isLoading == true ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-3 w-4 h-4 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                ></path>
              </svg>
            ) : (
              <p>Consultar</p>
            )}
          </button>
        </form>
        </div>
        <TEAlert staticAlert open={true} className="tAlert">
        <span className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Informar o nome da loja conforme exemplo abaixo, seguido do código do sku VTEX. exemplo: pernambucanas244 
      </TEAlert>
        {isLoading === false && playload?.data != null ? (
          <>
           <div className="col-span-3 sm:col-span-8 flex rounded-lg flex-col w-full py-4">
              <label className="font-bold justify-start text-xl text-gray-200">
                Produto
              </label>
              <div className="flex rounded-lg flex-col shadow-lg space-y-4 bg-gray-50 px-10 py-5 sm:px-10">
                <div className="grid grid-flow-row-dense grid-cols-6 gap-4">
                <div>Descrição:</div>
                  {playload && playload?.data.productHistory.catalogProduct.name == playload?.data.productHistory.skuName? (
                  <>
                  <div className="col-span-3 text-gray-400">
                    {(playload.data.productHistory.catalogProduct.name)}
                  </div>
                  </>
                  ):(
                  <>
                  <div className="col-span-3 text-gray-400">
                    {(playload.data.productHistory.catalogProduct.name)} - {(playload.data.productHistory.skuName)}
                  </div>
                  </>
                  )}
                  
                  <div>Sku:</div>
                  <div className="col-span-1 flex justify-center text-gray-400">
                    {(playload.data.productHistory.sku)}
                  </div>
                  
                  <div>Saldo Disp.:</div>
                  <div className="col-span-1 flex justify-center text-gray-400">
                    {(playload.data.productHistory.availableQuantity)} 

                  </div>
                  
                  
                </div>
                
                {isLoading === false && playload?.data.productHistory.changelogHistory != null ? (
                  <>
                  <div className="flex rounded-lg flex-col shadow-lg space-y-4 bg-gray-50 px-10 py-5 sm:px-10">
                  <table className="tablet-auto"> 
                  <thead> 
                    <tr className="border-b-4 border-slate-300 font-black ">
                      <th className="">Data Movimentação</th>
                      <th className="">Saldo Anterior</th>
                      <th className="">Saldo Posterior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                  {playload.data.productHistory.changelogHistory.map((item,key) => {
                      return(
                        <tr key={key} className="text-center">
                          <td className="text-gray-400"> {FormatDate(item.date)} </td>
                          <td className="text-gray-400"> {item.quantityBefore} </td>
                          <td className="text-gray-400"> {item.quantityAfter} </td>
                        </tr>
                      )
                  })}
                  </tbody>
                  </table>
                      
                  </div>
                  
                  </>
                  ) : (
                    <p></p>
                  )}
            </div>
            </div>
          </>
        ) : (
          <p></p>
        )}
     </DefautPage>
  );
}
