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

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json({ error: "Usuário já cadastrado!" }, { status: 400 });
  }

  const now = new Date();

  const user = await prisma.user.create({
    data: {
      id: randomUUID(), // gera um ID único (tipo text) como exige a DDL
      email,
      username,
      password: await hash(password, 10),
      active: active ?? false,
      roles: roles ?? "{user}",
      emailmanager,
      departament,
      createdat: now,
      updatedat: now,
      account_id: "11111111-1111-1111-1111-111111111111"
    },
  });

  return NextResponse.json(user);
}
