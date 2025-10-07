
// Script para popular a base de dados com dados de demonstração
// Execute: node scripts/seed-data.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Configurar Firebase Admin (necessário service account key)
// const serviceAccount = require('./path/to/service-account-key.json');

// initializeApp({
//   credential: cert(serviceAccount)
// });

// Para development, usar emulador
process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';

initializeApp({ projectId: 'demo-project' });

const db = getFirestore();
const auth = getAuth();

const CLUB_ID = 'demo-club';

const seedData = {
  departments: [
    {
      id: 'direcao',
      name: 'Direção',
      description: 'Gestão executiva e estratégica do clube',
      head: 'João Silva',
      roles: ['Presidente', 'Vice-Presidente', 'Diretor Executivo'],
      contacts_public: {
        email: 'direcao@futperformclub.pt',
        phone: '+351 210 123 456'
      },
      members: [
        {
          uid: 'user_joao_silva',
          name: 'João Silva',
          role: 'Presidente',
          email: 'joao.silva@futperformclub.pt',
          phone: '+351 912 123 456',
          permissions: ['read:all', 'write:all'],
          active: true,
          availableStatus: 'Disponível'
        },
        {
          uid: 'user_maria_santos',
          name: 'Maria Santos',
          role: 'Vice-Presidente',
          email: 'maria.santos@futperformclub.pt',
          phone: '+351 912 123 457',
          permissions: ['read:all', 'write:departments'],
          active: true,
          availableStatus: 'Disponível'
        }
      ]
    },
    {
      id: 'equipa-tecnica',
      name: 'Equipa Técnica',
      description: 'Treinadores, adjuntos e staff técnico',
      head: 'Carlos Santos',
      roles: ['Treinador Principal', 'Treinador Adjunto', 'Preparador Físico'],
      contacts_public: {
        email: 'tecnica@futperformclub.pt',
        phone: '+351 210 123 457'
      },
      members: [
        {
          uid: 'user_carlos_santos',
          name: 'Carlos Santos',
          role: 'Treinador Principal',
          email: 'carlos.santos@futperformclub.pt',
          phone: '+351 912 123 458',
          permissions: ['read:players', 'write:players', 'read:training'],
          active: true,
          availableStatus: 'Em campo'
        },
        {
          uid: 'user_ana_ferreira',
          name: 'Ana Ferreira',
          role: 'Treinadora Adjunta',
          email: 'ana.ferreira@futperformclub.pt',
          phone: '+351 912 123 459',
          permissions: ['read:players', 'read:training'],
          active: true,
          availableStatus: 'Disponível'
        }
      ]
    },
    {
      id: 'clinico',
      name: 'Clínico',
      description: 'Departamento médico, fisioterapia e reabilitação',
      head: 'Dra. Ana Costa',
      roles: ['Médico', 'Fisioterapeuta', 'Massagista'],
      contacts_public: {
        email: 'clinico@futperformclub.pt',
        phone: '+351 210 123 458'
      },
      members: [
        {
          uid: 'user_ana_costa',
          name: 'Dra. Ana Costa',
          role: 'Médica',
          email: 'ana.costa@futperformclub.pt',
          phone: '+351 912 123 460',
          permissions: ['read:players', 'write:medical'],
          active: true,
          availableStatus: 'Disponível'
        },
        {
          uid: 'user_pedro_silva',
          name: 'Pedro Silva',
          role: 'Fisioterapeuta',
          email: 'pedro.silva@futperformclub.pt',
          phone: '+351 912 123 461',
          permissions: ['read:players', 'write:physiotherapy'],
          active: true,
          availableStatus: 'De folga'
        }
      ]
    },
    {
      id: 'nutricao',
      name: 'Nutrição',
      description: 'Nutricionistas e planeamento alimentar',
      head: 'Dr. Pedro Lopes',
      roles: ['Nutricionista', 'Dietista'],
      contacts_public: {
        email: 'nutricao@futperformclub.pt',
        phone: '+351 210 123 459'
      },
      members: [
        {
          uid: 'user_pedro_lopes',
          name: 'Dr. Pedro Lopes',
          role: 'Nutricionista',
          email: 'pedro.lopes@futperformclub.pt',
          phone: '+351 912 123 462',
          permissions: ['read:players', 'write:nutrition'],
          active: true,
          availableStatus: 'Disponível'
        },
        {
          uid: 'user_sofia_rocha',
          name: 'Sofia Rocha',
          role: 'Dietista',
          email: 'sofia.rocha@futperformclub.pt',
          phone: '+351 912 123 463',
          permissions: ['read:nutrition'],
          active: true,
          availableStatus: 'Disponível'
        }
      ]
    },
    {
      id: 'logistica',
      name: 'Logística',
      description: 'Equipamentos, transporte e apoio logístico',
      head: 'Maria Ferreira',
      roles: ['Roupeiro', 'Motorista', 'Segurança'],
      contacts_public: {
        email: 'logistica@futperformclub.pt',
        phone: '+351 210 123 460'
      },
      members: [
        {
          uid: 'user_maria_ferreira',
          name: 'Maria Ferreira',
          role: 'Responsável Logística',
          email: 'maria.ferreira@futperformclub.pt',
          phone: '+351 912 123 464',
          permissions: ['read:equipment', 'write:equipment'],
          active: true,
          availableStatus: 'Disponível'
        },
        {
          uid: 'user_antonio_silva',
          name: 'António Silva',
          role: 'Roupeiro',
          email: 'antonio.silva@futperformclub.pt',
          phone: '+351 912 123 465',
          permissions: ['read:equipment'],
          active: true,
          availableStatus: 'Em campo'
        }
      ]
    }
  ],

  players: [
    {
      id: 'player_joao_gomes',
      name: 'João Gomes',
      dob: '1995-03-15',
      position: 'Guarda-Redes',
      status: 'Apto',
      observations: [
        {
          departmentId: 'clinico',
          text: 'Exames médicos em dia. Nenhuma lesão reportada.',
          date: new Date('2024-01-10'),
          authorUid: 'user_ana_costa'
        }
      ]
    },
    {
      id: 'player_pedro_santos',
      name: 'Pedro Santos',
      dob: '1998-07-22',
      position: 'Defesa Central',
      status: 'Lesionado',
      observations: [
        {
          departmentId: 'clinico',
          text: 'Lesão ligamentar no joelho direito. Repouso por 3 semanas.',
          date: new Date('2024-01-15'),
          authorUid: 'user_ana_costa'
        },
        {
          departmentId: 'equipa-tecnica',
          text: 'Jogador muito promissor, liderança natural.',
          date: new Date('2024-01-05'),
          authorUid: 'user_carlos_santos'
        }
      ]
    },
    {
      id: 'player_carlos_rodrigues',
      name: 'Carlos Rodrigues',
      dob: '1996-11-08',
      position: 'Médio',
      status: 'Apto',
      observations: [
        {
          departmentId: 'nutricao',
          text: 'Dieta adequada às necessidades. Controlo mensal.',
          date: new Date('2024-01-12'),
          authorUid: 'user_pedro_lopes'
        }
      ]
    },
    {
      id: 'player_miguel_costa',
      name: 'Miguel Costa',
      dob: '1999-05-30',
      position: 'Extremo',
      status: 'Apto',
      observations: [
        {
          departmentId: 'equipa-tecnica',
          text: 'Velocidade excelente, precisa melhorar finalização.',
          date: new Date('2024-01-08'),
          authorUid: 'user_carlos_santos'
        }
      ]
    }
  ],

  feedPosts: [
    {
      id: 'post_1',
      authorUid: 'user_carlos_santos',
      title: 'Treino de amanhã cancelado',
      body: 'Devido às condições meteorológicas adversas, o treino de amanhã às 15h00 foi cancelado. Reagendaremos para sexta-feira.',
      departmentId: 'equipa-tecnica',
      visibility: {
        departments: ['equipa-tecnica', 'direcao'],
        roles: [],
        users: []
      }
    },
    {
      id: 'post_2',
      authorUid: 'user_ana_costa',
      title: 'Relatório Médico Semanal',
      body: 'Esta semana registámos 2 lesões ligeiras e 3 jogadores em processo de recuperação.',
      departmentId: 'clinico',
      visibility: {
        departments: ['clinico', 'equipa-tecnica', 'direcao'],
        roles: [],
        users: []
      }
    }
  ],

  requests: [
    {
      id: 'req_1',
      fromDept: 'equipa-tecnica',
      toDept: 'logistica',
      message: 'Precisamos de mais cones de treino para a sessão de amanhã. Podem disponibilizar 20 cones?',
      status: 'pendente',
      authorUid: 'user_carlos_santos'
    },
    {
      id: 'req_2',
      fromDept: 'clinico',
      toDept: 'direcao',
      message: 'Solicitamos aprovação para compra de equipamento de fisioterapia no valor de €2.500.',
      status: 'feito',
      authorUid: 'user_ana_costa'
    }
  ]
};

