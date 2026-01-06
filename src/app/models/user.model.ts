export type UserRole = 'user' | 'ministry' | 'Admin' | 'master';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  ministryId?: string; 
  ministryName?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin: string;
}

export interface MinistryData {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
}
