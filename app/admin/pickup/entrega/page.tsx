"use client";
import DefautPage from "@/components/defautpage";
import Image from "next/image";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { TEAlert, TEInput } from "tw-elements-react";
import ButtonSucess from "../../../../components/button";
import {
  CpfMask,
  FormatDate, copylinkText
} from "../../../../lib/util/utils";
import { EntityCliqueRetire } from "./cliqueRetire";
import Ok from "../../../assets/ok.svg"
import Full from "../../../assets/full.svg"
import Link from "next/link";

export default function PageConsultaStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [playload, setPlayload] = useState<EntityCliqueRetire | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusPedido = new Map();
  let retiradoArmario = {
    newStatus: "Retirado Armário",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-success-700",
      heSignature: true
  };
  let noArmario = {
    newStatus: "Disponivel Armário",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-warning-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-warning-800",
      heSignature:false
  };
  let pendenteSeparacao = {
    newStatus: "Pendente Separação",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-primary-700",
      heSignature:false
  };
  let emRotaTransportadora = {
    newStatus: "Em Rota Entrega",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-primary-700",
      heSignature: true
  };
  let esperadoTransportadora = {
    newStatus: "Aguardando Transpot.",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-primary-700",
      heSignature: true
  };
  let separacaoCD = {
    newStatus: "Aguardando Recebi loja",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-success-700",
      heSignature: true
  };

  let entregueTransportadora = {
    newStatus: "Entregue para Transp.",
    style:
      "inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-success-700",
      heSignature: true
  };

  


  statusPedido.set("order_withdrawn_store", retiradoArmario);
  statusPedido.set("order_arrived_store", noArmario);
  statusPedido.set("pending_separation", pendenteSeparacao);
  statusPedido.set("waiting_for_route_carrier", emRotaTransportadora);
  statusPedido.set("waiting_for_carrier", esperadoTransportadora);
  statusPedido.set("invoiced", separacaoCD);
  statusPedido.set("delivered_over_to_relative_carrier", entregueTransportadora);

  function getStylePedido(mapa: Map<String, any>, termo: String) {
    let padrao = {
      newStatus: termo,
      style:
        "inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[1em] font-bold leading-none text-primary-700",
    };
    if (mapa.has(termo)) {
      return mapa.get(termo);
    } else {
      return padrao;
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlayload(null)
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts
    try {
      const formData = new FormData(event.currentTarget);
      const orderid = formData.get("orderid");
      const response = await fetch(
        "https://servico-vtex.onrender.com/api/clique-retire/v1/search?campo=" +
          orderid +
          "&termo=id_order",
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("Pedido não localizado");
      } else {
        setPlayload(data);
      }
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
        Pedido Clique Retire
      </label>
      <form
        onSubmit={onSubmit}
        className="blockInput">
        <>
          <TEInput
            required
            type="text"
            id="orderid"
            name="orderid"
            label="Número Pedido"
            className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
          ></TEInput>
        </>
        <button
          type="submit"
          disabled={isLoading}
          className="buttomForm"
        >
          {" "}
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
        Informar o número do pedido Clique Retire para que sejam apresentandas
        as informações.
      </TEAlert>

      {playload ? (
        [0] && (
          <div className="col-span-3 sm:col-span-10 flex rounded-lg flex-col w-full py-4">
            <label className="font-bold justify-start text-xl text-gray-200">
              Dados Pedido
            </label>
            <div className="flex rounded-lg flex-col shadow-lg space-y-4 bg-gray-50 px-5 py-2 sm:py-5 sm:px-10">
              <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-6 gap-3 ">
                <div>Núm. Pedido:</div>
                <div className="col-span-1 sm:col-span-2 italic text-black text-base">
                  {playload[0].id_order}
                </div>
                <div>Status:</div>
                <div className="col-span-1 sm:col-span-2">
                  <span
                    className={
                      getStylePedido(statusPedido, playload[0].status)["style"]
                    }
                  >
                    {
                      getStylePedido(statusPedido, playload[0].status)[
                        "newStatus"
                      ]
                    }
                  </span>
                </div>
                <div>Data:</div>
                <div className="col-span-1 sm:col-span-2">
                  {FormatDate(playload[0].createdIn).toString()}
                </div>
                <div>Cod. Loja:</div>
                <div className="col-span-1 sm:col-span-2">
                  {parseInt(playload[0].id_store_pickup)}
                </div>
                <div>Cliente: </div>
                <div className="col-span-1 sm:col-span-2">
                  {" "}
                  {playload[0].customer_name}{" "}
                </div>
                <div>CPF:</div>
                <div className="col-span-1 sm:col-span-2">
                  {CpfMask(playload[0].customer_cpf)}
                </div>
                <div>Data Estim. Entrega:</div>
                <div className="col-span-1 sm:col-span-2">
                  {FormatDate(playload[0].estimate_shipping_in_store).toString()}
                </div>
              </div>
              {playload[0].customer_bs64_biometry || playload[0].customer_bs64_signature && (
                <>
                  <label className="font-bold justify-start text-xl text-gray-600">
                    Dados Retirada
                  </label>
                  <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-6 gap-3">
                    <div>Data:</div>
                    <div className="col-span-1 sm:col-span-2">
                      {FormatDate(playload[0].lock_out_date).toString()}
                    </div>
                    {playload[0].customer_cpf_pickup != null ? (
                      <>
                        <div>CPF:</div>
                        <div className="col-span-1 sm:col-span-2">
                          {CpfMask(playload[0].customer_cpf_pickup)}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {playload[0].is_shipping_company = true ? (
                      <>
                        <div>Transp:</div>
                        <div className="col-span-1 sm:col-span-2">
                          {playload[0].CourierName}
                        </div>
                        <div>Status Transp:</div>
                          <div className= {playload[0].FinishedCourier == true ?("col-span-1 rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-success-700"):("inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.85em] sm:text-[1em] font-bold leading-none text-primary-800")}>
                            {playload[0].FinishedCourier == true? (<div className="flex justify-between"> Entregue <Image alt="a" src={Ok} width={18}/></div> ):('Não Entregue')} 
                        </div>
                        <div className="col-span-1 sm:col-start-1 sm:col-end-1">Url Rastreio:</div>
                        <div className="col-span-1 sm:col-start-2 sm:col-end-7">
                          <Link href={playload[0].UrlRastreio} rel="noopener noreferrer" target="_blank">
                          <Image src={Full} alt="" width={18}/>
                          </Link>
                          
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-8 content-center">
                    {playload[0].customer_bs64_biometry && (
                      <>
                        <div className="col-span-1 shadow-2xl rounded-lg p-1 sm:p-3">
                          <div className="text-center justify-center font-semibold text-gray-600">
                            {" "}
                            Biometria
                          </div>
                          <Image
                            src={`data:image/png;base64,${playload[0].customer_bs64_biometry}`}
                            className="col-span-1 text-center p-1 sm:p-7 justify-self-center border-2 rounded-lg"
                            alt="Biometria"
                            width="400"
                            height="250"
                          />
                          <div className="text-center p-2">
                            <ButtonSucess
                              text=""
                              onclick={() =>
                                copylinkText(
                                  `data:image/png;base64,${playload[0].customer_bs64_biometry}`
                                )
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {playload[0].customer_bs64_signature && (
                      <>
                        <div className="col-span-1 shadow-2xl rounded-lg p-1 sm:p-3">
                          <div className="text-center justify-center font-semibold text-gray-600">
                            Assinatura
                          </div>
                          <Image
                            src={`${playload[0].customer_bs64_signature}`}
                            className="col-span-1 text-center p-1 sm:p-7 justify-self-center border-2 rounded-lg"
                            alt="Assinatura"
                            width="400"
                            height="250"
                          />
                          <div className="text-center p-2">
                            <ButtonSucess
                              text=""
                              onclick={() =>
                                copylinkText(
                                  `${playload[0].customer_bs64_signature}`
                                )
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      ) : (
        <p></p>
      )}
    </DefautPage>
  );
}
