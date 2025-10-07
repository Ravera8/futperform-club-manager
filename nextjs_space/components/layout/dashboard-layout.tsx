
'use client';

import { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Organograma } from '@/components/pages/organograma';
import { Departamento } from '@/components/pages/departamento';
import { Jogadores } from '@/components/pages/jogadores';
import { Requisicoes } from '@/components/pages/requisicoes';
import { FeedGlobal } from '@/components/pages/feed-global';

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState('organograma');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'organograma':
        return <Organograma />;
      case 'departamento':
        return <Departamento />;
      case 'jogadores':
        return <Jogadores />;
      case 'requisicoes':
        return <Requisicoes />;
      case 'feed':
        return <FeedGlobal />;
      default:
        return <Organograma />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 md:ml-0">
          <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
