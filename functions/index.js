
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

/**
 * Cloud Function: Criar novo departamento
 * 
 * @param {string} clubId - ID do clube
 * @param {string} name - Nome do departamento
 * @param {string} description - Descrição
 * @param {array} roles - Roles disponíveis
 * @param {object} contacts - Contactos públicos
 */
exports.createDepartment = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, name, description, roles, contacts } = data;

  // Validação
  if (!clubId || !name) {
    throw new functions.https.HttpsError('invalid-argument', 'clubId e name são obrigatórios');
  }

  try {
    const departmentRef = db.collection(`clubs/${clubId}/departments`).doc();
    
    await departmentRef.set({
      name,
      description: description || '',
      head: context.auth.uid,
      roles: roles || [],
      contacts_public: contacts || { email: '', phone: '' },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid
    });

    // Criar feed inicial do departamento
    await db.collection(`clubs/${clubId}/feed`).add({
      authorUid: context.auth.uid,
      authorName: context.auth.token.name || 'Sistema',
      title: `Departamento ${name} criado`,
      body: `O departamento ${name} foi criado com sucesso.`,
      departmentId: departmentRef.id,
      visibility: {
        departments: [departmentRef.id],
        roles: [],
        users: []
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      departmentId: departmentRef.id,
      message: 'Departamento criado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao criar departamento:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao criar departamento');
  }
});

/**
 * Cloud Function: Adicionar membro a departamento
 * 
 * @param {string} clubId - ID do clube
 * @param {string} departmentId - ID do departamento
 * @param {string} userId - UID do utilizador
 * @param {string} role - Role do membro
 * @param {array} permissions - Permissões específicas
 */
exports.addMemberToDepartment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, departmentId, userId, role, permissions, name, email, phone } = data;

  if (!clubId || !departmentId || !userId || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios em falta');
  }

  try {
    // Adicionar membro ao departamento
    const memberRef = db.collection(`clubs/${clubId}/departments/${departmentId}/members`).doc(userId);
    
    await memberRef.set({
      uid: userId,
      name: name || '',
      role,
      email: email || '',
      phone: phone || '',
      photoURL: '',
      permissions: permissions || [],
      active: true,
      availableStatus: 'Disponível',
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      joinedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Obter departamento info
    const deptDoc = await db.doc(`clubs/${clubId}/departments/${departmentId}`).get();
    const deptData = deptDoc.data();

    // Atualizar custom claims do utilizador
    const user = await auth.getUser(userId);
    const currentClaims = user.customClaims || {};
    
    const updatedDepartments = currentClaims.departments || [];
    if (!updatedDepartments.includes(deptData.name)) {
      updatedDepartments.push(deptData.name);
    }

    const updatedRoles = currentClaims.role || [];
    if (!updatedRoles.includes(role)) {
      updatedRoles.push(role);
    }

    await auth.setCustomUserClaims(userId, {
      ...currentClaims,
      departments: updatedDepartments,
      role: updatedRoles,
      clubId
    });

    // Criar post no feed
    await db.collection(`clubs/${clubId}/feed`).add({
      authorUid: context.auth.uid,
      authorName: context.auth.token.name || 'Sistema',
      title: 'Novo membro adicionado',
      body: `${name || 'Um novo membro'} foi adicionado ao departamento ${deptData.name} com o cargo de ${role}.`,
      departmentId,
      visibility: {
        departments: [departmentId],
        roles: [],
        users: []
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: 'Membro adicionado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao adicionar membro ao departamento');
  }
});

/**
 * Cloud Function: Atualizar disponibilidade do membro
 * 
 * @param {string} clubId - ID do clube
 * @param {string} departmentId - ID do departamento
 * @param {string} userId - UID do utilizador
 * @param {string} status - Novo status ("Disponível" | "Em campo" | "De folga")
 */
exports.updateAvailability = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, departmentId, userId, status } = data;

  const validStatuses = ['Disponível', 'Em campo', 'De folga'];
  if (!validStatuses.includes(status)) {
    throw new functions.https.HttpsError('invalid-argument', 'Status inválido');
  }

  try {
    const memberRef = db.doc(`clubs/${clubId}/departments/${departmentId}/members/${userId}`);
    
    await memberRef.update({
      availableStatus: status,
      lastUpdate: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: `Disponibilidade atualizada para: ${status}`
    };
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao atualizar disponibilidade');
  }
});

