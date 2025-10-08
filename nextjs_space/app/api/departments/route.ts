
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
    
    // Buscar departamentos do Firestore usando Admin SDK
    const departmentsRef = adminDb.collection(`clubs/${clubId}/departments`);
    const snapshot = await departmentsRef.orderBy('createdAt', 'desc').get();
    
    const departments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json({ success: true, data: departments });
  } catch (error: any) {
    console.error('Erro ao buscar departamentos:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao buscar departamentos' 
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
    const { clubId = 'default-club', name, description, head, roles, contacts_public } = body;
    
    if (!name || !description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nome e descrição são obrigatórios' 
      }, { status: 400 });
    }

    // Adicionar departamento ao Firestore usando Admin SDK
    const departmentsRef = adminDb.collection(`clubs/${clubId}/departments`);
    const newDept = {
      name,
      description,
      head: head || '',
      roles: roles || [],
      contacts_public: contacts_public || { email: '', phone: '' },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await departmentsRef.add(newDept);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Departamento criado com sucesso',
      departmentId: docRef.id,
      data: { id: docRef.id, ...newDept, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  } catch (error: any) {
    console.error('Erro ao criar departamento:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro ao criar departamento' 
    }, { status: 500 });
  }
}
