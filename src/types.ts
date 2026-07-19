export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  parts: [{ text: string }];
}
