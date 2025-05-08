// lib/fetchComToken.ts
import { getSession } from "next-auth/react";

export async function fetchComToken(url: string, options: RequestInit = {}) {
  const session = await getSession();

  if (!session?.token) {
    throw new Error("Usuário não autenticado ou sessão expirada");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.token}`);
  headers.set("Content-Type", "application/json");

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Erro na requisição autenticada");
  }

  return res.json();
}
