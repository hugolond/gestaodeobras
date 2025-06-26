import React from 'react';
import PlanosSection from '../admin/planossection';

export default function PlanosPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Várias opções e formatos 
      </h1>
      <PlanosSection />
    </main>
  );
}