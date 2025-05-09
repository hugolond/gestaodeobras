"use client";
import React, { useEffect, useState } from "react";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { fetchComToken } from "@/lib/fetchComToken";

const categorias = [
  "Custo Terreno", "Taxa Prefeitura", "Mão Obra",
  "Material - Madeira", "Custo Obra", "Material - Ferragem",
  "Material - Cal/Cimento", "Material - Tijolo", "Material - Concreto",
  "Material - Areia/Pedra", "Material - Outros", "Energia e Água",
  "Material - Encanamento", "Material - Elétrico", "Premios",
  "Material - Cobertura", "Material - Piso", "Material - Gesso", "Material - Granito" , "Material - Tinta"
];

type Obra = {
  ID: string;
  Nome: string;
};

type Pagamento = {
  id: number;
  datapagamento: string;
  valor: number;
  categoria: string;
  detalhe: string;
  observacao: string;
};

export default function ListaPagamentosCompleta() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState("");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtros, setFiltros] = useState({ categoria: "", data: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Pagamento>>({});
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoObra, setCarregandoObra] = useState(false);
  const itensPorPagina = 10;

  useEffect(() => {
    async function fetchObras() {
      const session = await getSession();
      const token = session?.token;
      const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setObras(data);
      setObraSelecionada(data[0]?.ID || "");
    }
    fetchObras();
  }, []);

  useEffect(() => {
    if (obraSelecionada) {
      setCarregandoObra(true);
      (async () => {
        const session = await getSession();
        const token = session?.token;
        const res = await fetch(`https://backendgestaoobra.onrender.com/api/payment/v1/listpayment?idobra=${obraSelecionada}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPagamentos(Array.isArray(data) ? data : []);
        setCarregandoObra(false);
      })();
    }
  }, [obraSelecionada]);

  const pagamentosFiltrados = pagamentos.filter(p => {
    const matchCategoria = filtros.categoria ? p.categoria === filtros.categoria : true;
    const matchData = filtros.data ? p.datapagamento.startsWith(filtros.data) : true;
    return matchCategoria && matchData;
  });

  const totalPaginas = Math.ceil(pagamentosFiltrados.length / itensPorPagina);
  const visiveis = pagamentosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const handleSalvar = async () => {
    if (!editing || !editValues) return;
    const original = pagamentos.find(p => p.id === editing);
    if (!original) return;
    const atualizado = { ...original, ...editValues };
    const session = await getSession();
    const token = session?.token;

    const res = await fetch("https://backendgestaoobra.onrender.com/api/payment/v1/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(atualizado)
    });

    if (res.ok) {
      toast.success("Pagamento atualizado");
      setPagamentos(pagamentos.map(p => p.id === editing ? atualizado : p));
      setEditing(null);
      setEditValues({});
    } else {
      toast.error("Erro ao atualizar");
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Deseja excluir este pagamento?")) return;
    const session = await getSession();
    const token = session?.token;

    const res = await fetch(`https://backendgestaoobra.onrender.com/api/payment/v1/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("Excluído com sucesso");
      setPagamentos(pagamentos.filter(p => p.id !== id));
    } else {
      toast.error("Erro ao excluir");
    }
  };

  const limparFiltros = () => {
    setFiltros({ categoria: "", data: "" });
    setPaginaAtual(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8 px-2">
        <h1 className="text-2xl font-bold mb-4">Pagamentos Realizados</h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <select className="border px-2 py-2 rounded w-full" disabled={carregandoObra} value={obraSelecionada} onChange={e => { setObraSelecionada(e.target.value); limparFiltros(); }}>
            {obras.map(o => <option key={o.ID} value={o.ID}>{o.Nome}</option>)}
          </select>

          <select className="border px-2 py-2 rounded w-full" value={filtros.categoria} onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}>
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="date"
            className="border px-2 py-2 rounded w-full"
            value={filtros.data}
            onChange={e => setFiltros({ ...filtros, data: e.target.value })}
          />

          <button onClick={limparFiltros} className="text-sm bg-gray-600 text-white px-3 py-2 rounded w-full">Limpar Filtros</button>
        </div>

        {carregandoObra ? (
          <p className="text-center text-gray-600 my-4">Carregando pagamentos...</p>
        ) : visiveis.length === 0 ? (
          <p className="text-center text-gray-500 my-4">Nenhum pagamento encontrado com os filtros atuais.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border text-sm bg-white shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-center">Data</th>
                  <th className="p-2 text-start">Categoria</th>
                  <th className="p-2 text-start">Detalhe</th>
                  <th className="p-2 text-center">Valor</th>
                  <th className="p-2">Observação</th>
                  <th className="p-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2 text-center">
                      {editing === p.id ? (
                        <input type="date" defaultValue={p.datapagamento.split("T")[0]} onChange={e => setEditValues(v => ({ ...v, datapagamento: e.target.value }))} />
                      ) : formatDate(p.datapagamento)}
                    </td>
                    <td className="p-2 text-start">
                      {editing === p.id ? (
                        <select defaultValue={p.categoria} onChange={e => setEditValues(v => ({ ...v, categoria: e.target.value }))}>
                          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : p.categoria}
                    </td>
                    <td className="p-2 text-start">
                      {editing === p.id ? (
                        <input type="text" defaultValue={p.detalhe} onChange={e => setEditValues(v => ({ ...v, detalhe: e.target.value }))} />
                      ) : p.detalhe}
                    </td>
                    <td className="p-2 text-center">
                      {editing === p.id ? (
                        <span className="flex items-center gap-1">
                          R$
                          <input
                            type="text"
                            className="border px-1 py-1 rounded w-20"
                            defaultValue={p.valor.toString().replace(".", ",")}
                            onChange={e => setEditValues(v => ({ ...v, valor: parseFloat(e.target.value.replace(",", ".")) }))}
                          />
                        </span>
                      ) : p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="p-2">
                      {editing === p.id ? (
                        <input type="text" defaultValue={p.observacao} onChange={e => setEditValues(v => ({ ...v, observacao: e.target.value }))} />
                      ) : p.observacao}
                    </td>
                    <td className="p-2 text-center space-x-2">
                      {editing === p.id ? (
                        <button onClick={handleSalvar} className="text-sm bg-green-600 text-white px-2 py-1 rounded">Salvar</button>
                      ) : (
                        <button onClick={() => { setEditing(p.id); setEditValues(p); }} className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Editar</button>
                      )}
                      <button onClick={() => handleExcluir(p.id)} className="text-sm bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => setPaginaAtual(i + 1)}
              className={`px-3 py-1 rounded border ${paginaAtual === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>
    </DefautPage>
  );
}
