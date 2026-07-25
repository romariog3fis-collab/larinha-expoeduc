export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export interface ScheduleEvent {
  time: string;
  title: string;
  desc: string;
  border: string;
  text: string;
}

export type UserRole = 'Professor' | 'Coordenador' | 'Diretor' | 'Gestor' | 'Outro';

export interface UserProfile {
  id: string;
  name: string;
  school: string;
  city: string;
  role: UserRole;
  contact: string;
  email?: string;
  registeredAt: string;
}