/**
 * Cloud Function: Enviar requisição entre departamentos
 * 
 * @param {string} clubId - ID do clube
 * @param {string} fromDept - ID do departamento de origem
 * @param {string} toDept - ID do departamento de destino
 * @param {string} message - Mensagem da requisição
 */
exports.sendDepartmentRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, fromDept, toDept, message, title } = data;

  if (!clubId || !fromDept || !toDept || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios em falta');
  }

  try {
    // Obter informações dos departamentos
    const fromDeptDoc = await db.doc(`clubs/${clubId}/departments/${fromDept}`).get();
    const toDeptDoc = await db.doc(`clubs/${clubId}/departments/${toDept}`).get();

    if (!fromDeptDoc.exists || !toDeptDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Departamento não encontrado');
    }

    const fromDeptData = fromDeptDoc.data();
    const toDeptData = toDeptDoc.data();

    // Criar requisição
    const requestRef = await db.collection(`clubs/${clubId}/requests`).add({
      fromDept,
      fromDeptName: fromDeptData.name,
      toDept,
      toDeptName: toDeptData.name,
      title: title || 'Nova Requisição',
      message,
      status: 'pendente',
      authorUid: context.auth.uid,
      authorName: context.auth.token.name || 'Utilizador',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Criar notificação no feed do departamento de destino
    await db.collection(`clubs/${clubId}/feed`).add({
      authorUid: context.auth.uid,
      authorName: context.auth.token.name || 'Sistema',
      title: `Nova requisição de ${fromDeptData.name}`,
      body: message,
      departmentId: toDept,
      requestId: requestRef.id,
      visibility: {
        departments: [toDept],
        roles: [],
        users: []
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // TODO: Enviar notificação por email aos membros do departamento de destino
    // Isso requer configuração de SendGrid ou outro serviço de email

    return {
      success: true,
      requestId: requestRef.id,
      message: 'Requisição enviada com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar requisição:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao enviar requisição');
  }
});

/**
 * Cloud Function: Atualizar status da requisição
 */
exports.updateRequestStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, requestId, status } = data;

  const validStatuses = ['pendente', 'feito', 'cancelado'];
  if (!validStatuses.includes(status)) {
    throw new functions.https.HttpsError('invalid-argument', 'Status inválido');
  }

  try {
    await db.doc(`clubs/${clubId}/requests/${requestId}`).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid
    });

    return {
      success: true,
      message: 'Status atualizado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao atualizar status');
  }
});

/**
 * Cloud Function: Criar post no feed
 */
exports.createFeedPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, departmentId, title, body, visibility } = data;

  if (!clubId || !title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios em falta');
  }

  try {
    await db.collection(`clubs/${clubId}/feed`).add({
      authorUid: context.auth.uid,
      authorName: context.auth.token.name || 'Utilizador',
      departmentId: departmentId || null,
      title,
      body,
      visibility: visibility || {
        departments: [],
        roles: [],
        users: []
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: 'Post criado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao criar post');
  }
});

/**
 * Cloud Function: Adicionar jogador
 */
exports.addPlayer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, name, dob, position, number, status } = data;

  if (!clubId || !name || !position) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios em falta');
  }

  try {
    const playerRef = await db.collection(`clubs/${clubId}/players`).add({
      name,
      dob: dob || null,
      position,
      number: number || null,
      status: status || 'Apto',
      photoURL: '',
      observations: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid
    });

    return {
      success: true,
      playerId: playerRef.id,
      message: 'Jogador adicionado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao adicionar jogador');
  }
});

/**
 * Cloud Function: Adicionar observação a jogador
 */
exports.addPlayerObservation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilizador não autenticado');
  }

  const { clubId, playerId, departmentId, text } = data;

  if (!clubId || !playerId || !departmentId || !text) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetros obrigatórios em falta');
  }

  try {
    const playerRef = db.doc(`clubs/${clubId}/players/${playerId}`);
    
    await playerRef.update({
      observations: admin.firestore.FieldValue.arrayUnion({
        departmentId,
        text,
        date: admin.firestore.Timestamp.now(),
        authorUid: context.auth.uid,
        authorName: context.auth.token.name || 'Utilizador'
      })
    });

    return {
      success: true,
      message: 'Observação adicionada com sucesso'
    };
  } catch (error) {
    console.error('Erro ao adicionar observação:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao adicionar observação');
  }
});
