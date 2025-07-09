import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import React from "react";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const FormatDate = (date: string) => {
  return formatInTimeZone(
    parseISO(date),
    "America/Sao_Paulo",
    "dd/MM/yyy HH:mm:ss"
  );
};

export function FormatDateIso(date: string) {
  return formatInTimeZone(
    parseISO(date),
    "America/Sao_Paulo",
    "yyyy-MM-dd'T'HH:mm:ssXX"
  );
}

export const CpfMask = (value: any) => {
  return value
    .replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1"); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
};

export const TelefoneMask = (value: any) => {
  var r = value.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length > 10) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 5) {
    r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r;
};

export const RemoveZeroEsquerda = (value: any) => {
  return value
    .replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1"); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
};

export const MoedaBR = (value: any) => {
  return value.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

export async function copylinkText(texto: string) {
  try {
    {
      copy(texto);
      toast.success("Copia realizada com sucesso!");
    }
  } catch (err) {
    toast.error("Falha ao copiar o texto " + err);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}