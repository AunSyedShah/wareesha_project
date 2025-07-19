import { api, ApiResponse } from './api';

export interface BackendExpo {
  _id: string;
  name: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  theme: string;
  maxExhibitors: number;
  registrationDeadline: string;
  status: 'upcoming' | 'active' | 'completed';
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpoData {
  name: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  theme: string;
  maxExhibitors: number;
  registrationDeadline: string;
  organizer: string;
}

export interface UpdateExpoData {
  name?: string;
  description?: string;
  date?: string;
  endDate?: string;
  location?: string;
  theme?: string;
  maxExhibitors?: number;
  registrationDeadline?: string;
  status?: 'upcoming' | 'active' | 'completed';
}

export interface AttendeeRegistration {
  userId: string;
  expoId: string;
}

export interface ExhibitorRequest {
  userId: string;
  expoId: string;
  companyName: string;
  companyDescription: string;
}

export interface ExhibitorRequestResponse {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  expoId: {
    _id: string;
    name: string;
  };
  companyName: string;
  companyDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ApproveRejectRequest {
  requestId: string;
  expoId: string;
  userId: string;
}

class ExpoService {
  async getAllExpos(): Promise<ApiResponse<BackendExpo[]>> {
    return api.get<BackendExpo[]>('/expo');
  }

  async getExpo(id: string): Promise<ApiResponse<BackendExpo>> {
    return api.get<BackendExpo>(`/expo/${id}`);
  }

  async createExpo(expoData: CreateExpoData): Promise<ApiResponse<BackendExpo>> {
    return api.post<BackendExpo>('/expo/create', expoData);
  }

  async updateExpo(id: string, expoData: UpdateExpoData): Promise<ApiResponse<BackendExpo>> {
    return api.put<BackendExpo>(`/expo/updateexpo/${id}`, expoData);
  }

  async deleteExpo(id: string): Promise<ApiResponse<BackendExpo>> {
    return api.delete<BackendExpo>(`/expo/${id}`);
  }

  async scheduleExpo(id: string, scheduleData: any): Promise<ApiResponse<any>> {
    return api.post<any>(`/expo/schedule/${id}`, scheduleData);
  }

  async registerAttendee(registrationData: AttendeeRegistration): Promise<ApiResponse<any>> {
    return api.post<any>('/expo/attendeeregister', registrationData);
  }

  async submitExhibitorRequest(requestData: ExhibitorRequest): Promise<ApiResponse<any>> {
    return api.post<any>('/expo/exporegisterrequest', requestData);
  }

  async getAllExhibitorRequests(): Promise<ApiResponse<ExhibitorRequestResponse[]>> {
    return api.get<ExhibitorRequestResponse[]>('/expo/exhibitorrequests');
  }

  async approveExhibitorRequest(requestData: ApproveRejectRequest): Promise<ApiResponse<any>> {
    return api.post<any>('/expo/approve-exhibitor', requestData);
  }

  async rejectExhibitorRequest(requestData: ApproveRejectRequest): Promise<ApiResponse<any>> {
    return api.post<any>('/expo/reject-exhibitor', requestData);
  }
}

export const expoService = new ExpoService();