async function createTestUsers() {
  console.log('🔧 A criar utilizadores de teste...');
  
  const users = [
    { uid: 'user_joao_silva', email: 'joao.silva@futperformclub.pt', name: 'João Silva' },
    { uid: 'user_maria_santos', email: 'maria.santos@futperformclub.pt', name: 'Maria Santos' },
    { uid: 'user_carlos_santos', email: 'carlos.santos@futperformclub.pt', name: 'Carlos Santos' },
    { uid: 'user_ana_ferreira', email: 'ana.ferreira@futperformclub.pt', name: 'Ana Ferreira' },
    { uid: 'user_ana_costa', email: 'ana.costa@futperformclub.pt', name: 'Dra. Ana Costa' },
    { uid: 'user_pedro_silva', email: 'pedro.silva@futperformclub.pt', name: 'Pedro Silva' },
    { uid: 'user_pedro_lopes', email: 'pedro.lopes@futperformclub.pt', name: 'Dr. Pedro Lopes' },
    { uid: 'user_sofia_rocha', email: 'sofia.rocha@futperformclub.pt', name: 'Sofia Rocha' },
    { uid: 'user_maria_ferreira', email: 'maria.ferreira@futperformclub.pt', name: 'Maria Ferreira' },
    { uid: 'user_antonio_silva', email: 'antonio.silva@futperformclub.pt', name: 'António Silva' }
  ];

  for (const user of users) {
    try {
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        displayName: user.name,
        password: 'password123'
      });
      console.log(`✅ Utilizador criado: ${user.name}`);
    } catch (error) {
      if (error.code !== 'auth/uid-already-exists') {
        console.error(`❌ Erro ao criar utilizador ${user.name}:`, error);
      }
    }
  }
}

