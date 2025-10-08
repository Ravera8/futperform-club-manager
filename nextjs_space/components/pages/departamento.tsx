
'use client';

import { useState, useEffect } from 'react';
import { Member } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Users, 
  Search, 
  Plus,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Departamento() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    availableStatus: 'Disponível'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members?clubId=default-club');
      const result = await response.json();
      
      if (result.success) {
        setMembers(result.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os membros',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      toast({
        title: 'Erro',
        description: 'Erro de conexão ao carregar membros',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha nome e email',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: 'default-club',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          availableStatus: formData.availableStatus,
          permissions: []
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Membro adicionado com sucesso!'
        });
        setIsDialogOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: '',
          availableStatus: 'Disponível'
        });
        loadMembers();
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Erro ao adicionar membro',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: 'Erro',
        description: 'Erro de conexão ao adicionar membro',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = members?.filter(member => {
    const matchesSearch = member?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
                         member?.role?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '');
    const matchesFilter = filterStatus === 'all' || member?.availableStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Equipa Técnica</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="bg-muted rounded-lg h-32"></div>
          <div className="bg-muted rounded-lg h-32"></div>
          <div className="bg-muted rounded-lg h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipa Técnica</h1>
          <p className="text-muted-foreground">
            Gerir membros e atividades do departamento
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Feed Interno
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      {/* Department Info Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Contactos do Departamento</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="mr-2 h-3 w-3" />
                  tecnica@clube.pt
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-3 w-3" />
                  +351 123 456 790
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Estatísticas</h3>
              <div className="space-y-1 text-sm">
                <div>Total de membros: <span className="font-semibold">{members?.length}</span></div>
                <div>Disponíveis: <span className="font-semibold text-green-600">
                  {members?.filter(m => m?.availableStatus === 'Disponível')?.length}
                </span></div>
                <div>Em campo: <span className="font-semibold text-yellow-600">
                  {members?.filter(m => m?.availableStatus === 'Em campo')?.length}
                </span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Nova Requisição</h3>
              <Button size="sm" variant="outline">
                <Send className="mr-2 h-3 w-3" />
                Enviar Pedido
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar membros..."
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
            <option value="Disponível">Disponíveis</option>
            <option value="Em campo">Em campo</option>
            <option value="De folga">De folga</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers?.map((member) => (
          <Card key={member?.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member?.photoURL || ''} alt={member?.name} />
                  <AvatarFallback>{getInitials(member?.name || '')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{member?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member?.role}</p>
                  <div className="mt-2">
                    <StatusBadge status={member?.availableStatus} />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-3 w-3" />
                  <span className="truncate">{member?.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-3 w-3" />
                  {member?.phone}
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Permissões</span>
                <div className="flex flex-wrap gap-1">
                  {member?.permissions?.slice(0, 3)?.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission?.replace('read:', 'Ver ')?.replace('write:', 'Editar ')}
                    </Badge>
                  ))}
                  {(member?.permissions?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(member?.permissions?.length || 0) - 3} mais
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Perfil
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers?.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhum membro encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            Tente ajustar os filtros de pesquisa ou adicionar novos membros.
          </p>
        </div>
      )}

      {/* Dialog para adicionar membro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo membro da equipa
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Nome Completo *</Label>
              <Input
                id="member-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-email">Email *</Label>
              <Input
                id="member-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao.silva@clube.pt"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-phone">Telefone</Label>
              <Input
                id="member-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+351 912 345 678"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-role">Função</Label>
              <Input
                id="member-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Ex: Treinador Principal"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-status">Estado de Disponibilidade</Label>
              <Select
                value={formData.availableStatus}
                onValueChange={(value) => setFormData({ ...formData, availableStatus: value })}
              >
                <SelectTrigger id="member-status">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Em campo">Em campo</SelectItem>
                  <SelectItem value="De folga">De folga</SelectItem>
                  <SelectItem value="Ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateMember}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'A adicionar...' : 'Adicionar Membro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
