import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
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
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },
  callbackUrl: {
    name: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.callback-url"
      : "next-auth.callback-url",
    options: {
      sameSite: "lax",
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
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
},
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.roles = user.roles as string[];
        token.token = user.token;
        token.exp = (user as any).exp;
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
