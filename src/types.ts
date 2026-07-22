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
