
# Configuração do Backend Firebase

## Estado Atual

✅ **Frontend conectado ao Firebase Firestore**
✅ **APIs REST funcionando com Firebase Admin SDK**
✅ **Regras de segurança do Firestore implementadas**
✅ **Cloud Functions deployadas**

## O que foi implementado

### 1. APIs REST para Backend

As seguintes rotas de API foram criadas e estão conectadas ao Firebase Firestore:

- **GET `/api/departments`** - Buscar departamentos do clube
- **POST `/api/departments`** - Criar novo departamento
- **GET `/api/members`** - Buscar membros da equipa
- **POST `/api/members`** - Adicionar novo membro

### 2. Firebase Admin SDK

Foi implementado o Firebase Admin SDK (`lib/firebase-admin.ts`) para permitir que as rotas de API acessem o Firestore com privilégios administrativos, contornando as regras de segurança.

### 3. Componentes Frontend

Os seguintes componentes foram atualizados:

- **Organograma** (`components/pages/organograma.tsx`):
  - ✅ Busca departamentos do Firebase
  - ✅ Dialog funcional para criar novos departamentos
  - ✅ Integração completa com a API

- **Departamento** (`components/pages/departamento.tsx`):
  - ✅ Busca membros do Firebase
  - ✅ Dialog funcional para adicionar novos membros
  - ✅ Integração completa com a API

## Como usar

### 1. Criar Departamentos

1. Acesse a página **Organograma** no dashboard
2. Clique no botão **"Novo Departamento"**
3. Preencha os dados:
   - Nome (obrigatório)
   - Descrição (obrigatório)
   - Responsável
   - Email de contato
   - Telefone de contato
   - Funções (separadas por vírgula)
4. Clique em **"Criar Departamento"**

Os dados serão salvos no Firestore em: `clubs/default-club/departments/{id}`

### 2. Adicionar Membros

1. Acesse a página **Equipa Técnica** no dashboard
2. Clique no botão **"Adicionar Membro"**
3. Preencha os dados:
   - Nome Completo (obrigatório)
   - Email (obrigatório)
   - Telefone
   - Função
   - Estado de Disponibilidade
4. Clique em **"Adicionar Membro"**

Os dados serão salvos no Firestore em: `clubs/default-club/members/{id}`

## Configuração para Produção (Vercel)

### Opção 1: Usar Firebase Admin sem Service Account (Recomendado para desenvolvimento)

A configuração atual funciona sem credenciais adicionais em desenvolvimento. Para produção na Vercel:

1. O Firebase Admin SDK será inicializado com o `projectId` padrão
2. **Limitação**: Algumas funcionalidades avançadas podem não funcionar sem credenciais completas

### Opção 2: Configurar Service Account (Recomendado para produção)

Para acesso completo ao Firebase Admin em produção:

#### 1. Gerar Service Account Key

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto: **futperform-club-manager**
3. Clique no ícone de engrenagem ⚙️ > **Project Settings**
4. Vá para a aba **Service Accounts**
5. Clique em **"Generate New Private Key"**
6. Salve o arquivo JSON (NÃO commite este arquivo no Git!)

#### 2. Configurar no Vercel

1. Acesse o dashboard do Vercel
2. Selecione o projeto
3. Vá para **Settings** > **Environment Variables**
4. Adicione a variável:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Cole o conteúdo completo do arquivo JSON (todo o JSON em uma linha)
   - **Environments**: Production, Preview, Development

#### 3. Atualizar Regras do Firestore (Opcional)

Se desejar permitir acesso público de leitura para desenvolvimento, atualize as regras:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Desenvolvimento: permitir leitura pública, escrita apenas autenticada
    match /clubs/{clubId}/departments/{document=**} {
      allow read: if true;  // Leitura pública temporária
      allow write: if request.auth != null;
    }
    
    match /clubs/{clubId}/members/{document=**} {
      allow read: if true;  // Leitura pública temporária
      allow write: if request.auth != null;
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas regras são apenas para desenvolvimento! Use as regras de produção com autenticação para segurança.

## Próximos Passos

### 1. Popular o Banco de Dados

Você pode adicionar dados manualmente através da interface ou usar o Firebase Console:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto **futperform-club-manager**
3. Vá para **Firestore Database**
4. Crie a coleção: `clubs/default-club/departments` e adicione documentos
5. Crie a coleção: `clubs/default-club/members` e adicione documentos

### 2. Testar Localmente

```bash
cd nextjs_space
yarn dev
```

Acesse `http://localhost:3000` e teste:
- Criar departamentos na página Organograma
- Adicionar membros na página Equipa Técnica

### 3. Deploy para Vercel

```bash
git add .
git commit -m "Backend conectado ao Firebase"
git push origin main
```

Depois configure no Vercel e faça deploy!

## Estrutura dos Dados

### Departamento
```json
{
  "name": "Equipa Técnica",
  "description": "Treinadores e staff técnico",
  "head": "Carlos Santos",
  "roles": ["Treinador Principal", "Treinador Adjunto", "Preparador Físico"],
  "contacts_public": {
    "email": "tecnica@clube.pt",
    "phone": "+351 123 456 790"
  },
  "createdAt": "2025-10-08T11:00:00.000Z",
  "updatedAt": "2025-10-08T11:00:00.000Z"
}
```

### Membro
```json
{
  "name": "João Silva",
  "email": "joao.silva@clube.pt",
  "phone": "+351 912 345 678",
  "role": "Treinador Principal",
  "departmentId": "dept-id",
  "photoURL": "",
  "permissions": ["read:players", "write:players"],
  "active": true,
  "availableStatus": "Disponível",
  "joinedAt": "2025-10-08T11:00:00.000Z",
  "lastLogin": null,
  "createdAt": "2025-10-08T11:00:00.000Z",
  "updatedAt": "2025-10-08T11:00:00.000Z"
}
```

## Troubleshooting

### Erro: "Firebase Admin não inicializado"

**Solução**: Verifique se a variável `NEXT_PUBLIC_FIREBASE_PROJECT_ID` está configurada ou adicione as credenciais do Service Account.

### Erro: "Missing or insufficient permissions"

**Solução 1**: Configure o Service Account Key no Vercel
**Solução 2**: Atualize as regras do Firestore para permitir acesso temporário

### Dados não aparecem

**Solução**: Verifique se o Firestore tem dados na coleção correta:
- `clubs/default-club/departments`
- `clubs/default-club/members`

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor: console do navegador e terminal
2. Verifique os logs do Firebase Console
3. Verifique se as regras de segurança estão corretas
