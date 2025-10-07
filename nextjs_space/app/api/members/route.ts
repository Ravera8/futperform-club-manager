
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';
    const departmentId = request.nextUrl.searchParams.get('departmentId');

    // Dados mockados de membros
    const mockMembers = [
      {
        id: '1',
        uid: 'user1',
        name: 'Carlos Santos',
        role: 'Treinador Principal',
        email: 'carlos.santos@clube.pt',
        phone: '+351 912 345 678',
        photoURL: '',
        permissions: ['read:players', 'write:players', 'read:training'],
        active: true,
        availableStatus: 'Disponível',
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        departmentId: '2'
      },
      {
        id: '2', 
        uid: 'user2',
        name: 'Ana Ferreira',
        role: 'Treinadora Adjunta',
        email: 'ana.ferreira@clube.pt',
        phone: '+351 912 345 679',
        photoURL: '',
        permissions: ['read:players', 'read:training'],
        active: true,
        availableStatus: 'Em campo',
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        departmentId: '2'
      },
      {
        id: '3',
        uid: 'user3',
        name: 'Dr. António Silva',
        role: 'Médico',
        email: 'antonio.silva@clube.pt',
        phone: '+351 912 345 680',
        photoURL: '',
        permissions: ['read:players', 'write:injuries', 'read:medical'],
        active: true,
        availableStatus: 'Disponível',
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        departmentId: '3'
      },
      {
        id: '4',
        uid: 'user4',
        name: 'Paula Costa',
        role: 'Fisioterapeuta',
        email: 'paula.costa@clube.pt',
        phone: '+351 912 345 681',
        photoURL: '',
        permissions: ['read:players', 'write:recovery'],
        active: true,
        availableStatus: 'De folga',
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        departmentId: '3'
      },
      {
        id: '5',
        uid: 'user5',
        name: 'João Silva',
        role: 'Presidente',
        email: 'joao.silva@clube.pt',
        phone: '+351 912 345 682',
        photoURL: '',
        permissions: ['*'],
        active: true,
        availableStatus: 'Disponível',
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        departmentId: '1'
      }
    ];

    // Filtrar por departamento se fornecido
    const filteredMembers = departmentId 
      ? mockMembers.filter(m => m.departmentId === departmentId)
      : mockMembers;

    return NextResponse.json({ success: true, data: filteredMembers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Chamar Cloud Function addMemberToDepartment
    return NextResponse.json({ 
      success: true, 
      message: 'Membro adicionado com sucesso'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
