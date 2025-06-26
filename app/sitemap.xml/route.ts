/* === pages/sitemap.xml.ts (Next.js App Router) === */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const baseUrl = 'https://www.gestaoobrafacil.com.br';
  const staticPages = [
    '',
    '/login',
    '/register',
    '/controle-financeiro-obras',
    '/gestao-de-pagamentos-construcao',
    '/orcamento-de-obra-online',
    '/comparativo-sistema-vs-planilha',
    '/planos',
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        (path) => `
      <url>
        <loc>${baseUrl}${path}</loc>
        <changefreq>weekly</changefreq>
        <priority>${path === '' ? '1.0' : '0.8'}</priority>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}