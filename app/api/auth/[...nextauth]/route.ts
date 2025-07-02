import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e senha são obrigatórios");
        }

        try {
            const response = await fetch("https://backendgestaoobra.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
            });

            const data = await response.json();

            if (!response.ok) {
            throw new Error(data?.error || "Falha na autenticação");
            }

            // ✅ Validação de campos esperados
            if (
            !data?.user?.id ||
            !data?.user?.email ||
            !data?.token ||
            typeof data.token !== "string" ||
            !data.token.includes(".")
            ) {
            throw new Error("Dados de autenticação inválidos");
            }

            return {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username || "",
            roles: data.user.roles || [],
            token: data.token,
            };

        } catch (error) {
            console.error("Erro no authorize:", error);
            throw new Error("Erro ao autenticar. Tente novamente.");
        }
        }
    }),
  ],
  useSecureCookies: true, // ← Esse precisa estar ATIVO!
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      },
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      },
    },
    csrfToken: {
      name: `_Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      },
    },
  },
  session: {
    strategy: "jwt",
    updateAge: 2 * 60 * 60, // 2 horas
    maxAge: 4 * 60 * 60, // 4 horas
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);
      const exp = (token as any).exp;

      // Se token estiver prestes a expirar, tenta renovar
      if (exp && exp - now < 2 * 60 * 60) {
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
      session.user = {
        id: token.id as string,
        email: token.email as string,
        username: token.username as string,
        roles: token.roles as string,
      };
      session.token = token.token as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };