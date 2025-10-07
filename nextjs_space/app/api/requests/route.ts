
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';
    const departmentId = request.nextUrl.searchParams.get('departmentId');

    // Dados mockados de requisições
    const mockRequests = [
      {
        id: '1',
        fromDept: '2',
        fromDeptName: 'Equipa Técnica',
        toDept: '5',
        toDeptName: 'Logística',
        title: 'Pedido de Material',
        message: 'Necessitamos de 20 cones e 10 coletes para o treino de amanhã.',
        status: 'pendente',
        authorUid: 'user1',
        authorName: 'Carlos Santos',
        createdAt: new Date('2024-01-14').toISOString(),
        updatedAt: new Date('2024-01-14').toISOString()
      },
      {
        id: '2',
        fromDept: '3',
        fromDeptName: 'Clínico',
        toDept: '2',
        toDeptName: 'Equipa Técnica',
        title: 'Atualização sobre Lesão',
        message: 'O jogador Bruno Alves está liberado para treino físico leve. Evitar contacto por mais 1 semana.',
        status: 'feito',
        authorUid: 'user3',
        authorName: 'Dr. António Silva',
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-11').toISOString()
      },
      {
        id: '3',
        fromDept: '4',
        fromDeptName: 'Nutrição',
        toDept: '5',
        toDeptName: 'Logística',
        title: 'Encomenda de Suplementos',
        message: 'Por favor encomendar os suplementos da lista anexada para a próxima semana.',
        status: 'pendente',
        authorUid: 'user6',
        authorName: 'Dr. Pedro Alves',
        createdAt: new Date('2024-01-13').toISOString(),
        updatedAt: new Date('2024-01-13').toISOString()
      }
    ];

    // Filtrar por departamento se fornecido
    const filteredRequests = departmentId
      ? mockRequests.filter(r => r.fromDept === departmentId || r.toDept === departmentId)
      : mockRequests;

    return NextResponse.json({ success: true, data: filteredRequests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Chamar Cloud Function sendDepartmentRequest
    return NextResponse.json({ 
      success: true, 
      message: 'Requisição enviada com sucesso',
      requestId: 'req-' + Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status } = body;
    
    // Chamar Cloud Function updateRequestStatus
    return NextResponse.json({ 
      success: true, 
      message: 'Status atualizado com sucesso'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
