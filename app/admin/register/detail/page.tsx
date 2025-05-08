"use client";
import React, { useEffect, useState, FormEvent } from "react";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

type Obra = {
  ID: string;
  Nome: string;
};

export default function CadastroPagamento() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [idObraSelecionada, setIdObraSelecionada] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipoMaterial, setTipoMaterial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const categorias = [
    "Custo Terreno",
    "Taxa Prefeitura",
    "Mão Obra",
    "Custo Obra",
    "Energia e Água",
    "Premios",
    "Material",
  ];

  const tiposMaterial = [
    "Madeira",
    "Ferragem",
    "Cal/Cimento",
    "Tijolo",
    "Concreto",
    "Areia/Pedra",
    "Outros",
    "Encanamento",
    "Elétrico",
    "Cobertura",
    "Piso",
    "Gesso",
    "Granito",
  ];

  useEffect(() => {
    async function fetchObras() {
      try {
        const session = await getSession();
        const token = session?.token;

        const res = await fetchComToken("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Erro ao carregar obras.");
        const data = await res.json();
        setObras(data);
        setIdObraSelecionada(data[0]?.ID || "");
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido.");
      }
    }
    fetchObras();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!(event.currentTarget instanceof HTMLFormElement)) return;

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    const valorInput = String(formData.get("valor")).replace(",", ".");
    const valor = parseFloat(valorInput);
    if (isNaN(valor)) {
      toast.error("Valor inválido.");
      setIsLoading(false);
      return;
    }

    const categoriaFinal =
      categoria === "Material" ? `Material - ${tipoMaterial}` : categoria;

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

      const response = await fetchComToken("https://backendgestaoobra.onrender.com/api/payment/v1/sendnewpayment", {
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
      setCategoria("");
      setTipoMaterial("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Cadastrar Pagamento</h1>

        {erro && (
          <p className="text-red-600 mb-4 bg-red-100 px-4 py-2 rounded">{erro}</p>
        )}

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
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="" disabled>Selecione a categoria</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {categoria === "Material" && (
            <div>
              <label htmlFor="tipo_material" className="block mb-1 text-sm font-medium text-gray-700">
                Tipo de Material
              </label>
              <select
                name="tipo_material"
                required
                value={tipoMaterial}
                onChange={(e) => setTipoMaterial(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="" disabled>Selecione o tipo</option>
                {tiposMaterial.map((tipo) => (
                  <option key={tipo} value={tipo}>Material - {tipo}</option>
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Registrando..." : "Registrar Pagamento"}
          </button>
        </form>
      </section>
    </DefautPage>
  );
}