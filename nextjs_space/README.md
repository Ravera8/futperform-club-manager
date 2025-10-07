
# FutPerform Club Manager

Sistema completo de gestão de clubes de futebol desenvolvido com Next.js e Firebase.

## 🚀 Características

- **Autenticação segura** com Firebase Auth (Email/Password + Google Sign-In)
- **Gestão de departamentos** com estrutura hierárquica
- **Controlo de acesso baseado em roles** (RBAC)
- **Sistema de comunicação** entre departamentos
- **Gestão de jogadores** com observações médicas e técnicas
- **Feed interno** com visibilidade controlada
- **Sistema de requisições** entre departamentos
- **Interface responsive** em Português de Portugal
- **Notificações em tempo real** com Firebase Cloud Functions

## 📋 Requisitos

- Node.js 18+
- Firebase CLI
- Yarn ou npm
- Conta Firebase

## 🛠️ Configuração Inicial

### 1. Configurar Projeto Firebase

1. Aceder a [Firebase Console](https://console.firebase.google.com/)
2. Criar novo projeto ou selecionar existente
3. Ativar os seguintes serviços:
   - **Authentication** (Email/Password + Google)
   - **Firestore Database**
   - **Cloud Functions**
   - **Hosting** (opcional)

### 2. Obter Credenciais Firebase

1. Ir para "Project Settings" (ícone engrenagem)
2. Na aba "General", descer até "Your apps"
3. Clicar "Add app" e selecionar "Web" (</>)
4. Registar app com nome "FutPerform Club Manager"
5. Copiar o objeto `firebaseConfig`

### 3. Configurar Credenciais Locais

Editar o ficheiro `lib/firebase.js` e substituir as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 4. Instalar Dependências

```bash
cd nextjs_space
yarn install

# Instalar Firebase CLI globalmente
npm install -g firebase-tools
```

### 5. Fazer Login no Firebase CLI

```bash
firebase login
firebase init

# Selecionar os serviços:
# - Firestore
# - Functions  
# - Hosting (opcional)
```

## 🔧 Development Setup

### 1. Configurar Emuladores Firebase

```bash
# Iniciar emuladores (recomendado para desenvolvimento)
firebase emulators:start

# O Firebase UI estará disponível em http://localhost:4000
# - Firestore: http://localhost:8080
# - Auth: http://localhost:9099
# - Functions: http://localhost:5001
```

### 2. Aplicar Regras de Segurança

```bash
# Deploy das regras Firestore
firebase deploy --only firestore:rules

# Deploy dos índices
firebase deploy --only firestore:indexes
```

### 3. Popular Base de Dados (Opcional)

```bash
# Executar script de seed data
node scripts/seed-data.js
```

### 4. Executar Aplicação

```bash
# Modo desenvolvimento
yarn dev

# Aplicação disponível em http://localhost:3000
```

## 📊 Estrutura da Base de Dados

### Firestore Collections

```
clubs/{clubId}/
├── departments/{departmentId}
│   ├── name, description, head, roles
│   ├── contacts_public: {email, phone}
│   └── members/{memberId}
│       ├── uid, name, role, email, phone
│       ├── permissions: ["read:players", "write:medical"]
│       ├── active: boolean
│       └── availableStatus: "Disponível" | "Em campo" | "De folga"
├── players/{playerId}
│   ├── name, dob, position, status
│   └── observations: [{departmentId, text, date, authorUid}]
├── feed/{postId}
│   ├── authorUid, title, body, departmentId
│   └── visibility: {departments: [], roles: [], users: []}
└── requests/{requestId}
    ├── fromDept, toDept, message, status
    └── authorUid, createdAt
```

### Estrutura de Permissões (Custom Claims)

```javascript
{
  role: ["Presidente", "Treinador Principal"],
  departments: ["Direção", "Equipa Técnica"]
}
```

## 🔐 Sistema de Segurança (RBAC)

### Níveis de Acesso

1. **Direção/Presidente**: Acesso total a todos os departamentos
2. **Chefe de Departamento**: Acesso completo ao próprio departamento
3. **Membro**: Acesso limitado baseado em permissões específicas

### Regras Principais

- Utilizadores só acedem aos departamentos onde estão registados
- Feed com controlo de visibilidade por departamentos/roles/utilizadores
- Jogadores visíveis apenas para departamentos técnicos e clínicos
- Requisições visíveis para departamentos de origem e destino

## 🚀 Cloud Functions

### Funções Disponíveis

1. **createDepartment**: Criar departamento com estrutura inicial
2. **addMemberToDepartment**: Adicionar membro e atualizar custom claims
3. **updateAvailability**: Atualizar estado de disponibilidade
4. **sendDepartmentRequest**: Criar requisição e enviar notificação

### Deploy das Functions

```bash
# Instalar dependências das functions
cd functions
npm install

# Deploy das functions
firebase deploy --only functions
```

## 📱 Funcionalidades Principais

### 🏢 Organograma
- Visualização de todos os departamentos
- Estatísticas de membros por estado
- Contactos e responsáveis de cada departamento

### 👥 Gestão de Departamento
- Lista de membros com estados de disponibilidade
- Permissões e roles individuais
- Feed interno do departamento
- Sistema de requisições

### ⚽ Gestão de Jogadores
- Plantel completo com posições e idades
- Estados clínicos (Apto/Lesionado/Dúvida)
- Observações de diferentes departamentos
- Filtros por posição e estado

### 📋 Sistema de Requisições
- Pedidos entre departamentos
- Estados (Pendente/Concluído)
- Notificações automáticas por email
- Histórico de requisições

### 📰 Feed Global
- Comunicação entre departamentos
- Controlo de visibilidade granular
- Filtragem por departamento
- Posts com metadados completos

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build

# Iniciar aplicação (produção)
yarn start

# Executar seed data
node scripts/seed-data.js

# Firebase emulators
firebase emulators:start

# Deploy completo
firebase deploy
```

## 📧 Configuração de Email (Opcional)

Para ativar notificações por email, configurar SendGrid:

1. Criar conta em [SendGrid](https://sendgrid.com/)
2. Gerar API Key
3. Configurar environment variable:
   ```bash
   firebase functions:config:set sendgrid.key="SUA_API_KEY"
   ```

## 🚀 Deploy para Produção

### 1. Build da Aplicação

```bash
yarn build
```

### 2. Deploy Firebase

```bash
# Deploy completo (functions, firestore, hosting)
firebase deploy

# Deploy específico
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

### 3. Configurar Domínio (Opcional)

1. Firebase Console → Hosting → "Add custom domain"
2. Seguir instruções para configurar DNS

## 🧪 Testes

### Contas de Teste

Após executar o seed script:

- **Email**: joao.silva@futperformclub.pt
- **Password**: password123
- **Role**: Presidente (acesso total)

### Dados de Demonstração

O script de seed cria:
- 5 departamentos completos
- 10 utilizadores com roles diferentes
- 4 jogadores com observações
- Posts de feed exemplo
- Requisições de teste

## 🐛 Resolução de Problemas

### Firebase Connection Issues
```bash
# Verificar configuração
firebase projects:list
firebase use SEU_PROJECT_ID

# Testar regras
firebase firestore:rules
```

### Authentication Problems
```bash
# Verificar providers no Firebase Console
# Authentication → Sign-in method → Ativar Email/Password e Google
```

### Build Errors
```bash
# Limpar cache
yarn cache clean
rm -rf node_modules
yarn install
```

## 📚 Documentação Adicional

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions](https://firebase.google.com/docs/functions)

## 🤝 Contribuição

1. Fork do repositório
2. Criar feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit das alterações (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Criar Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para detalhes.

---

**FutPerform Club Manager** - Sistema completo de gestão de clubes de futebol 🏆

Para suporte técnico ou dúvidas, contacte: suporte@futperform.pt
