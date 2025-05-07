"use client";
export const dynamic = "force-dynamic";
import logoOk from "../../../assets/ok.svg";
import Image from "next/image";
import { FormEvent, useState } from "react";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { TEAlert, TEDropdown, TEDropdownMenu, TEInput,TERipple, TEDropdownToggle, TEDropdownItem, TESelect} from "tw-elements-react";
import Sidebar from "../../sidebar";
import { Invoiced } from "./invoiced";



export default function PageConsultaStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [playload, setPlayload] = useState<Invoiced | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [selectValue, setSelectValue] = useState(1);
  const [obraConcluida, setObraConcluida] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlayload(null)
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts
    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        nome: formData.get("nomeObra"),
        endereco: formData.get("endereco"),
        bairro: formData.get("bairro"),
        area: formData.get("area"),
        tipo: selectValue,
        casagerminada: (event.currentTarget.elements.namedItem("flexSwitchCasaGeminada") as HTMLInputElement).checked,
        status: true,
        datainicioobra: formData.get("datainicioobra"),
        datafinalobra : formData.get("datainicioobra"),
      };
      if (obraConcluida) {
        payload.datafinalobra = formData.get("datafinalobra")  
        payload.status = false;
        
      }


      const response = await fetch(
         "https://backendgestaoobra.onrender.com/api/obra/v1/sendnewobra",
         
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
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
  const data = [
    { text: "Casa térrea", value: 1 },
    { text: "2 Andares", value: 2 },
    { text: "3 Andares", value: 3 },
  ];
  return (
    <DefautPage>
      <div className="col-span-3 sm:col-span-4">
      <label
          htmlFor="cadastroobra"
          className="titlePage">
          Cadastro Obra
        </label>
          <form
            onSubmit={onSubmit}
            className="blockInput">
            <>
              <TEInput
                required
                type="text"
                id="nomeObra"
                name="nomeObra"
                label="Obra"
                autoComplete="nope"
                className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
              ></TEInput>
              <TEInput
                required
                type="text"
                id="endereco"
                name="endereco"
                label="Endereço"
                autoComplete="nope"
                className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
              ></TEInput>
              <TEInput
                required
                type="text"
                id="bairro"
                name="bairro"
                label="Bairro"
                autoComplete="nope"
                className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
              ></TEInput>
              
              <TEInput
                required
                type="text"
                id="area"
                name="area"
                label="Área da Obra (m2)"
                autoComplete="nope"
                className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
              ></TEInput>
              <TESelect
                data={data}
                value={selectValue}
                onValueChange={(e: any) => {
                  setSelectValue(e.value);
                }}
              />
              <div>
                <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCasaGeminada" />
                <label
                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                >Casa Geminada</label>
            </div>
            <TEInput
              required
              type="date"
              id="datainicioobra"
              name="datainicioobra"
              label="Data de Início da Obra"
              className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
            />
            <div>
            <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              id="obraConcluida"
              role="switch"
              checked={obraConcluida}
              onChange={() => setObraConcluida(!obraConcluida)}
            />
            <label htmlFor="obraConcluida" className="inline-block">
              Obra concluída
            </label>
          </div>
          {obraConcluida && (
            <TEInput
              required
              type="date"
              id="datafinalobra"
              name="datafinalobra"
              label="Data Final da Obra"
              className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
            />
          )}

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
                <p>Registrar</p>
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
          Informar os dados da obra para o cadastro.
        </TEAlert>

        {playload ? (
          [0] && (
            <div className="flex justify-between h-min min-w-min items-center col-span-3 sm:col-span-5 shadow-lg space-y-4 bg-gray-50 px-10 py-10 sm:px-10">
              <label className="col-span-3 break-words">
                <p className="text-xl text-gray-600">{playload.message} </p>
              </label>
                <label>
              </label>
              <Image className=" items-center min-w-[40px] w-[70px]" priority src={logoOk} alt="ok" />
            </div>
          )
        ) : (
          <p></p>
        )}
      </DefautPage>
    
  );
}
