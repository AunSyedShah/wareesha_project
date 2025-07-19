import { api, ApiResponse } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'attendee' | 'organizer' | 'exhibitor';
}

export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: 'attendee' | 'organizer' | 'exhibitor';
  password?: string; // Only returned in some cases
  __v?: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'attendee' | 'organizer' | 'exhibitor';
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<BackendUser>> {
    return api.post<BackendUser>('/user/login', credentials);
  }

  async register(userData: RegisterData): Promise<ApiResponse<BackendUser>> {
    return api.post<BackendUser>('/user/signup', userData);
  }

  async getUser(id: string): Promise<ApiResponse<BackendUser>> {
    return api.get<BackendUser>(`/user/${id}`);
  }

  async getAllUsers(): Promise<ApiResponse<BackendUser[]>> {
    return api.get<BackendUser[]>('/user');
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<BackendUser>> {
    return api.put<BackendUser>(`/user/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<BackendUser>> {
    return api.delete<BackendUser>(`/user/${id}`);
  }
}

export const authService = new AuthService();
