"use client";

import { useState } from "react";
import { TEInput } from "tw-elements-react";
import { Button } from "@heroui/button";

export default function TelaCadastroColaborador({ session }: any) {
  const [nome, setNome] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState("hora");
  const [valor, setValor] = useState("");

  const handleSalvar = async () => {
    // Chamada para API ou Prisma Client
    const colaborador = { nome, tipoPagamento, valor: parseFloat(valor) };
    console.log("Salvar colaborador:", colaborador);
    // await salvarColaborador(colaborador);
  };
    return(
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Novo Colaborador</h1>

      <TEInput
        placeholder="Nome do colaborador"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <TEInput
            type="radio"
            name="tipoPagamento"
            value="hora"
            checked={tipoPagamento === "hora"}
            onChange={() => setTipoPagamento("hora")}
          />
          Por Hora
        </label>

        <label className="flex items-center gap-2">
          <TEInput
            type="radio"
            name="tipoPagamento"
            value="diaria"
            checked={tipoPagamento === "diaria"}
            onChange={() => setTipoPagamento("diaria")}
          />
          Por Diária
        </label>
      </div>

      <TEInput
        placeholder={tipoPagamento === "hora" ? "Valor por hora" : "Valor por diária"}
        type="number"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <Button onClick={handleSalvar}>Salvar</Button>
    </div>
    )
}