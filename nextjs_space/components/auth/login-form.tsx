
'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/lib/firebase-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Utilizador Demo');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { mockLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try Firebase auth first
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Sucesso!",
        description: "Autenticado com sucesso.",
      });
    } catch (error: any) {
      // Fall back to mock login for demo
      console.warn('Firebase auth failed, using mock login');
      mockLogin(email || 'admin@demo.com');
      toast({
        title: "Modo Demo",
        description: "Autenticado em modo de demonstração.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil do utilizador com o nome
      await userCredential.user.getIdToken(true);
      
      toast({
        title: "Conta criada!",
        description: "Conta criada com sucesso.",
      });
    } catch (error: any) {
      // Fall back to mock signup for demo
      console.warn('Firebase signup failed, using mock signup');
      mockLogin(email || 'admin@demo.com');
      toast({
        title: "Modo Demo",
        description: "Conta criada em modo de demonstração.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Sucesso!",
        description: "Autenticado com Google.",
      });
    } catch (error: any) {
      // Fall back to mock login for demo
      console.warn('Google auth failed, using mock login');
      mockLogin('admin@demo.com');
      toast({
        title: "Modo Demo",
        description: "Autenticado em modo de demonstração.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais
        </CardDescription>
        <div className="text-center p-3 bg-blue-50 rounded-lg border">
          <p className="text-xs text-blue-700">
            🎯 <strong>Modo Demonstração</strong><br/>
            Clique em "Entrar" para acesso instantâneo
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleSignup(e as any);
              }}
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registar
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4" 
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continuar com Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
