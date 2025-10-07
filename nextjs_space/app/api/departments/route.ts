
import { NextRequest, NextResponse } from 'next/server';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';
    
    // Em produção, usar Firestore real
    // const db = getFirestore();
    // const departmentsRef = collection(db, `clubs/${clubId}/departments`);
    // const snapshot = await getDocs(departmentsRef);
    
    // Por agora, retornar dados mockados
    const mockDepartments = [
      {
        id: '1',
        name: 'Direção',
        description: 'Gestão executiva do clube',
        head: 'João Silva',
        roles: ['Presidente', 'Vice-Presidente'],
        createdAt: new Date().toISOString(),
        contacts_public: {
          email: 'direcao@clube.pt',
          phone: '+351 123 456 789'
        }
      },
      {
        id: '2', 
        name: 'Equipa Técnica',
        description: 'Treinadores e staff técnico',
        head: 'Carlos Santos',
        roles: ['Treinador Principal', 'Treinador Adjunto', 'Preparador Físico'],
        createdAt: new Date().toISOString(),
        contacts_public: {
          email: 'tecnica@clube.pt',
          phone: '+351 123 456 790'
        }
      },
      {
        id: '3',
        name: 'Clínico',
        description: 'Departamento médico e fisioterapeutas',
        head: 'Dra. Ana Costa',
        roles: ['Médico', 'Fisioterapeuta', 'Massagista'],
        createdAt: new Date().toISOString(),
        contacts_public: {
          email: 'clinico@clube.pt',
          phone: '+351 123 456 791'
        }
      },
      {
        id: '4',
        name: 'Nutrição',
        description: 'Planeamento nutricional dos atletas',
        head: 'Dr. Pedro Alves',
        roles: ['Nutricionista'],
        createdAt: new Date().toISOString(),
        contacts_public: {
          email: 'nutricao@clube.pt',
          phone: '+351 123 456 792'
        }
      },
      {
        id: '5',
        name: 'Logística',
        description: 'Gestão de equipamentos e transportes',
        head: 'Miguel Sousa',
        roles: ['Responsável Logística', 'Roupeiro'],
        createdAt: new Date().toISOString(),
        contacts_public: {
          email: 'logistica@clube.pt',
          phone: '+351 123 456 793'
        }
      }
    ];

    return NextResponse.json({ success: true, data: mockDepartments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Chamar Cloud Function
    // const functions = getFunctions();
    // const createDept = httpsCallable(functions, 'createDepartment');
    // const result = await createDept(body);

    // Mockado para desenvolvimento
    return NextResponse.json({ 
      success: true, 
      message: 'Departamento criado com sucesso',
      departmentId: 'new-dept-' + Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
