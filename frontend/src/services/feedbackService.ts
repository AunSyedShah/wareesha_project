import { api, ApiResponse } from './api';

export interface BackendFeedback {
  _id: string;
  userId: string;
  expoId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  userId: string;
  expoId: string;
  rating: number;
  comment: string;
}

class FeedbackService {
  async getAllFeedbacks(): Promise<ApiResponse<BackendFeedback[]>> {
    return api.get<BackendFeedback[]>('/feedback');
  }

  async createFeedback(feedbackData: CreateFeedbackData): Promise<ApiResponse<BackendFeedback>> {
    return api.post<BackendFeedback>('/feedback/create', feedbackData);
  }
}

export const feedbackService = new FeedbackService();
