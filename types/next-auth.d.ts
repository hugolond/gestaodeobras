// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      roles: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    roles: string[];
    token: string;
  }

  interface JWT {
    id: string;
    email: string;
    username: string;
    roles: string;
    token: string;
  }
}
