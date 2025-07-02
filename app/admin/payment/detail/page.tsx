"use client";

import React, { useEffect, useState, FormEvent, Suspense } from "react";
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

function CadastroPagamentoInner() {
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

        const obrasRes = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra?status=ativo", {
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
      <section className="col-span-3 sm:col-span-4 px-2 pb-24">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Cadastrar Pagamento</h1>

        {erro && (
          <p className="text-center text-red-600 bg-red-100 px-4 py-2 rounded mt-4">{erro}</p>
        )}

        {!erro && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            {/* ... todo o restante do form aqui como já estava ... */}
          </form>
        )}
      </section>
    </DefautPage>
  );
}

// Wrapper com Suspense
export default function CadastroPagamentoPage() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <CadastroPagamentoInner />
    </Suspense>
  );
}
