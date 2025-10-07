
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Department } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Search, 
  Plus,
  Mail,
  Phone 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Organograma() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Simulação de dados enquanto Firebase não está configurado
    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'Direção',
        description: 'Gestão executiva do clube',
        head: 'João Silva',
        roles: ['Presidente', 'Vice-Presidente'],
        createdAt: new Date(),
        contacts_public: {
          email: 'direcao@clube.pt',
          phone: '+351 123 456 789'
        }
      },
      {
        id: '2', 
        name: 'Equipa Técnica',
        description: 'Treinadores e staff técnico',
        head: 'Carlos Santos',
        roles: ['Treinador Principal', 'Treinador Adjunto', 'Preparador Físico'],
        createdAt: new Date(),
        contacts_public: {
          email: 'tecnica@clube.pt',
          phone: '+351 123 456 790'
        }
      },
      {
        id: '3',
        name: 'Clínico',
        description: 'Departamento médico e fisioterapeutas',
        head: 'Dra. Ana Costa',
        roles: ['Médico', 'Fisioterapeuta', 'Massagista'],
        createdAt: new Date(),
        contacts_public: {
          email: 'clinico@clube.pt',
          phone: '+351 123 456 791'
        }
      },
      {
        id: '4',
        name: 'Nutrição',
        description: 'Nutricionistas e dietistas',
        head: 'Dr. Pedro Lopes',
        roles: ['Nutricionista', 'Dietista'],
        createdAt: new Date(),
        contacts_public: {
          email: 'nutricao@clube.pt',
          phone: '+351 123 456 792'
        }
      },
      {
        id: '5',
        name: 'Logística',
        description: 'Equipamentos e transporte',
        head: 'Maria Ferreira',
        roles: ['Roupeiro', 'Motorista', 'Segurança'],
        createdAt: new Date(),
        contacts_public: {
          email: 'logistica@clube.pt',
          phone: '+351 123 456 793'
        }
      }
    ];

    setDepartments(mockDepartments);
    setLoading(false);
    
    /* Código real para Firebase (descomentado quando configurado):
    const q = query(collection(db, 'clubs/demo/departments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const depts: Department[] = [];
      snapshot.forEach((doc) => {
        depts.push({ id: doc.id, ...doc.data() } as Department);
      });
      setDepartments(depts);
      setLoading(false);
    });
    
    return () => unsubscribe();
    */
  }, []);

  const filteredDepartments = departments.filter(dept =>
    dept?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
    dept?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
  );

  const getMemberCount = (deptId: string) => {
    // Simulação - normalmente viria da subcollection members
    const counts: { [key: string]: number } = {
      '1': 3,
      '2': 5, 
      '3': 4,
      '4': 2,
      '5': 6
    };
    return counts[deptId] || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Organograma do Clube</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organograma do Clube</h1>
          <p className="text-muted-foreground">
            Gerir departamentos e estrutura organizacional
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Departamento
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Procurar departamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Total Departamentos</span>
            </div>
            <div className="text-2xl font-bold">{departments?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Total Membros</span>
            </div>
            <div className="text-2xl font-bold">
              {departments?.reduce((acc, dept) => acc + getMemberCount(dept?.id || ''), 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-sm font-medium">Disponíveis</span>
            </div>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-yellow-600" />
              <span className="ml-2 text-sm font-medium">Em Campo</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments?.map((department) => (
          <Card key={department?.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                    <Building2 className="mr-2 h-5 w-5" />
                    {department?.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {department?.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Head */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Responsável</span>
                <Badge variant="outline">{department?.head}</Badge>
              </div>

              {/* Member Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Membros</span>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{getMemberCount(department?.id || '')}</span>
                </div>
              </div>

              {/* Contacts */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-3 w-3" />
                  {department?.contacts_public?.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-3 w-3" />
                  {department?.contacts_public?.phone}
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Funções</span>
                <div className="flex flex-wrap gap-1">
                  {department?.roles?.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
