import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { Cookie } from "next-auth/core/lib/cookie";
import { use } from "react";
import { assert } from "console";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name:"credentials",
      credentials: {
        id: {label:"Id" , type: "number"},
        username: {label:"UserName" , type: "string"},
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        roles: { label: "Roles", type: "string" },
        active : {label: "Active" , type: "bool"},
        departament : {label: "Departament" , type: "string"},
        emailmanager: {label: "EmailMananger" , type: "string"},
      },
      async authorize(credentials,req) {
        const {email, username, password} = credentials ?? {email:"a",username: "João"}
        if (!email || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
            username
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Usuário ou senha inválidos!");
        }
        if (user.active == false) {
          throw new Error("Usuário inativo!");
        }
        return user;
      },
    }),
  ],
  session:{
    strategy:'jwt',
    updateAge: 2 *60 *60,
    maxAge: 4 *60 *60
    },
  callbacks:{
    async jwt({ token, trigger, session , user }) {
      if (trigger === "update") {
        return {...token,...session.user}
      }
      return {...token,...user}
    },
    async session({ session, token}) {
      session.user = token as any;
      return session // The return type will match the one returned in `useSession()`
    },
  },
  
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
