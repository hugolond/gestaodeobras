"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefautPage from "@/components/defautpage";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader, Plus, X, Building2Icon, DollarSignIcon} from "lucide-react";
import { NumericFormat } from "react-number-format";
import {
  CalendarIcon,
  InformationCircleIcon,
  HomeIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";

// ===== Config / helpers =====
const API_SALE_ENDPOINT =
  "https://backendgestaoobra.onrender.com/api/sold/v1/create"; // ajuste se necessário

const estiloicon = "size-6 text-gray-500";

const tiposObraMap: Record<number, { text: string; icon: JSX.Element }> = {
  1: { text: "Térrea", icon: <HomeIcon className="w-6 h-6 mr-1 text-gray-500" /> },
  2: { text: "2 Andares", icon: <BuildingLibraryIcon className="w-6 h-6 mr-1 text-gray-500" /> },
  3: { text: "3 Andares", icon: <BuildingOfficeIcon className="w-6 h-6 mr-1 text-gray-500" /> },
};

const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");
const formatCurrencyBRL = (v: number) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatForma = (f?: Venda["FormaPagamento"]) =>
  ({ avista: "À vista", financiamento: "Financiamento", consorcio: "Consórcio", outro: "Outro" }[f || "outro"]);

const calcularDiasTotais = (inicio?: string, fim?: string): number => {
  if (!inicio || !fim) return 0;
  const d0 = new Date(inicio);
  const d1 = new Date(fim);
  d0.setHours(0, 0, 0, 0);
  d1.setHours(0, 0, 0, 0);
  const diff = (d1.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(diff)); // se quiser inclusivo, use Math.ceil(diff) + 1
};

// ===== Tipos =====
type Venda = {
  ID?: string;
  DataVenda: string; // ISO (ou YYYY-MM-DD na UI do form)
  ValorVenda: number;
  CPFComprador: string; // dígitos
  FormaPagamento: "avista" | "financiamento" | "consorcio" | "outro";
  Descricao?: string;
  NomeComprador: string;
};

type Lote = {
  ID: string;
  Nome: string;
  Endereco: string;
  Bairro: string;
  Area: string | number;
  Tipo: number | string;
  Casagerminada: boolean;
  Status: boolean; // true=andamento, false=concluída
  Previsto?: number;
  DataInicioObra?: string; // ISO
  DataFinalObra?: string; // ISO
  Vendida?: boolean;
  VendaInfo?: Venda;
};

export default function TelaListaObra({ session }: any) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [obraConcluidaNome, setObraConcluidaNome] = useState("");

  // Concluir
  const [modalAberto, setModalAberto] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [obraSelecionada, setObraSelecionada] = useState<Lote | null>(null);

  // Editar
  const [abrirEditar, setAbrirEditar] = useState(false);
  const [editando, setEditando] = useState<Lote | null>(null);
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [erroData, setErroData] = useState<string | null>(null);

  // Venda
  const [abrirVenda, setAbrirVenda] = useState(false);
  const [vendendoDe, setVendendoDe] = useState<Lote | null>(null);
  const [savingVenda, setSavingVenda] = useState(false);
  const [venda, setVenda] = useState<Venda>({
    DataVenda: "",
    ValorVenda: 0,
    CPFComprador: "",
    FormaPagamento: "avista",
    Descricao: "",
    NomeComprador: "",
  });

  const router = useRouter();

  const itensPorPagina = 9;
  const totalPaginas = Math.ceil(lotes.length / itensPorPagina);
  const lotesPaginados = useMemo(
    () => lotes.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina),
    [lotes, paginaAtual]
  );

  const formatarData = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "UTC" });
  };

  const calcularProgresso = (inicio?: string, fim?: string): number => {
    if (!inicio || !fim) return 0;
    const dataInicio = new Date(inicio).getTime();
    const dataFim = new Date(fim).getTime();
    const agora = Date.now();
    if (agora < dataInicio) return 0;
    if (agora > dataFim) return 100;
    const p = ((agora - dataInicio) / (dataFim - dataInicio)) * 100;
    return Math.min(100, Math.max(0, p));
  };

  // ===== fetch inicial =====
  useEffect(() => {
    async function fetchData() {
      try {
        const session = await getSession();
        const token = (session as any)?.token || (session?.user as any)?.token;

        const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/listallobra", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar os dados.");
        const data = await res.json();

        if (data === null) {
          setLotes([]);
          setErro("Por favor, cadastre uma nova obra para listar.");
        } else if (!Array.isArray(data)) {
          throw new Error("Formato inesperado da resposta.");
        } else {
          setLotes(data);
        }
      } catch (err: any) {
        setErro(err.message || "Erro desconhecido.");
      } finally {
        setCarregando(false);
      }
    }
    fetchData();
  }, []);

  // ===== Concluir =====
  const confirmarConclusaoObra = async () => {
    if (!obraSelecionada) return;
    try {
      const session = await getSession();
      const token = (session as any)?.token || (session?.user as any)?.token;

      const body = {
        ...obraSelecionada,
        Tipo: parseInt(String(obraSelecionada.Tipo || 1), 10),
        Status: false,
        DataFinalObra: new Date().toISOString(),
      };

      const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Erro ao atualizar obra.");

      setLotes((prev) => prev.map((o) => (o.ID === obraSelecionada.ID ? { ...o, Status: false } : o)));
      setObraConcluidaNome(obraSelecionada.Nome);
      setModalConfirmar(false);
      setModalAberto(true);
      setObraSelecionada(null);
      toast.success("Obra marcada como concluída.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao concluir a obra.");
    }
  };

  // ===== Editar =====
  const abrirModalEditar = (lote: Lote, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMenuAbertoId(null);
    setEditando({ ...lote, Tipo: parseInt(String(lote.Tipo || 1), 10) });
    setAbrirEditar(true);
    setIsDirty(false);
    setErroData(null);
  };

  const fecharModalEditar = () => {
    setAbrirEditar(false);
    setEditando(null);
    setErroData(null);
  };

  useEffect(() => {
    if (abrirEditar || abrirVenda) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abrirEditar, abrirVenda]);

  const onChangeEdit = <K extends keyof Lote>(key: K, value: Lote[K]) => {
    setEditando((old) => {
      if (!old) return old;
      setIsDirty(true);
      return { ...old, [key]: value };
    });
  };

  const onChangeData = (qual: "inicio" | "fim", value: string) => {
    const iso = value ? new Date(value + "T00:00:00Z").toISOString() : undefined;
    onChangeEdit(qual === "inicio" ? "DataInicioObra" : "DataFinalObra", iso as any);

    const ini = (qual === "inicio" ? iso : editando?.DataInicioObra)
      ? new Date(qual === "inicio" ? iso! : editando!.DataInicioObra!)
      : null;
    const fim = (qual === "fim" ? iso : editando?.DataFinalObra)
      ? new Date(qual === "fim" ? iso! : editando!.DataFinalObra!)
      : null;

    if (ini && fim && fim < ini) setErroData("A data de término deve ser igual ou posterior ao início.");
    else setErroData(null);
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editando) return;
    if (erroData) {
      toast.error(erroData);
      return;
    }
    try {
      const session = await getSession();
      const token = (session as any)?.token || (session?.user as any)?.token;

      const payload = {
        ID: editando.ID,
        Nome: String(editando.Nome ?? "").trim(),
        Endereco: String(editando.Endereco ?? ""),
        Bairro: String(editando.Bairro ?? ""),
        Area: String(editando.Area ?? ""), // backend espera string
        Tipo: parseInt(String(editando.Tipo || 1), 10),
        Previsto: Number(editando.Previsto ?? 0),
        Casagerminada: Boolean(editando.Casagerminada),
        Status: Boolean(editando.Status),
        DataInicioObra: editando.DataInicioObra ? new Date(editando.DataInicioObra).toISOString() : null,
        DataFinalObra: editando.DataFinalObra ? new Date(editando.DataFinalObra).toISOString() : null,
      };

      setSaving(true);
      const res = await fetch("https://backendgestaoobra.onrender.com/api/obra/v1/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      setSaving(false);

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Falha ao salvar edição.");
      }

      setLotes((prev) => prev.map((o) => (o.ID === editando.ID ? { ...o, ...editando, Tipo: payload.Tipo } : o)));
      toast.success("Obra atualizada com sucesso!");
      setIsDirty(false);
      fecharModalEditar();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao atualizar a obra.");
    }
  };

  // ===== Venda =====
  const abrirModalVenda = (lote: Lote) => {
    setMenuAbertoId(null);
    setVendendoDe(lote);
    setVenda({
      DataVenda: "",
      ValorVenda: 0,
      CPFComprador: "",
      FormaPagamento: "avista",
      Descricao: "",
      NomeComprador: "",
    });
    setAbrirVenda(true);
  };
  const fecharModalVenda = () => {
    setAbrirVenda(false);
    setVendendoDe(null);
  };
  const salvarVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendendoDe) return;

    if (!venda.DataVenda) return toast.error("Informe a data da venda.");
    if (!venda.NomeComprador.trim()) return toast.error("Informe o nome do comprador.");
    if (!venda.ValorVenda || venda.ValorVenda <= 0) return toast.error("Informe o valor da venda.");
    const cpfDigits = onlyDigits(venda.CPFComprador);
    if (cpfDigits.length !== 11) return toast.error("CPF inválido. Informe 11 dígitos.");

    try {
      const session = await getSession();
      const token = (session as any)?.token || (session?.user as any)?.token;

      const payload = {
        ObraID: vendendoDe.ID,
        DataVenda: new Date(venda.DataVenda + "T00:00:00Z").toISOString(),
        ValorVenda: venda.ValorVenda,
        CPFComprador: cpfDigits,
        FormaPagamento: venda.FormaPagamento,
        Descricao: venda.Descricao ?? "",
        NomeComprador: venda.NomeComprador.trim(),
      };

      setSavingVenda(true);
      const res = await fetch(API_SALE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      setSavingVenda(false);

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Falha ao registrar a venda.");
      }

      setLotes((prev) =>
        prev.map((o) =>
          o.ID === vendendoDe.ID
            ? {
                ...o,
                Vendida: true,
                VendaInfo: {
                  DataVenda: payload.DataVenda,
                  ValorVenda: payload.ValorVenda,
                  CPFComprador: payload.CPFComprador,
                  FormaPagamento: payload.FormaPagamento as Venda["FormaPagamento"],
                  Descricao: payload.Descricao,
                  NomeComprador: payload.NomeComprador,
                },
              }
            : o
        )
      );

      toast.success("Venda registrada com sucesso!");
      fecharModalVenda();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao registrar a venda.");
    }
  };

  // ===== Render =====
  return (
    <DefautPage session={session}>
      <section className="col-span-3 sm:col-span-8 px-2 pb-24">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Obras Cadastradas</h1>

        {carregando && (
          <div className="flex flex-col items-center justify-center text-gray-600 space-y-3">
            <div className="flex items-center">
              <Loader className="animate-spin w-6 h-6 mr-2" />
              Carregando dados...
            </div>
            <div className="animate-pulse space-y-2 w-full max-w-3xl">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {erro && <p className="text-center text-red-600 bg-red-100 px-4 py-2 rounded mt-4">{erro}</p>}

        {!carregando && !erro && lotes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Nenhuma obra cadastrada.</p>
        )}

        {!carregando && !erro && lotes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {lotesPaginados.map((lote) => {
                const progresso = calcularProgresso(lote.DataInicioObra, lote.DataFinalObra);

                return (
                  <div
                    key={lote.ID}
                    onClick={() => router.push(`/admin/acomp?id=${lote.ID}`)}
                    className="relative cursor-pointer rounded-2xl p-4 bg-white shadow-xl hover:shadow-2xl transition hover:bg-blue-50 flex flex-col justify-between min-h-[380px] border border-gray-100"
                  >
                    {/* Menu 3 pontos */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbertoId(menuAbertoId === lote.ID ? null : lote.ID);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                      aria-label="Mais ações"
                    >
                      <EllipsisVerticalIcon className="w-6 h-6 text-gray-500" />
                    </button>

                    {menuAbertoId === lote.ID && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-12 right-3 bg-white border shadow-lg rounded-xl z-10 w-48 overflow-hidden"
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                          onClick={(e) => abrirModalEditar(lote, e)}
                        >
                          Editar
                        </button>

                        {lote.Status && (
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setObraSelecionada(lote);
                              setModalConfirmar(true);
                              setMenuAbertoId(null);
                            }}
                          >
                            Marcar concluída
                          </button>
                        )}

                        {!lote.Status && !lote.Vendida && (
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalVenda(lote);
                            }}
                          >
                            Registrar venda
                          </button>
                        )}
                      </div>
                    )}

                    {/* Cabeçalho e infos */}
                    <div className="space-y-1">
                      <h2 className="card-title
                        text-2xl font-extrabold text-gray-700 leading-tight lg:text-xl
                        line-clamp-2 break-words min-w-0">{lote.Nome}</h2>
                        <div className="space-y-1 lg:space-y-2 min-w-0"></div>
                      <p className="text-sm text-gray-700">
                        <strong>Endereço:</strong> {lote.Endereco}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Bairro:</strong> {lote.Bairro}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Área:</strong> {lote.Area} m²
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {tiposObraMap[parseInt(String(lote.Tipo || 1), 10)]?.icon}
                        <span className="text-sm">
                          {tiposObraMap[parseInt(String(lote.Tipo || 1), 10)]?.text || "Tipo desconhecido"}
                        </span>
                        {lote.Casagerminada && (
                          <span className="ml-2 text-xs text-[#28a9b8] font-medium">(Geminada)</span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <InformationCircleIcon className={estiloicon} />
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            lote.Status ? "bg-[#28a9b8] text-white" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {lote.Status ? "Em andamento" : "Concluída"}
                        </span>

                        {lote.Vendida && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                            Vendida
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prazo + barra de progresso */}
                    <div className="mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <CalendarIcon className={estiloicon} />
                        <strong>Prazo:</strong>{" "}
                        {formatarData(lote.DataInicioObra)} a {formatarData(lote.DataFinalObra)}
                      </div>

                      <div className="h-2 mt-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-[#28a9b8] rounded-full" style={{ width: `${progresso}%` }} />
                      </div>
                      <p className="text-xs text-left text-gray-500 mt-1">{progresso.toFixed(0)}%</p>

                      {/* Alertas */}
                      {(() => {
                        const diasRestantes = lote.DataFinalObra
                          ? Math.ceil((new Date(lote.DataFinalObra).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                          : null;

                        if (diasRestantes !== null && diasRestantes <= 30 && progresso < 100 && lote.Status) {
                          return (
                            <div className="flex items-center mt-1 text-xs text-yellow-600">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              {diasRestantes} dia(s) restantes para o final.
                            </div>
                          );
                        }

                        if (diasRestantes !== null && progresso >= 100 && lote.Status) {
                          return (
                            <div className="flex items-center mt-1 text-xs text-red-600">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              Atrasada!
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Duração total quando concluída */}
                      {!lote.Status && lote.DataInicioObra && lote.DataFinalObra && (
                        <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>
                            Tempo total:{" "}
                            <span className="font-semibold">
                              {calcularDiasTotais(lote.DataInicioObra, lote.DataFinalObra)} dia(s)
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Informações da venda (se houver) */}
                      {lote.Vendida && lote.VendaInfo && (
                        <div className="mt-3 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Venda:</span>
                            <span>
                              {formatCurrencyBRL(lote.VendaInfo.ValorVenda)} em {formatarData(lote.VendaInfo.DataVenda)}
                            </span>
                          </div>
                          {lote.VendaInfo.NomeComprador && (
                            <p className="text-xs text-gray-600 mt-1">
                              Comprador(a): <span className="font-medium">{lote.VendaInfo.NomeComprador}</span>
                            </p>
                          )}
                          {lote.VendaInfo.FormaPagamento && (
                            <p className="text-xs text-gray-500 mt-1">
                              Forma de pagamento: {formatForma(lote.VendaInfo.FormaPagamento)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-80 transition bg-white"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-sm">Anterior</span>
              </button>

              {[...Array(totalPaginas)].map((_, index) => {
                const numero = index + 1;
                const ativo = paginaAtual === numero;
                return (
                  <button
                    key={numero}
                    onClick={() => setPaginaAtual(numero)}
                    className={`px-4 py-1 text-sm rounded-full border font-medium transition ${
                      ativo ? "bg-[#28a9b8] text-white border-[#28a9b8] shadow" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {numero}
                  </button>
                );
              })}

              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="flex items-center gap-1 px-3 py-1 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-80 transition bg-white"
              >
                <span className="text-sm">Próximo</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Modal sucesso conclusão */}
        {modalAberto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Obra Concluída</h3>
              <p className="text-gray-600 mb-4">
                A obra <strong>{obraConcluidaNome}</strong> foi marcada como{" "}
                <span className="text-green-600 font-medium">concluída</span>.
              </p>
              <button
                onClick={() => setModalAberto(false)}
                className="bg-[#28a9b8] hover:bg-[#1b778a] text-white px-4 py-2 rounded-md font-medium transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal confirmar conclusão */}
        {modalConfirmar && obraSelecionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmar Conclusão</h3>
              <p className="text-gray-600 mb-4">
                Deseja realmente marcar a obra <strong>{obraSelecionada.Nome}</strong> como{" "}
                <span className="text-green-600 font-medium">concluída</span>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmarConclusaoObra}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Sim
                </button>
                <button
                  onClick={() => {
                    setModalConfirmar(false);
                    setObraSelecionada(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal EDITAR */}
        {abrirEditar && editando && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
            onClick={fecharModalEditar}
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (erroData) {
                  toast.error(erroData);
                  return;
                }
                setSaving(true);
                await salvarEdicao(e);
                setSaving(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white 
                         rounded-2xl sm:rounded-3xl 
                         shadow-2xl sm:shadow-xl 
                         w-full max-w-lg 
                         animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-top-8 sm:scale-95
                         max-h-[85vh] overflow-y-auto 
                         mx-3 sm:mx-0"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 px-5 sm:px-6 py-3 bg-white/95 backdrop-blur flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Building2Icon className="w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-800">Editar Obra</h3>
                </div>
                <button type="button" onClick={fecharModalEditar} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="px-5 sm:px-6 pt-2 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Obra</label>
                    <input
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={editando.Nome}
                      onChange={(e) => onChangeEdit("Nome", e.target.value)}
                      required
                      placeholder="Ex.: Mercado Veneza"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Endereço</label>
                    <input
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={String(editando.Endereco ?? "")}
                      onChange={(e) => onChangeEdit("Endereco", e.target.value)}
                      placeholder="Rua / Av., nº"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Bairro</label>
                    <input
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={String(editando.Bairro ?? "")}
                      onChange={(e) => onChangeEdit("Bairro", e.target.value)}
                      placeholder="Centro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Área da Obra (m²)</label>
                    <input
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={String(editando.Area ?? "")}
                      onChange={(e) => onChangeEdit("Area", e.target.value)}
                      placeholder="Ex.: 3470"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Valor previsto (R$)</label>
                    <NumericFormat
                      value={Number(editando.Previsto ?? 0)}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      onValueChange={(v) => onChangeEdit("Previsto", Number(v.floatValue ?? 0))}
                      placeholder="Ex.: 12.500,00"
                    />
                    <p className="text-xs text-gray-400 mt-1">Somente números. Ex.: 12.500,00</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Tipo da Obra</label>
                    <select
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={parseInt(String(editando.Tipo || 1), 10)}
                      onChange={(e) => onChangeEdit("Tipo", parseInt(e.target.value, 10))}
                    >
                      <option value={1}>Casa térrea</option>
                      <option value={2}>2 andares</option>
                      <option value={3}>3 andares</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-800 font-semibold mb-1">Status</label>
                      <select
                        className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 py-2"
                        value={editando.Status ? "1" : "0"}
                        onChange={(e) => onChangeEdit("Status", e.target.value === "1")}
                      >
                        <option value="1">Em andamento</option>
                        <option value="0">Concluída</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={Boolean(editando.Casagerminada)}
                        onChange={(e) => onChangeEdit("Casagerminada", e.target.checked)}
                      />
                      Casa geminada
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Data Início Obra</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={editando.DataInicioObra ? new Date(editando.DataInicioObra).toISOString().slice(0, 10) : ""}
                      onChange={(e) => onChangeData("inicio", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-800 font-semibold mb-1">Data Previsão Término</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                      value={editando.DataFinalObra ? new Date(editando.DataFinalObra).toISOString().slice(0, 10) : ""}
                      onChange={(e) => onChangeData("fim", e.target.value)}
                    />
                  </div>
                </div>

                {erroData && <p className="mt-2 text-sm text-red-600">{erroData}</p>}
                {editando.DataInicioObra && editando.DataFinalObra && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-[#28a9b8] rounded-full"
                        style={{ width: `${calcularProgresso(editando.DataInicioObra, editando.DataFinalObra)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {calcularProgresso(editando.DataInicioObra, editando.DataFinalObra).toFixed(0)}% do prazo.
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t px-5 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={fecharModalEditar}
                    className="px-4 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !!erroData || !isDirty}
                    className={`px-4 py-2 rounded-xl text-white ${
                      saving || !!erroData || !isDirty ? "bg-gray-300 cursor-not-allowed" : "bg-[#28a9b8] hover:bg-[#1b778a]"
                    }`}
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Modal REGISTRAR VENDA — header com resumo + financeiro + form */}
        {abrirVenda && vendendoDe && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
            onClick={fecharModalVenda}
          >
            <form
              onSubmit={salvarVenda}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl sm:shadow-xl
                         w-full max-w-lg mx-3 sm:mx-0 max-h-[85vh] overflow-y-auto
                         animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-top-8 sm:scale-95"
            >
              {/* HEADER */}
              <div className="sticky top-0 z-10 px-5 sm:px-6 py-3 bg-white/95 backdrop-blur border-b">
                <div className="flex items-center justify-between">
                  {/* Ícone à esquerda + textos à direita */}
                  <div className="flex items-center gap-3 min-w-0">
                    <DollarSignIcon className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">Registrar venda</h3>
                      <p className="text-xs text-gray-500 truncate">
                        Obra: <span className="font-medium text-gray-700">{vendendoDe.Nome}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={fecharModalVenda}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>


              {/* HEADER SUMMARY */}
              <div className="px-5 sm:px-6 pt-4">
                <div className="rounded-xl border bg-gray-50 p-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <CalendarIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="grow">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">{formatarData(vendendoDe.DataInicioObra)}</span>
                        {" — "}
                        <span className="font-medium">{formatarData(vendendoDe.DataFinalObra)}</span>
                      </div>
                      {vendendoDe.DataInicioObra && vendendoDe.DataFinalObra && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {vendendoDe.Status ? (
                            <>Prazo em andamento</>
                          ) : (
                            <>
                              Concluída em {" "}
                              <span className="font-semibold">
                                {calcularDiasTotais(vendendoDe.DataInicioObra, vendendoDe.DataFinalObra)} dia(s)
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            vendendoDe.Status ? "bg-teal-500 text-white" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vendendoDe.Status ? "Em andamento" : "Concluída"}
                        </span>
                        {vendendoDe.Casagerminada && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
                            Geminada
                          </span>
                        )}
                        {vendendoDe.Tipo && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {typeof vendendoDe.Tipo === "number"
                              ? (["", "Térrea", "2 andares", "3 andares"][vendendoDe.Tipo] ?? "—")
                              : vendendoDe.Tipo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FINANCE SUMMARY */}
              {typeof vendendoDe.Previsto === "number" && vendendoDe.Previsto > 0 && (
                <div className="px-5 sm:px-6 pt-3">
                  <div className="rounded-xl border bg-white p-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Previsto</div>
                        <div className="font-semibold">
                          {formatCurrencyBRL(Number(vendendoDe.Previsto || 0))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Venda (preencher)</div>
                        <div className="font-semibold">{formatCurrencyBRL(Number(venda.ValorVenda || 0))}</div>
                      </div>
                      <div className="col-span-2 border-t pt-2 text-xs text-gray-500">
                        Dica: ao digitar o valor da venda, o resumo atualiza aqui.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM */}
              <div className="px-5 sm:px-6 pt-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Data da venda</label>
                  <input
                    type="date"
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    value={venda.DataVenda}
                    onChange={(e) => setVenda((v) => ({ ...v, DataVenda: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Valor da venda</label>
                  <NumericFormat
                    value={Number(venda.ValorVenda)}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    onValueChange={(val) => setVenda((v) => ({ ...v, ValorVenda: Number(val.floatValue ?? 0) }))}
                    placeholder="Ex.: 350.000,00"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Nome do comprador</label>
                  <input
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    value={venda.NomeComprador}
                    onChange={(e) => setVenda((v) => ({ ...v, NomeComprador: e.target.value }))}
                    placeholder="Ex.: Maria Souza"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">CPF do comprador</label>
                  <input
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={14}
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    value={venda.CPFComprador}
                    onChange={(e) => setVenda((v) => ({ ...v, CPFComprador: e.target.value }))}
                    placeholder="Somente números (11 dígitos)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Forma de pagamento</label>
                  <select
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    value={venda.FormaPagamento}
                    onChange={(e) =>
                      setVenda((v) => ({
                        ...v,
                        FormaPagamento: e.target.value as Venda["FormaPagamento"],
                      }))
                    }
                  >
                    <option value="avista">À vista</option>
                    <option value="financiamento">Financiamento</option>
                    <option value="consorcio">Consórcio</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Descrição (opcional)</label>
                  <textarea
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-teal-400 px-3 py-2"
                    rows={3}
                    value={venda.Descricao}
                    onChange={(e) => setVenda((v) => ({ ...v, Descricao: e.target.value }))}
                    placeholder="Observações sobre a venda"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t px-5 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={fecharModalVenda}
                    className="px-4 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingVenda}
                    className={`px-4 py-2 rounded-xl text-white ${
                      savingVenda ? "bg-gray-300 cursor-not-allowed" : "bg-[#28a9b8] hover:bg-[#1b778a]"
                    }`}
                  >
                    {savingVenda ? "Salvando..." : "Salvar venda"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      {!(abrirEditar || modalConfirmar || modalAberto || abrirVenda) && (
        <Link
          href="/admin/work/detail"
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#28a9b8] hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors z-40"
          aria-label="Adicionar obra"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">Nova Obra</span>
        </Link>
      )}
    </DefautPage>
  );
}
