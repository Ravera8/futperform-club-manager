
'use client';

import { useState, useEffect } from 'react';
import { FeedPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Search, 
  Plus,
  Calendar,
  Filter,
  Users,
  Building2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FeedGlobal() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [newPostOpen, setNewPostOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        authorUid: 'coach1',
        title: 'Treino de amanhã cancelado',
        body: 'Devido às condições meteorológicas adversas, o treino de amanhã às 15h00 foi cancelado. Reagendaremos para sexta-feira.',
        departmentId: 'Equipa Técnica',
        createdAt: new Date('2024-01-15T14:30:00'),
        visibility: {
          departments: ['Equipa Técnica', 'Direção'],
          roles: [],
          users: []
        }
      },
      {
        id: '2',
        authorUid: 'medic1',
        title: 'Relatório Médico Semanal',
        body: 'Esta semana registámos 2 lesões ligeiras e 3 jogadores em processo de recuperação. Pedro Santos deve regressar na próxima semana.',
        departmentId: 'Clínico',
        createdAt: new Date('2024-01-14T16:20:00'),
        visibility: {
          departments: ['Clínico', 'Equipa Técnica', 'Direção'],
          roles: [],
          users: []
        }
      },
      {
        id: '3',
        authorUid: 'director1',
        title: 'Reunião Mensal da Direção',
        body: 'A reunião mensal da direção está marcada para quinta-feira às 10h00 na sala de reuniões. Agenda em anexo.',
        departmentId: 'Direção',
        createdAt: new Date('2024-01-13T09:45:00'),
        visibility: {
          departments: ['Direção'],
          roles: ['Presidente', 'Diretor'],
          users: []
        }
      },
      {
        id: '4',
        authorUid: 'nutri1',
        title: 'Novos Suplementos Disponíveis',
        body: 'Chegaram os novos suplementos proteicos para os atletas. Podem recolher na sala de nutrição durante esta semana.',
        departmentId: 'Nutrição',
        createdAt: new Date('2024-01-12T11:15:00'),
        visibility: {
          departments: ['Nutrição', 'Equipa Técnica'],
          roles: [],
          users: []
        }
      },
      {
        id: '5',
        authorUid: 'logistic1',
        title: 'Equipamentos de Treino',
        body: 'Foram adquiridos novos cones de treino e marcadores. Estão disponíveis no armazém para utilização.',
        departmentId: 'Logística',
        createdAt: new Date('2024-01-11T08:30:00'),
        visibility: {
          departments: ['Logística', 'Equipa Técnica'],
          roles: [],
          users: []
        }
      }
    ];

    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const getAuthorInfo = (authorUid: string) => {
    // Mock author data - normally would come from user collection
    const authors: { [key: string]: { name: string; role: string } } = {
      'coach1': { name: 'Carlos Santos', role: 'Treinador Principal' },
      'medic1': { name: 'Dra. Ana Costa', role: 'Médica' },
      'director1': { name: 'João Silva', role: 'Presidente' },
      'nutri1': { name: 'Dr. Pedro Lopes', role: 'Nutricionista' },
      'logistic1': { name: 'Maria Ferreira', role: 'Responsável Logística' }
    };
    return authors[authorUid] || { name: 'Utilizador', role: 'Membro' };
  };

  const getInitials = (name: string) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'U';
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Direção': 'bg-blue-100 text-blue-800',
      'Equipa Técnica': 'bg-green-100 text-green-800',
      'Clínico': 'bg-red-100 text-red-800',
      'Nutrição': 'bg-yellow-100 text-yellow-800',
      'Logística': 'bg-purple-100 text-purple-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
                         post?.body?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '');
    const matchesFilter = filterDepartment === 'all' || post?.departmentId === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const departments = [...new Set(posts?.map(p => p?.departmentId)?.filter(Boolean))];

  const getVisibilityText = (visibility: FeedPost['visibility']) => {
    const parts = [];
    if (visibility?.departments?.length > 0) {
      parts.push(`${visibility.departments.length} dept${visibility.departments.length > 1 ? 's' : ''}`);
    }
    if (visibility?.roles?.length > 0) {
      parts.push(`${visibility.roles.length} função${visibility.roles.length > 1 ? 'ões' : ''}`);
    }
    if (visibility?.users?.length > 0) {
      parts.push(`${visibility.users.length} utilizador${visibility.users.length > 1 ? 'es' : ''}`);
    }
    return parts.join(', ') || 'Público';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Feed Global</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted rounded-lg h-40"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Feed Global</h1>
          <p className="text-muted-foreground">
            Acompanhar comunicações entre departamentos
          </p>
        </div>
        
        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Post no Feed</DialogTitle>
              <DialogDescription>
                Partilhe informação com outros departamentos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input 
                  placeholder="Título do post..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Conteúdo</label>
                <Textarea 
                  placeholder="Escreva a mensagem..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Visibilidade</label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="dept-tecnica" />
                    <label htmlFor="dept-tecnica" className="text-sm">Equipa Técnica</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="dept-clinico" />
                    <label htmlFor="dept-clinico" className="text-sm">Clínico</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="dept-nutricao" />
                    <label htmlFor="dept-nutricao" className="text-sm">Nutrição</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewPostOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  setNewPostOpen(false);
                  toast({
                    title: "Post publicado",
                    description: "A mensagem foi partilhada com sucesso.",
                  });
                }}>
                  Publicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Total Posts</span>
            </div>
            <div className="text-2xl font-bold">{posts?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Esta Semana</span>
            </div>
            <div className="text-2xl font-bold">
              {posts?.filter(p => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return p?.createdAt && new Date(p.createdAt) > weekAgo;
              })?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Departamentos</span>
            </div>
            <div className="text-2xl font-bold">{departments?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Contribuidores</span>
            </div>
            <div className="text-2xl font-bold">
              {new Set(posts?.map(p => p?.authorUid))?.size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="all">Todos os departamentos</option>
            {departments?.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {filteredPosts?.map((post) => {
          const author = getAuthorInfo(post?.authorUid || '');
          return (
            <Card key={post?.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={author?.name} />
                    <AvatarFallback>{getInitials(author?.name || '')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{author?.name}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{author?.role}</span>
                      <Badge className={getDepartmentColor(post?.departmentId || '')}>
                        {post?.departmentId}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg mb-2">{post?.title}</CardTitle>
                    
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {post?.createdAt?.toLocaleString?.('pt-PT') || 'Data inválida'}
                      </div>
                      <div className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {getVisibilityText(post?.visibility)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post?.body}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPosts?.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhum post encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Tente ajustar os filtros ou criar um novo post.
          </p>
        </div>
      )}
    </div>
  );
}
