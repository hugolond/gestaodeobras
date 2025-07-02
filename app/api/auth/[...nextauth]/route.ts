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

            // ⚠️ Validação de token
            if (!data?.token || typeof data.token !== "string" || !data.token.includes(".")) {
            throw new Error("Token inválido ou ausente");
            }

            const user = data.user;

            // ⚠️ Parse seguro de roles
            let roles: string[] = [];
            try {
            roles = JSON.parse(user.roles);
            if (!Array.isArray(roles)) roles = [user.roles];
            } catch {
            roles = [user.roles];
            }

            return {
            id: user.id,
            email: user.email,
            username: user.username || "",
            roles,
            token: data.token,
            };

        } catch (err) {
            console.error("Erro no authorize:", err);
            throw new Error("Erro ao autenticar. Verifique suas credenciais.");
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
    async jwt({ token, user }) {
      if (user) {
        const decoded = JSON.parse(
          Buffer.from(user.token.split(".")[1], "base64").toString()
        );

        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.roles = Array.isArray(user.roles) ? user.roles.join(",") : user.roles;
        token.token = user.token;
        token.exp = decoded.exp;
      }

      return token;
    }
    ,

    async session({ session, token }) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          username: token.username as string,
          roles: token.roles as string, // ← agora é seguro pois usamos join() acima
        };
        session.token = token.token as string;
        return session;
      }
      ,
    
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };