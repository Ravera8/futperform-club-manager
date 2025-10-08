
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ 
        success: false, 
        error: 'Firebase Admin não inicializado' 
      }, { status: 500 });
    }

    const clubId = request.nextUrl.searchParams.get('clubId') || 'default-club';
    const departmentId = request.nextUrl.searchParams.get('departmentId');

    // Buscar membros do Firestore usando Admin SDK
    const membersRef = adminDb.collection(`clubs/${clubId}/members`);
    let query = membersRef.orderBy('joinedAt', 'desc');
    
    // Filtrar por departamento se fornecido
    if (departmentId) {
      query = membersRef.where('departmentId', '==', departmentId).orderBy('joinedAt', 'desc');
    }
    
    const snapshot = await query.get();
    
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joinedAt: doc.data().joinedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() || null
    }));

    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    console.error('Erro ao buscar membros:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao buscar membros' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ 
        success: false, 
        error: 'Firebase Admin não inicializado' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { 
      clubId = 'default-club', 
      name, 
      email, 
      phone, 
      role, 
      departmentId,
      permissions = [],
      availableStatus = 'Disponível'
    } = body;
    
    if (!name || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nome e email são obrigatórios' 
      }, { status: 400 });
    }

    // Adicionar membro ao Firestore usando Admin SDK
    const membersRef = adminDb.collection(`clubs/${clubId}/members`);
    const newMember = {
      name,
      email,
      phone: phone || '',
      role: role || '',
      departmentId: departmentId || '',
      photoURL: '',
      permissions: permissions,
      active: true,
      availableStatus,
      joinedAt: FieldValue.serverTimestamp(),
      lastLogin: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await membersRef.add(newMember);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Membro adicionado com sucesso',
      memberId: docRef.id,
      data: { id: docRef.id, ...newMember, joinedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  } catch (error: any) {
    console.error('Erro ao adicionar membro:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao adicionar membro' 
    }, { status: 500 });
  }
}
