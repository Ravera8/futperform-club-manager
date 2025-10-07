
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';

    // Dados mockados de jogadores
    const mockPlayers = [
      {
        id: '1',
        name: 'Ricardo Martins',
        dob: '1998-05-15',
        position: 'Guarda-Redes',
        number: 1,
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: '3',
            text: 'Recuperação total da lesão no ombro. Liberado para treino completo.',
            date: new Date('2024-01-15').toISOString(),
            authorUid: 'user3',
            authorName: 'Dr. António Silva'
          }
        ]
      },
      {
        id: '2',
        name: 'Bruno Alves',
        dob: '1995-03-22',
        position: 'Defesa Central',
        number: 4,
        status: 'Lesionado',
        photoURL: '',
        observations: [
          {
            departmentId: '3',
            text: 'Lesão muscular na coxa direita. Previsão de retorno: 2 semanas.',
            date: new Date('2024-01-10').toISOString(),
            authorUid: 'user3',
            authorName: 'Dr. António Silva'
          },
          {
            departmentId: '4',
            text: 'Plano nutricional ajustado para recuperação muscular.',
            date: new Date('2024-01-11').toISOString(),
            authorUid: 'user6',
            authorName: 'Dr. Pedro Alves'
          }
        ]
      },
      {
        id: '3',
        name: 'André Silva',
        dob: '1997-08-10',
        position: 'Médio',
        number: 8,
        status: 'Apto',
        photoURL: '',
        observations: [
          {
            departmentId: '2',
            text: 'Excelente desempenho no último treino tático.',
            date: new Date('2024-01-14').toISOString(),
            authorUid: 'user1',
            authorName: 'Carlos Santos'
          }
        ]
      },
      {
        id: '4',
        name: 'Pedro Costa',
        dob: '1999-11-30',
        position: 'Avançado',
        number: 9,
        status: 'Dúvida',
        photoURL: '',
        observations: [
          {
            departmentId: '3',
            text: 'Ligeiro desconforto no tornozelo. Monitorizar evolução.',
            date: new Date('2024-01-13').toISOString(),
            authorUid: 'user4',
            authorName: 'Paula Costa'
          }
        ]
      }
    ];

    return NextResponse.json({ success: true, data: mockPlayers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Chamar Cloud Function addPlayer
    return NextResponse.json({ 
      success: true, 
      message: 'Jogador adicionado com sucesso',
      playerId: 'player-' + Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
