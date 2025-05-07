import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, username, emailmanager,roles, departament,  active , createdat} = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email
    },
  });
  if (exists) {
    return NextResponse.json({ error: "Usuário já cadastrado!" }, { status: 400 });
  } else {
    const createdAt = new Date(Date.now());
    const createdDate = createdAt.toISOString()
    const user = await prisma.user.create({
      data: {
        email,        
        username,
        createdat : createdDate, 
        password: await hash(password, 10),  
        active: false,
        roles: "{user}",
        emailmanager: emailmanager,
        departament
      },
    });
    return NextResponse.json(user);
  }
}
