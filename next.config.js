/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // ✅ GZIP ativo

  swcMinify: true, // ✅ SWC otimizado

  typescript: {
    ignoreBuildErrors: true, // ⚠️ Ignora erros TS apenas se necessário
  },

  experimental: {
    forceSwcTransforms: true, // ✅ Ativa transformações SWC
    serverActions: true, // opcional se você usa App Router com ações do servidor
  },

  // headers úteis para cache (opcional)
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
