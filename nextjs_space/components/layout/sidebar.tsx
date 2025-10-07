
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Inbox, 
  UserCircle,
  Menu,
  X 
} from 'lucide-react';

const navigation = [
  { name: 'Organograma', href: '#organograma', icon: Building2, current: true },
  { name: 'Meu Departamento', href: '#departamento', icon: Users, current: false },
  { name: 'Jogadores', href: '#jogadores', icon: UserCircle, current: false },
  { name: 'Requisições', href: '#requisicoes', icon: Inbox, current: false },
  { name: 'Feed Global', href: '#feed', icon: MessageSquare, current: false },
];

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (href: string) => {
    onPageChange(href.replace('#', ''));
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full pt-20 md:pt-4">
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = currentPage === item.href.replace('#', '');
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
