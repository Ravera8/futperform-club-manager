
export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  roles: string[];
  createdAt: any;
  contacts_public: {
    email: string;
    phone: string;
  };
}

export interface Member {
  id: string;
  uid: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  photoURL?: string;
  permissions: string[];
  active: boolean;
  availableStatus: 'Disponível' | 'Em campo' | 'De folga';
  lastLogin?: any;
  joinedAt?: any;
}

export interface Player {
  id: string;
  name: string;
  dob: string;
  position: string;
  status: string;
  photoURL?: string;
  observations: Array<{
    departmentId: string;
    text: string;
    date: any;
    authorUid: string;
  }>;
}

export interface FeedPost {
  id: string;
  authorUid: string;
  title: string;
  body: string;
  departmentId: string;
  createdAt: any;
  visibility: {
    departments: string[];
    roles: string[];
    users: string[];
  };
}

export interface Request {
  id: string;
  fromDept: string;
  toDept: string;
  message: string;
  status: 'pendente' | 'feito';
  authorUid: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  departments: string[];
  roles: string[];
}
