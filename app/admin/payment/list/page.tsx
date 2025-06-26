"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import DefautPage from "@/components/defautpage";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Save, X } from "lucide-react";
import { XCircleIcon } from '@heroicons/react/24/solid';


// Tipagens

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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState("");
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filtros, setFiltros] = useState({ categoria: "", data: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Pagamento>>({});
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoObra, setCarregandoObra] = useState(false);
  const [mobileCount, setMobileCount] = useState(10);
  const itensPorPagina = 10;

  const observerRef = useRef(null);
  const searchParams = useSearchParams();
  const idDaURL = searchParams.get("id") || "";

  useEffect(() => {
    async function fetchInitialData() {
      const session = await getSession();
      const token = session?.token;
      const headers = { Authorization: `Bearer ${token}` };

      const obrasRes = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", { headers });
      let obrasData = await obrasRes.json();
      if (!Array.isArray(obrasData)) obrasData = [];
      setObras(obrasData);
      const existeNaLista = obrasData.some((obra: Obra) => obra.ID === idDaURL);
      setObraSelecionada(existeNaLista ? idDaURL : obrasData[0]?.ID || "");

      const catRes = await fetch("https://backendgestaoobra.onrender.com/api/categoria/props", { headers });
      const catData = await catRes.json();
      const filtradas = Array.isArray(catData) ? catData.filter((c: Categoria) => c.status && c.tipo === "ListaCategoria") : [];
      filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));
      setCategorias(filtradas);
    }
    fetchInitialData();
  }, [idDaURL]);

  useEffect(() => {
    if (obraSelecionada) {
      setCarregandoObra(true);
      (async () => {
        const session = await getSession();
        const token = session?.token;
        const res = await fetch(`https://backendgestaoobra.onrender.com/api/payment/v1/listpayment?idobra=${obraSelecionada}`, {
          headers: { Authorization: `Bearer ${token}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(atualizado),
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
      headers: { Authorization: `Bearer ${token}` },
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
    setMobileCount(10);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });

  const loadMore = useCallback(() => setMobileCount(prev => prev + 10), []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleEditar = (p: Pagamento) => {
    setEditing(p.id);
    setEditValues({
      datapagamento: p.datapagamento,
      valor: p.valor,
      categoria: p.categoria,
      detalhe: p.detalhe,
      observacao: p.observacao,
    });
  };

  const handleCancelarEdicao = () => {
    setEditing(null);
    setEditValues({});
  };

  return (
    <DefautPage>
      <section className="col-span-3 sm:col-span-8 px-2 pb-24">
        <h1 className="text-2xl font-bold mb-4">Pagamentos Realizados</h1>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <select className="border px-2 py-2 rounded w-full" disabled={carregandoObra || !!idDaURL} value={obraSelecionada} onChange={e => { setObraSelecionada(e.target.value); limparFiltros(); }}>
            {obras.map(o => <option key={o.ID} value={o.ID}>{o.Nome}</option>)}
          </select>
          <select className="border px-2 py-2 rounded w-full" value={filtros.categoria} onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}>
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
          </select>
          <input type="date" className="border px-2 py-2 rounded w-full" value={filtros.data} onChange={e => setFiltros({ ...filtros, data: e.target.value })} />
          <button onClick={limparFiltros} className="text-sm bg-gray-600 text-white px-3 py-2 rounded w-full">Limpar Filtros</button>
        </div>

        {/* Mobile (scroll infinito) */}
       <div className="grid gap-4 sm:hidden block">
          {pagamentosFiltrados.slice(0, mobileCount).map((p) => (
            <div key={p.id} className={`bg-white p-4 rounded shadow ${editing === p.id ? 'border-2 border-blue-500' : ''}`}>
              {editing === p.id ? (
                <>
                  <div className="grid grid-cols-2"><span className="font-bold">Data:</span> <input type="date" className="border rounded px-2" value={editValues.datapagamento || ''} onChange={e => setEditValues({ ...editValues, datapagamento: e.target.value })} /></div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Categoria:</span>
                    <select className="border rounded px-2" value={editValues.categoria || ''} onChange={e => setEditValues({ ...editValues, categoria: e.target.value })}>
                      {categorias.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}</select>
                  </div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Detalhe:</span> <input type="text" className="border rounded px-2" value={editValues.detalhe || ''} onChange={e => setEditValues({ ...editValues, detalhe: e.target.value })} /></div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Valor:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-700">R$</span>
                      <input type="number" className="border rounded px-2 w-full" value={editValues.valor || 0} onChange={e => setEditValues({ ...editValues, valor: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Observação:</span> <input type="text" className="border rounded px-2" value={editValues.observacao || ''} onChange={e => setEditValues({ ...editValues, observacao: e.target.value })} /></div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={handleSalvar} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"><Save className="w-4 h-4" />Salvar</button>
                    <button onClick={handleCancelarEdicao} className="bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1"><X className="w-4 h-4" />Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2"><span className="font-bold">Data:</span> {formatDate(p.datapagamento)}</div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Categoria:</span> {p.categoria}</div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Detalhe:</span> {p.detalhe}</div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Valor:</span> {p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
                  <div className="grid grid-cols-2"><span className="font-semibold">Observação:</span> {p.observacao}</div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => handleEditar(p)} className="text-sm bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1"><Edit2 className="w-4 h-4" />Editar</button>
                    <button onClick={() => handleExcluir(p.id)} className="text-sm bg-red-600 text-white px-2 py-1 rounded aria-label">Excluir</button>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={observerRef}></div>
        </div>

        {/* Desktop */}
        <div className="overflow-x-auto sm:block hidden">
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
                      <input type="date" value={editValues.datapagamento?.split("T")[0] || ""} onChange={e => setEditValues({ ...editValues, datapagamento: e.target.value })} className="border px-1 py-1 rounded text-sm" />
                    ) : formatDate(p.datapagamento)}
                  </td>
                  <td className="p-2 text-start">
                    {editing === p.id ? (
                      <select value={editValues.categoria || ""} onChange={e => setEditValues({ ...editValues, categoria: e.target.value })} className="border px-1 py-1 rounded text-sm w-full">
                        <option value="">Selecione...</option>
                        {categorias.map(c => <option key={c.id} value={c.titulo}>{c.titulo}</option>)}
                      </select>
                    ) : p.categoria}
                  </td>
                  <td className="p-2 text-start">
                    {editing === p.id ? (
                      <input value={editValues.detalhe || ""} onChange={e => setEditValues({ ...editValues, detalhe: e.target.value })} className="border px-1 py-1 rounded text-sm w-full" />
                    ) : p.detalhe}
                  </td>
                  <td className="p-2 text-center">
                    {editing === p.id ? (
                      <input type="number" value={editValues.valor ?? 0} onChange={e => setEditValues({ ...editValues, valor: parseFloat(e.target.value) })} className="border px-1 py-1 rounded text-sm text-right w-full" />
                    ) : p.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="p-2">
                    {editing === p.id ? (
                      <input value={editValues.observacao || ""} onChange={e => setEditValues({ ...editValues, observacao: e.target.value })} className="border px-1 py-1 rounded text-sm w-full" />
                    ) : p.observacao}
                  </td>
                  <td className="p-2 text-center">
                    {editing === p.id ? (
                      <div className="flex gap-2 justify-center">
                        <button onClick={handleSalvar} className="bg-green-600 text-white px-2 py-1 rounded text-sm">Salvar</button>
                        <button onClick={() => { setEditing(null); setEditValues({}) }} className="bg-gray-400 text-white px-2 py-1 rounded text-sm">Cancelar</button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => { setEditing(p.id); setEditValues(p) }} className="bg-blue-600 text-white px-2 py-1 rounded text-sm aria-label">Editar</button>
                        <button onClick={() => handleExcluir(p.id)} className="bg-red-600 text-white px-2 py-1 rounded text-sm aria-label">Excluir</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="justify-center gap-2 mt-4 flex-wrap hidden sm:flex">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button key={i} onClick={() => setPaginaAtual(i + 1)} className={`px-3 py-1 rounded border ${paginaAtual === i + 1 ? "bg-[#28a9b8] text-white" : "bg-white text-gray-700"}`}>{i + 1}</button>
          ))}
        </div>
      </section>

      <Link href={`/admin/payment/detail?id=${obraSelecionada}`} className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#28a9b8] hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-50">
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Adicionar pagamento</span>
      </Link>
    </DefautPage>
  );
}
