// src/app/admin/noticias/page.js (ou app/admin/noticias/page.js)
'use client';

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout'; 
import NoticiaForm from '../../components/admin/NoticiaForm'; 
import { useRouter } from 'next/navigation';

export default function AdicionarNoticiaPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData) => {
    setMessage('');
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/noticias', { // Use a URL completa para o backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar notícia');
      }

      const result = await response.json();
      setMessage(`Notícia "${formData.title}" adicionada com sucesso! ID: ${result.id}`);
      // Redirecionar após adicionar
      router.push('/admin/noticias'); // Ou para uma página de sucesso, ou limpar o formulário
    } catch (err) {
      console.error('Erro ao adicionar notícia:', err);
      setError(err.message);
    }
  };

  return (
    <AdminLayout title="Adicionar Nova Notícia">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Adicionar Nova Notícia</h1>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <NoticiaForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
}