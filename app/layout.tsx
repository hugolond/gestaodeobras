// These styles apply to every route in the application
import "@/styles/globals.css";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AuthStatus from "../components/auth-status";
import AuthDados from "../components/auth-dados";
import { Suspense} from "react";
import { Open_Sans } from "next/font/google";
import type { Viewport } from 'next'
import Sidebar from "./admin/sidebar";
import { getServerSession } from "next-auth"
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import React from "react";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

import bg from '../public/fundo.png'

const styling = {
  backgroundImage: `url('${bg.src}')`,
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat',
  backgroundPosition: '100%',
  height: '100vh'
}

const roboto = Open_Sans({ weight: "400", subsets: ["latin"] });

const title = "Gestão Obra Fácil";
const description =
  "Seu controle de obra no dia a dia. Gerenciador financeiro para pagamentos completo para controle de obras.";

export const metadata = {
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
}
export function generateViewport(params:any) {
  return {
    themeColor: 'black',
  }
}


export default async function RootLayout({
  
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={roboto.className} style={styling} >
      <GoogleAnalytics />
        <Toaster />
        <Suspense fallback="Carregando...">
          <AuthStatus />
        </Suspense>
        {children}
      </body>
    </html>
  );
}


