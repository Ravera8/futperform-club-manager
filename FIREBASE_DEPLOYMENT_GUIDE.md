
# 🔥 Guia de Deployment Firebase - FutPerform Club Manager

## ⚠️ IMPORTANTE: Antes de Começar

**NOTA**: Este projeto Next.js já está configurado para rodar localmente e pode ser deployed em plataformas como Vercel, Netlify, ou outros servidores Node.js. O deployment Firebase é **opcional** e necessário apenas se você quiser usar:
- Cloud Functions para lógica de backend
- Firestore Security Rules no lado do servidor
- Firebase Hosting (alternativa a outras plataformas)

## 📋 Pré-requisitos

1. **Projeto Firebase Criado**
   - Acesse [console.firebase.google.com](https://console.firebase.google.com)
   - Crie um novo projeto ou use um existente
   - Anote o **Project ID** (exemplo: `futperform-club-manager`)

2. **Firebase CLI Instalado**
   ```bash
   npm install -g firebase-tools
   ```

3. **Serviços Firebase Ativados** (no Firebase Console):
   - ✅ Authentication (Email/Password + Google)
   - ✅ Firestore Database
   - ✅ Cloud Functions (requer plano Blaze - pay-as-you-go)
   - ✅ Storage (para uploads)

## 🚀 Passo a Passo de Deployment

### Passo 1: Configurar o Project ID

**IMPORTANTE**: Edite o arquivo `.firebaserc` e substitua `futperform-club-manager` pelo ID do seu projeto Firebase:

```json
{
  "projects": {
    "default": "SEU-PROJECT-ID-AQUI"
  }
}
```

### Passo 2: Login no Firebase

```bash
cd /home/ubuntu/futperform_club_manager
firebase login
```

Este comando abrirá seu navegador para autenticação. Se você estiver em um ambiente sem interface gráfica, use:

```bash
firebase login --no-localhost
```

### Passo 3: Instalar Dependências das Cloud Functions

```bash
cd functions
npm install
cd ..
```

### Passo 4: Deploy das Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

Este comando irá:
- ✅ Fazer upload das regras de segurança do Firestore
- ✅ Validar as regras antes de aplicá-las
- ✅ Aplicar as regras ao seu banco de dados

### Passo 5: Deploy dos Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

Este comando criará os índices necessários para queries otimizadas.

### Passo 6: Deploy das Cloud Functions

```bash
firebase deploy --only functions
```

Este comando irá:
- ✅ Fazer upload das Cloud Functions
- ✅ Instalar dependências no servidor
- ✅ Implantar as funções (pode levar alguns minutos)

**Funções disponíveis:**
- `onUserCreated`: Cria perfil de usuário no Firestore quando novo usuário se registra
- `onDepartmentMemberAdded`: Envia notificações quando membro é adicionado a departamento
- `onRequestCreated`: Notifica departamento quando nova solicitação é criada
- `onRequestStatusChanged`: Notifica quando status de solicitação muda
- `processPlayerMetrics`: Calcula métricas agregadas de jogadores

### Passo 7: Deploy Completo (Opcional)

Para fazer deploy de tudo de uma vez:

```bash
firebase deploy
```

## 🔍 Verificar Deployment

### Ver Logs das Cloud Functions
```bash
firebase functions:log
```

### Ver Logs de uma Função Específica
```bash
firebase functions:log --only onUserCreated
```

### Testar Localmente com Emulators
```bash
firebase emulators:start
```

Acesse:
- Firebase UI: http://localhost:4000
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Auth: http://localhost:9099

## 📦 Deploy do Frontend (Next.js)

### Opção 1: Vercel (Recomendado)
1. Faça push do código para GitHub
2. Conecte seu repositório no [vercel.com](https://vercel.com)
3. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

### Opção 2: Firebase Hosting
```bash
cd nextjs_space
npm run build
npx next export
cd ..
firebase deploy --only hosting
```

## 🔐 Configurar Variáveis de Ambiente (Cloud Functions)

Para usar variáveis de ambiente nas Cloud Functions:

```bash
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
```

Exemplo:
```bash
firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-app-password"
```

## 🛠️ Troubleshooting

### Erro: "Project not found"
- Verifique se o Project ID em `.firebaserc` está correto
- Confirme que você tem permissões no projeto

### Erro: "Billing account required"
- Cloud Functions requerem o plano Blaze
- Configure em: [console.firebase.google.com/project/_/usage/details](https://console.firebase.google.com/project/_/usage/details)

### Erro: "Permission denied"
- Execute `firebase login` novamente
- Verifique se sua conta tem permissão de "Editor" ou "Owner" no projeto

### Cloud Functions não estão sendo chamadas
- Verifique os logs: `firebase functions:log`
- Confirme que os triggers estão corretos
- Teste com emulators localmente primeiro

## 📊 Monitoramento

### Firebase Console
- Acesse [console.firebase.google.com](https://console.firebase.google.com)
- Veja métricas de uso em cada seção (Functions, Firestore, Auth, etc.)

### Logs em Tempo Real
```bash
firebase functions:log --follow
```

## 💰 Custos Estimados

**Plano Blaze (Pay-as-you-go)**:
- Firestore: Grátis até 50.000 leituras/dia, 20.000 escritas/dia
- Cloud Functions: Grátis até 2M invocações/mês
- Authentication: Grátis (ilimitado)
- Storage: Grátis até 5GB
- Hosting: Grátis até 10GB/mês

Para a maioria dos clubes de futebol, o custo mensal será **€0-5** no início.

## 🎯 Próximos Passos

1. ✅ Configure o Project ID correto em `.firebaserc`
2. ✅ Faça login: `firebase login`
3. ✅ Deploy das rules: `firebase deploy --only firestore:rules`
4. ✅ Deploy das functions: `firebase deploy --only functions`
5. ✅ Teste a aplicação
6. ✅ Configure domínio personalizado (se necessário)
7. ✅ Configure backups automáticos do Firestore

## 📞 Suporte

Para mais informações:
- [Documentação Firebase](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Preços Firebase](https://firebase.google.com/pricing)

---

**Desenvolvido com ❤️ para o FutPerform Club Manager**
