
'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCircle, 
  Search, 
  Plus,
  MapPin,
  Calendar,
  Activity,
  Filter,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Jogadores() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const { toast } = useToast();

  // Dados mockados para demonstração
  useEffect(() => {
    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'João Silva',
        dob: '1995-03-15',
        position: 'Guarda-Redes',
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: 'Clínico',
            text: 'Exames médicos em dia. Nenhuma lesão reportada.',
            date: new Date('2024-01-10'),
            authorUid: 'medic1'
          }
        ]
      },
      {
        id: '2',
        name: 'Pedro Santos',
        dob: '1998-07-22',
        position: 'Defesa Central',
        status: 'Lesionado',
        photoURL: '',
        observations: [
          {
            departmentId: 'Clínico',
            text: 'Lesão ligamentar no joelho direito. Repouso por 3 semanas.',
            date: new Date('2024-01-15'),
            authorUid: 'medic1'
          },
          {
            departmentId: 'Equipa Técnica',
            text: 'Jogador muito promissor, liderança natural em campo.',
            date: new Date('2024-01-05'),
            authorUid: 'coach1'
          }
        ]
      },
      {
        id: '3',
        name: 'Carlos Rodrigues',
        dob: '1996-11-08',
        position: 'Médio',
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: 'Nutrição',
            text: 'Dieta adequada às necessidades. Controlo de peso mensal.',
            date: new Date('2024-01-12'),
            authorUid: 'nutri1'
          }
        ]
      },
      {
        id: '4',
        name: 'Miguel Costa',
        dob: '1999-05-30',
        position: 'Extremo',
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: 'Equipa Técnica',
            text: 'Velocidade excelente, precisa melhorar finalização.',
            date: new Date('2024-01-08'),
            authorUid: 'coach1'
          }
        ]
      },
      {
        id: '5',
        name: 'Tiago Fernandes',
        dob: '1997-09-14',
        position: 'Avançado',
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: 'Clínico',
            text: 'Prevenção de lesões - alongamentos específicos.',
            date: new Date('2024-01-14'),
            authorUid: 'physio1'
          }
        ]
      }
    ];

    setPlayers(mockPlayers);
    setLoading(false);
  }, []);

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'apto':
        return 'bg-green-100 text-green-800';
      case 'lesionado':
        return 'bg-red-100 text-red-800';
      case 'dúvida':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'J';
  };

  const filteredPlayers = players?.filter(player => {
    const matchesSearch = player?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
                         player?.position?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '');
    const matchesFilter = filterPosition === 'all' || player?.position === filterPosition;
    return matchesSearch && matchesFilter;
  });

  const positions = [...new Set(players?.map(p => p?.position)?.filter(Boolean))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Jogadores</h1>
        </div>
        <div className="animate-pulse grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-muted rounded-lg h-64"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Jogadores</h1>
          <p className="text-muted-foreground">
            Gerir plantel e acompanhar estado dos jogadores
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Jogador
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Total Jogadores</span>
            </div>
            <div className="text-2xl font-bold">{players?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-sm font-medium">Aptos</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {players?.filter(p => p?.status === 'Apto')?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-red-600" />
              <span className="ml-2 text-sm font-medium">Lesionados</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {players?.filter(p => p?.status === 'Lesionado')?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Idade Média</span>
            </div>
            <div className="text-2xl font-bold">
              {players?.length ? Math.round(players.reduce((acc, p) => acc + calculateAge(p?.dob || ''), 0) / players.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar jogadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="all">Todas as posições</option>
            {positions?.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers?.map((player) => (
          <Card key={player?.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={player?.photoURL || ''} alt={player?.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(player?.name || '')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{player?.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{player?.position}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {calculateAge(player?.dob || '')} anos
                    </span>
                  </div>
                </div>
                
                <Badge className={getStatusColor(player?.status || '')}>
                  {player?.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {/* Latest Observations */}
              {player?.observations?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Observações Recentes</span>
                    <FileText className="h-3 w-3 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {player?.observations?.slice(0, 2)?.map((obs, index) => (
                      <div key={index} className="text-xs bg-muted p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            {obs?.departmentId}
                          </Badge>
                          <span className="text-muted-foreground">
                            {obs?.date?.toLocaleDateString?.('pt-PT') || 'Data inválida'}
                          </span>
                        </div>
                        <p className="line-clamp-2">{obs?.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  {(player?.observations?.length || 0) > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{(player?.observations?.length || 0) - 2} observações mais
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers?.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhum jogador encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Tente ajustar os filtros de pesquisa ou adicionar novos jogadores.
          </p>
        </div>
      )}
    </div>
  );
}
