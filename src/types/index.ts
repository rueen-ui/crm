export type Role = 'manager' | 'executor';

export type TaskStatus = 'new' | 'in_progress' | 'review' | 'accepted' | 'rework';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface ConstructionObject {
  id: number;
  name: string;
  address: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  objectId: number;
  executorId: string | null; 
  status: TaskStatus;
  authorId: string;
  createdAt: string;
}

