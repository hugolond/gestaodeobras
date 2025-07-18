import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomAuthOptions extends NextAuthOptions {
  trustHost?: boolean;
}

export const authOptions: CustomAuthOptions = {
    trustHost: process.env.NODE_ENV === "production",
      useSecureCookies: process.env.NODE_ENV === "production",
      providers: [
        CredentialsProvider({
          name: "credentials",
          credentials: { email: { type: "email" }, password: { type: "password" } },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Email e senha são obrigatórios");
            }
    
            const res = await fetch("https://backendgestaoobra.onrender.com/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            });
            const data = await res.json();
    
            if (!res.ok || !data.token) throw new Error(data.error || "Falha no login");
    
            const decoded = JSON.parse(Buffer.from(data.token.split(".")[1], "base64").toString());
            return {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username,
              roles: Array.isArray(data.user.roles)
                ? data.user.roles.join(",")
                : data.user.roles,
              token: data.token,
              exp: decoded.exp,
            };
          },
        }),
      ],
      cookies: {
      sessionToken: {
        name: process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
        options: {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        },
      },
      callbackUrl: {
        name: process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
        options: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
      csrfToken: {
        name: process.env.NODE_ENV === "production"
          ? "_Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
        options: {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
      },
      session: {
        strategy: "jwt",
        updateAge: 60, // 2 horas
        maxAge: 60 * 60, // 4 horas
      },
      callbacks: {
        async jwt({ token, user, trigger, session }) {
            const now = Math.floor(Date.now() / 1000);
            const exp = (token as any).exp;

            // Se token estiver prestes a expirar, tenta renovar
            if (exp && exp - now < 60) {
              try {
                const refreshRes = await fetch(
                  `https://backendgestaoobra.onrender.com/refresh?token=${(token as any).token}`
                );
                const refreshData = await refreshRes.json();
                if (refreshRes.ok && refreshData.token) {
                  const decoded = JSON.parse(
                    Buffer.from(refreshData.token.split(".")[1], "base64").toString()
                  );
                  token.token = refreshData.token;
                  token.exp = decoded.exp;
                }
              } catch (err) {
                console.error("Erro ao renovar token", err);
              }
            }

            if (user) {
              const decoded = JSON.parse(
                Buffer.from((user as any).token.split(".")[1], "base64").toString()
              );
              return {
                id: user.id,
                email: user.email,
                username: user.username,
                roles: user.roles,
                token: user.token,
                exp: decoded.exp,
              };
            }

            if (trigger === "update") {
              return { ...token, ...session.user };
            }

            return token;
          },
        async session({ session, token }) {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
          session.user.username = token.username as string;
          session.user.roles = token.roles as string;
          session.token = token.token as string;
          return session;
        },
      },
      pages: { signIn: "/login" },
};