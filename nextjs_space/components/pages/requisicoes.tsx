
'use client';

import { useState, useEffect } from 'react';
import { Request } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Inbox, 
  Search, 
  Plus,
  Send,
  Clock,
  CheckCircle,
  Filter,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Requisicoes() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockRequests: Request[] = [
      {
        id: '1',
        fromDept: 'Equipa Técnica',
        toDept: 'Logística',
        message: 'Precisamos de mais cones de treino para a sessão de amanhã. Podem disponibilizar 20 cones?',
        status: 'pendente',
        authorUid: 'coach1',
        createdAt: new Date('2024-01-15T10:30:00')
      },
      {
        id: '2',
        fromDept: 'Clínico',
        toDept: 'Direção',
        message: 'Solicitamos aprovação para compra de novo equipamento de fisioterapia no valor de €2.500.',
        status: 'feito',
        authorUid: 'medic1',
        createdAt: new Date('2024-01-14T14:20:00')
      },
      {
        id: '3',
        fromDept: 'Nutrição',
        toDept: 'Logística',
        message: 'Podem organizar o transporte dos suplementos que chegaram hoje ao armazém?',
        status: 'pendente',
        authorUid: 'nutri1',
        createdAt: new Date('2024-01-13T16:45:00')
      },
      {
        id: '4',
        fromDept: 'Logística',
        toDept: 'Equipa Técnica',
        message: 'O autocarro para o jogo de sábado estará disponível às 14h00 no parque de estacionamento.',
        status: 'feito',
        authorUid: 'logistic1',
        createdAt: new Date('2024-01-12T09:15:00')
      },
      {
        id: '5',
        fromDept: 'Direção',
        toDept: 'Clínico',
        message: 'Por favor, enviem o relatório mensal de lesões até ao final da semana.',
        status: 'pendente',
        authorUid: 'director1',
        createdAt: new Date('2024-01-11T11:30:00')
      }
    ];

    setRequests(mockRequests);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'feito':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'feito':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests?.filter(request => {
    const matchesSearch = request?.fromDept?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
                         request?.toDept?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
                         request?.message?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '');
    const matchesFilter = filterStatus === 'all' || request?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAsDone = (requestId: string) => {
    setRequests(prev => prev?.map(req => 
      req?.id === requestId ? { ...req, status: 'feito' as const } : req
    ));
    toast({
      title: "Requisição marcada como concluída",
      description: "O estado foi atualizado com sucesso.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Requisições</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted rounded-lg h-32"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Requisições</h1>
          <p className="text-muted-foreground">
            Gerir pedidos entre departamentos
          </p>
        </div>
        
        <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Requisição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Requisição</DialogTitle>
              <DialogDescription>
                Envie um pedido para outro departamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Departamento Destino</label>
                <select className="w-full border rounded-md px-3 py-2 mt-1">
                  <option value="">Selecionar departamento...</option>
                  <option value="Direção">Direção</option>
                  <option value="Clínico">Clínico</option>
                  <option value="Nutrição">Nutrição</option>
                  <option value="Logística">Logística</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea 
                  placeholder="Descreva o seu pedido..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setNewRequestOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  setNewRequestOpen(false);
                  toast({
                    title: "Requisição enviada",
                    description: "O pedido foi enviado com sucesso.",
                  });
                }}>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
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
              <Inbox className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold">{requests?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="ml-2 text-sm font-medium">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {requests?.filter(r => r?.status === 'pendente')?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="ml-2 text-sm font-medium">Concluídas</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {requests?.filter(r => r?.status === 'feito')?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="ml-2 text-sm font-medium">Esta Semana</span>
            </div>
            <div className="text-2xl font-bold">
              {requests?.filter(r => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return r?.createdAt && new Date(r.createdAt) > weekAgo;
              })?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar requisições..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="all">Todos os estados</option>
            <option value="pendente">Pendentes</option>
            <option value="feito">Concluídas</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests?.map((request) => (
          <Card key={request?.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{request?.fromDept}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{request?.toDept}</Badge>
                    </div>
                    
                    <Badge className={getStatusColor(request?.status || '')}>
                      {getStatusIcon(request?.status || '')}
                      <span className="ml-1 capitalize">{request?.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3 line-clamp-3">{request?.message}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {request?.createdAt?.toLocaleString?.('pt-PT') || 'Data inválida'}
                  </div>
                </div>

                {request?.status === 'pendente' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkAsDone(request?.id || '')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Feito
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests?.length === 0 && (
        <div className="text-center py-12">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma requisição encontrada</h3>
          <p className="mt-2 text-muted-foreground">
            Tente ajustar os filtros ou criar uma nova requisição.
          </p>
        </div>
      )}
    </div>
  );
}