async function seedDepartments() {
  console.log('🏢 A criar departamentos...');
  
  for (const dept of seedData.departments) {
    const { members, ...departmentData } = dept;
    
    // Criar departamento
    await db.collection(`clubs/${CLUB_ID}/departments`).doc(dept.id).set({
      ...departmentData,
      createdAt: new Date(),
      createdBy: 'system'
    });
    
    // Criar membros do departamento
    for (const member of members) {
      await db.collection(`clubs/${CLUB_ID}/departments/${dept.id}/members`).doc(member.uid).set({
        ...member,
        joinedAt: new Date(),
        lastLogin: new Date()
      });
    }
    
    console.log(`✅ Departamento criado: ${dept.name} (${members.length} membros)`);
  }
}

async function seedPlayers() {
  console.log('⚽ A criar jogadores...');
  
  for (const player of seedData.players) {
    await db.collection(`clubs/${CLUB_ID}/players`).doc(player.id).set({
      ...player,
      createdAt: new Date()
    });
    console.log(`✅ Jogador criado: ${player.name}`);
  }
}

async function seedFeedPosts() {
  console.log('📰 A criar posts do feed...');
  
  for (const post of seedData.feedPosts) {
    await db.collection(`clubs/${CLUB_ID}/feed`).doc(post.id).set({
      ...post,
      createdAt: new Date()
    });
    console.log(`✅ Post criado: ${post.title}`);
  }
}

async function seedRequests() {
  console.log('📋 A criar requisições...');
  
  for (const request of seedData.requests) {
    await db.collection(`clubs/${CLUB_ID}/requests`).doc(request.id).set({
      ...request,
      createdAt: new Date()
    });
    console.log(`✅ Requisição criada: ${request.fromDept} → ${request.toDept}`);
  }
}

async function main() {
  try {
    console.log('🚀 A iniciar seed da base de dados...\n');
    
    // await createTestUsers();
    await seedDepartments();
    await seedPlayers();
    await seedFeedPosts();
    await seedRequests();
    
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('ℹ️  Para testar a aplicação, use:');
    console.log('   Email: joao.silva@futperformclub.pt');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
