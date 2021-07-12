export interface User {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  note: string;
}

export type Note = { userId: string; text: string };
