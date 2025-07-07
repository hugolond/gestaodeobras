import "@/styles/globals.css";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Open_Sans } from "next/font/google";
import type { Viewport } from 'next';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Providers } from "./providers";
import BodyWrapper from "../components/BodyWrapper";

const roboto = Open_Sans({ weight: "400", subsets: ["latin"] });

const title = "Gestão Obra Fácil";
const description = "Seu controle de obra no dia a dia. Gerenciador financeiro para pagamentos completo para controle de obras.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: 'black',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={roboto.className}>
        <GoogleAnalytics />
        <Toaster />
        <Providers>
          <Suspense fallback="Carregando..." />
          <BodyWrapper>{children}</BodyWrapper>
        </Providers>
      </body>
    </html>
  );
}