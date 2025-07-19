import { api, ApiResponse } from './api';

export interface BackendChat {
  _id: string;
  participants: string[];
  messages: BackendMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendMessage {
  _id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface CreateChatData {
  userId1: string;
  userId2: string;
}

export interface SendMessageData {
  chatId: string;
  senderId: string;
  content: string;
}

class ChatService {
  async createOrGetChat(chatData: CreateChatData): Promise<ApiResponse<BackendChat>> {
    return api.post<BackendChat>('/chat', chatData);
  }

  async sendMessage(messageData: SendMessageData): Promise<ApiResponse<BackendMessage>> {
    return api.post<BackendMessage>('/chat/message', messageData);
  }

  async getUserChats(userId: string): Promise<ApiResponse<BackendChat[]>> {
    return api.get<BackendChat[]>(`/chat/chats/${userId}`);
  }
}

export const chatService = new ChatService();
