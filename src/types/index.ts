export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  isOnline: boolean;
  lastMessage?: string;
  unreadCount?: number;
  timestamp?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  image: string;
  msgType: 'text' | 'image';
  isSeen: boolean;
  timestamp: number;
}

export interface ChatSection {
  date: string;
  data: Message[];
}

export interface RootState {
  user: User | null;
  theme: {
    isDark: boolean;
  };
}
