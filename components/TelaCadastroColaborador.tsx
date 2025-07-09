"use client"

import React, { useState } from "react";

import { Button } from '@heroui/button'

import { Card, CardContent } from "@/components/ui/card";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isWeekend, isSameDay, differenceInMinutes } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/components/ui/dialog";
import { Input } from "../components/components/ui/input";
import { Label } from "../components/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/components/ui/select";

const mockObras = ["Residencial Monte Carlos", "Obra Santa Rita", "Condomínio Recanto"];
const valorDiaria = 100;

interface DiaTrabalhado {
  data: Date;
  inicio: string;
  fim: string;
  obra: string;
}

export default function CalendarioColaborador({ session }: any) {
  const [semanaBase, setSemanaBase] = useState(new Date());
  const [trabalhados, setTrabalhados] = useState<DiaTrabalhado[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [obra, setObra] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [open, setOpen] = useState(false);

  const diasSemana = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(semanaBase, { weekStartsOn: 1 }), i));
  const primeiroDiaSemana = startOfWeek(semanaBase, { weekStartsOn: 1 });
  const mesFormatado = format(primeiroDiaSemana, "MMMM 'de' yyyy", { locale: ptBR });
  const mesCapitalizado = mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1);

  const totalSemana = trabalhados.filter((dia) => diasSemana.some((d) => isSameDay(d, new Date(dia.data)))).length * valorDiaria;
  const resumoHorasPorObra: { [obra: string]: number } = {};

  trabalhados.forEach((dia) => {
    if (diasSemana.some((d) => isSameDay(d, new Date(dia.data)))) {
      const [ih, im] = dia.inicio.split(":").map(Number);
      const [fh, fm] = dia.fim.split(":").map(Number);
      const minutos = differenceInMinutes(new Date(0, 0, 0, fh, fm), new Date(0, 0, 0, ih, im));
      if (!resumoHorasPorObra[dia.obra]) resumoHorasPorObra[dia.obra] = 0;
      resumoHorasPorObra[dia.obra] += minutos;
    }
  });

  const handleSelecionarDia = (data: Date) => {
    const diaExistente = trabalhados.find((d) => isSameDay(d.data, data));
    setDiaSelecionado(data);
    setObra(diaExistente?.obra || "");
    setInicio(diaExistente?.inicio || "");
    setFim(diaExistente?.fim || "");
    setOpen(true);
  };

  const salvarDia = () => {
    if (diaSelecionado) {
      setTrabalhados((prev) => {
        const filtrados = prev.filter((d) => !isSameDay(d.data, diaSelecionado));
        return [...filtrados, { data: diaSelecionado, inicio, fim, obra }];
      });
      setOpen(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white">
      <h2 className="text-xl font-bold text-center mb-4">Colaborador: João Silva</h2>
      <div className="mb-4">
      <Card >
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Resumo da semana</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {totalSemana.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            {Object.entries(resumoHorasPorObra).map(([obra, minutos]) => (
              <div key={obra} className="flex justify-between">
                <span>{obra}</span>
                <span>{Math.floor(minutos / 60)}h {minutos % 60}m</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      <div className="bg-gray-50 rounded-xl shadow-sm p-4 mb-4">
        <div className="text-center text-sm font-medium text-gray-600 mb-2">🗓️ {mesCapitalizado}</div>
        <div className="grid grid-cols-3 gap-4">
          {diasSemana.map((dia) => {
            const trabalhado = trabalhados.find((d) => isSameDay(d.data, dia));
            const isSabDom = isWeekend(dia);

            return (
              <div key={dia.toISOString()} className="flex flex-col items-center">
                <span className="text-xs font-semibold text-gray-500">
                  {format(dia, "dd EEE", { locale: ptBR })}
                </span>
                <div
                  onClick={() => handleSelecionarDia(dia)}
                  className={`w-full h-24 mt-1 rounded-xl p-2 border text-center cursor-pointer flex flex-col justify-center transition-all duration-200 ease-in-out
                    ${trabalhado ? "border-green-500 bg-green-100" : "border-gray-300 bg-white"}
                    ${isSabDom ? "bg-red-100" : ""}`}
                >
                  {trabalhado ? (
                    <>
                      <span className="text-[10px] truncate text-gray-700 font-medium">
                        {trabalhado.obra}
                      </span>
                      <span className="text-xs text-gray-600 mt-1">
                        {trabalhado.inicio} - {trabalhado.fim}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-300">--</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <Button onClick={() => setSemanaBase((prev) => subWeeks(prev, 1))} className="w-1/2">
          Anterior
        </Button>
        <Button onClick={() => setSemanaBase((prev) => addWeeks(prev, 1))} className="w-1/2">
          Próxima
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro do dia {diaSelecionado ? format(diaSelecionado, 'dd/MM/yyyy') : ""}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="text-sm">Obra</Label>
              <Select value={obra} onValueChange={setObra}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma obra" />
                </SelectTrigger>
                <SelectContent>
                  {mockObras.map((obra, i) => (
                    <SelectItem key={i} value={obra}>{obra}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm">Início</Label>
                <Input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} />
              </div>
              <div className="flex-1">
                <Label className="text-sm">Fim</Label>
                <Input type="time" value={fim} onChange={(e) => setFim(e.target.value)} />
              </div>
            </div>

            <Button className="w-full mt-2" onClick={salvarDia}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
