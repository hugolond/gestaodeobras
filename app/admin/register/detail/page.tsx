"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

type Obra = {
  ID: string;
  Nome: string;
};

type Categoria = {
  id: string;
  tipo: string;
  campo: string;
  subcampo: string;
  titulo: string;
  status: boolean;
};

export default function CadastroPagamento() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [idObraSelecionada, setIdObraSelecionada] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const idDaURL = searchParams.get("id") || "";

  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        const token = session?.token;
        const headers = { Authorization: `Bearer ${token}` };

        const obrasRes = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const obrasData = await obrasRes.json();

        if (!Array.isArray(obrasData) || obrasData.length === 0) {
          setErro("Por favor, cadastre um nova obra para listar");
          return;
        }

        setObras(obrasData);
        setIdObraSelecionada(idDaURL || obrasData[0]?.ID || "");

        const catRes = await fetch("https://backendgestaoobra.onrender.com/api/categoria/props", { headers });
        const catData = await catRes.json();
        const filtradas = Array.isArray(catData)
          ? catData.filter((c: Categoria) => c.status && c.tipo === "ListaCategoria")
          : [];
        filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
        setCategorias(filtradas);
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido.");
      }
    }

    fetchData();
  }, [idDaURL]);

  const camposUnicos = Array.from(new Set(categorias.map((c) => c.campo)));

  const subcategorias = categorias
    .filter((c) => c.campo === categoriaSelecionada && c.subcampo.trim())
    .map((c) => c.titulo);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const valorRaw = formData.get("valor");

    if (!valorRaw || typeof valorRaw !== "string" || !valorRaw.trim()) {
      toast.error("Campo valor está vazio.");
      setIsLoading(false);
      return;
    }

    const valorInput = valorRaw.replace(/\./g, "").replace(",", ".");
    const valor = parseFloat(valorInput);
    if (isNaN(valor)) {
      toast.error("Valor inválido.");
      setIsLoading(false);
      return;
    }

    const categoriaFinal = subcategoriaSelecionada || categoriaSelecionada;

    const payload = {
      idObra: idObraSelecionada,
      datapagamento: formData.get("data_pagamento"),
      valor: valor,
      categoria: categoriaFinal,
      detalhe: formData.get("detalhe"),
      observacao: formData.get("observacao"),
    };

    try {
      const session = await getSession();
      const token = session?.token;

      const response = await fetch("https://backendgestaoobra.onrender.com/api/payment/v1/sendnewpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao registrar pagamento.");

      toast.success("Pagamento registrado com sucesso!");
      if (event.currentTarget instanceof HTMLFormElement) {
        event.currentTarget.reset();
      }
      setCategoriaSelecionada("");
      setSubcategoriaSelecionada("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-4 pb-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Cadastrar Pagamento</h1>

        {erro && (
          <p className="text-center text-red-600 bg-red-100 px-4 py-2 rounded mt-4">{erro}</p>
        )}

        {!erro && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
              <label htmlFor="obra" className="block mb-1 text-sm font-medium text-gray-700">Obra</label>
              <select
                id="obra"
                required
                value={idObraSelecionada}
                onChange={(e) => setIdObraSelecionada(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                {obras.map((obra) => (
                  <option key={obra.ID} value={obra.ID}>{obra.Nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="data_pagamento" className="block mb-1 text-sm font-medium text-gray-700">Data do Pagamento</label>
              <input
                type="date"
                name="data_pagamento"
                id="data_pagamento"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block mb-1 text-sm font-medium text-gray-700">Categoria</label>
              <select
                name="categoria"
                required
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setSubcategoriaSelecionada("");
                }}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="" disabled>Selecione a categoria</option>
                {camposUnicos.map((campo) => (
                  <option key={campo} value={campo}>{campo}</option>
                ))}
              </select>
            </div>

            {subcategorias.length > 0 && (
              <div>
                <label htmlFor="subcategoria" className="block mb-1 text-sm font-medium text-gray-700">Tipo</label>
                <select
                  name="subcategoria"
                  required
                  value={subcategoriaSelecionada}
                  onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="" disabled>Selecione a Tipo</option>
                  {subcategorias.map((titulo) => (
                    <option key={titulo} value={titulo}>{titulo}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="valor" className="block mb-1 text-sm font-medium text-gray-700">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <input
                  type="text"
                  name="valor"
                  id="valor"
                  placeholder="Ex: 1500,00"
                  required
                  className="pl-10 w-full border px-4 py-2 rounded"
                />
              </div>
            </div>

            <div>
              <label htmlFor="detalhe" className="block mb-1 text-sm font-medium text-gray-700">Detalhe</label>
              <input
                type="text"
                name="detalhe"
                id="detalhe"
                required
                placeholder="Ex: Compra de cimento"
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="observacao" className="block mb-1 text-sm font-medium text-gray-700">Observação (opcional)</label>
              <textarea
                name="observacao"
                id="observacao"
                rows={3}
                placeholder="Observações adicionais..."
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="buttomForm"
            >
              {isLoading ? "Registrando..." : "Registrar Pagamento"}
            </button>
          </form>
        )}
      </section>
    </DefautPage>
  );
}
