import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const {
    email,
    password,
    username,
    emailmanager,
    roles,
    departament,
    active
  } = await req.json();

  // Verifica se o usuário já existe
  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json({ error: "Usuário já cadastrado!" }, { status: 400 });
  }

  const now = new Date();

  // 🔎 Verifica se já existe uma account com esse e-mail
  let account = await prisma.account.findFirst({
    where: { email },
  });

  // ✅ Se não existir, cria uma nova com stripe_product_id "free"
  if (!account) {
    account = await prisma.account.create({
      data: {
        id: randomUUID(),
        email,
        nome: username,
        stripe_product_id: "free",
        status: true,
        createdAt: now,
      },
    });
  }

  // Cria o novo usuário vinculado à account
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email,
      username,
      password: await hash(password, 10),
      active: true,
      roles: roles ?? "{user}",
      emailmanager,
      departament,
      createdat: now,
      updatedat: now,
      account_id: account.id, // ✅ usa o ID da account existente ou recém-criada
    },
  });

  return NextResponse.json(user);
}