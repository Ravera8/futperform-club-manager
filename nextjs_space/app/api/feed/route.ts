
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';
    const departmentId = request.nextUrl.searchParams.get('departmentId');

    // Dados mockados de posts do feed
    const mockFeed = [
      {
        id: '1',
        authorUid: 'user1',
        authorName: 'Carlos Santos',
        departmentId: '2',
        departmentName: 'Equipa Técnica',
        title: 'Treino de Hoje',
        body: 'Excelente treino hoje! A equipa mostrou grande dedicação e intensidade. Foco no jogo de sábado.',
        visibility: {
          departments: ['2'],
          roles: [],
          users: []
        },
        createdAt: new Date('2024-01-14T10:30:00').toISOString()
      },
      {
        id: '2',
        authorUid: 'user3',
        authorName: 'Dr. António Silva',
        departmentId: '3',
        departmentName: 'Clínico',
        title: 'Atualização Médica',
        body: 'Bruno Alves continua em recuperação. Evolução positiva. Previsão de retorno mantém-se para próxima semana.',
        visibility: {
          departments: ['2', '3'],
          roles: [],
          users: []
        },
        createdAt: new Date('2024-01-14T09:15:00').toISOString()
      },
      {
        id: '3',
        authorUid: 'user5',
        authorName: 'João Silva',
        departmentId: '1',
        departmentName: 'Direção',
        title: 'Comunicado Importante',
        body: 'Reunião geral de todos os departamentos amanhã às 14h no auditório. Presença obrigatória.',
        visibility: {
          departments: ['1', '2', '3', '4', '5'],
          roles: [],
          users: []
        },
        createdAt: new Date('2024-01-13T16:00:00').toISOString()
      },
      {
        id: '4',
        authorUid: 'user6',
        authorName: 'Dr. Pedro Alves',
        departmentId: '4',
        departmentName: 'Nutrição',
        title: 'Novo Plano Nutricional',
        body: 'Implementação do novo plano nutricional para atletas em recuperação. Disponível no sistema.',
        visibility: {
          departments: ['3', '4'],
          roles: [],
          users: []
        },
        createdAt: new Date('2024-01-12T11:00:00').toISOString()
      }
    ];

    // Filtrar por departamento se fornecido
    const filteredFeed = departmentId
      ? mockFeed.filter(post => 
          post.visibility.departments.includes(departmentId) || 
          post.departmentId === departmentId
        )
      : mockFeed;

    return NextResponse.json({ success: true, data: filteredFeed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Chamar Cloud Function createFeedPost
    return NextResponse.json({ 
      success: true, 
      message: 'Post criado com sucesso',
      postId: 'post-' + Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
