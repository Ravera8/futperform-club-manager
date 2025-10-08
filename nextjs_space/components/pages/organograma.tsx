
'use client';

import { useState, useEffect } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Organograma() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    email: '',
    phone: '',
    roles: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments?clubId=default-club');
      const result = await response.json();
      
      if (result.success) {
        setDepartments(result.data);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os departamentos',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      toast({
        title: 'Erro',
        description: 'Erro de conexão ao carregar departamentos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha nome e descrição',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const rolesArray = formData.roles.split(',').map(r => r.trim()).filter(r => r);
      
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clubId: 'default-club',
          name: formData.name,
          description: formData.description,
          head: formData.head,
          roles: rolesArray,
          contacts_public: {
            email: formData.email,
            phone: formData.phone
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Departamento criado com sucesso!'
        });
        setIsDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          head: '',
          email: '',
          phone: '',
          roles: ''
        });
        loadDepartments();
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Erro ao criar departamento',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      toast({
        title: 'Erro',
        description: 'Erro de conexão ao criar departamento',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <Button onClick={() => setIsDialogOpen(true)}>
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

      {/* Dialog para criar departamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Departamento</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo departamento do clube
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Equipa Técnica"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva as responsabilidades do departamento"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="head">Responsável</Label>
              <Input
                id="head"
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email de Contato</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="departamento@clube.pt"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+351 123 456 789"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="roles">Funções (separadas por vírgula)</Label>
              <Textarea
                id="roles"
                value={formData.roles}
                onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                placeholder="Ex: Treinador Principal, Treinador Adjunto, Preparador Físico"
                rows={2}
              />
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
              onClick={handleCreateDepartment}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'A criar...' : 'Criar Departamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
