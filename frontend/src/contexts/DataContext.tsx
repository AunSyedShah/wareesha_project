import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expo, Exhibitor, Feedback } from '../types';
import { expoService, BackendExpo } from '../services/expoService';
import { feedbackService, BackendFeedback } from '../services/feedbackService';
import { useAuth } from './AuthContext';

interface DataContextType {
  expos: Expo[];
  exhibitors: Exhibitor[];
  feedbacks: Feedback[];
  loading: boolean;
  refreshExpos: () => Promise<void>;
  refreshFeedbacks: () => Promise<void>;
  createExpo: (expoData: any) => Promise<{ success: boolean; error?: string }>;
  updateExpo: (id: string, expoData: any) => Promise<{ success: boolean; error?: string }>;
  deleteExpo: (id: string) => Promise<{ success: boolean; error?: string }>;
  submitFeedback: (feedbackData: any) => Promise<{ success: boolean; error?: string }>;
  registerForExpo: (expoId: string) => Promise<{ success: boolean; error?: string }>;
  submitExhibitorRequest: (requestData: any) => Promise<{ success: boolean; error?: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to convert backend expo to frontend expo
const convertBackendExpo = (backendExpo: BackendExpo): Expo => ({
  id: backendExpo._id,
  title: backendExpo.name,
  description: backendExpo.description,
  date: new Date(backendExpo.date),
  endDate: new Date(backendExpo.endDate),
  location: backendExpo.location,
  theme: backendExpo.theme,
  maxExhibitors: backendExpo.maxExhibitors,
  registrationDeadline: new Date(backendExpo.registrationDeadline),
  status: backendExpo.status,
  floorPlan: {
    width: 800,
    height: 600,
    booths: []
  }, // Default floor plan - will need to be implemented in backend
  createdBy: backendExpo.organizer,
  createdAt: new Date(backendExpo.createdAt),
});

// Helper function to convert backend feedback to frontend feedback
const convertBackendFeedback = (backendFeedback: BackendFeedback): Feedback => ({
  id: backendFeedback._id,
  userId: backendFeedback.userId,
  expoId: backendFeedback.expoId,
  rating: backendFeedback.rating,
  comment: backendFeedback.comment,
  createdAt: new Date(backendFeedback.createdAt),
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [expos, setExpos] = useState<Expo[]>([]);
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshExpos = async () => {
    try {
      setLoading(true);
      const response = await expoService.getAllExpos();
      
      if (response.status && response.data) {
        const frontendExpos = response.data.map(convertBackendExpo);
        setExpos(frontendExpos);
      }
    } catch (error) {
      console.error('Error fetching expos:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeedbacks = async () => {
    try {
      const response = await feedbackService.getAllFeedbacks();
      
      if (response.status && response.data) {
        const frontendFeedbacks = response.data.map(convertBackendFeedback);
        setFeedbacks(frontendFeedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const createExpo = async (expoData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const backendData = {
        name: expoData.title,
        description: expoData.description,
        date: expoData.date,
        endDate: expoData.endDate,
        location: expoData.location,
        theme: expoData.theme,
        maxExhibitors: expoData.maxExhibitors,
        registrationDeadline: expoData.registrationDeadline,
        organizer: user.id,
      };

      const response = await expoService.createExpo(backendData);
      
      if (response.status && response.data) {
        await refreshExpos();
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to create expo' };
      }
    } catch (error) {
      console.error('Error creating expo:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateExpo = async (id: string, expoData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const backendData = {
        name: expoData.title,
        description: expoData.description,
        date: expoData.date,
        endDate: expoData.endDate,
        location: expoData.location,
        theme: expoData.theme,
        maxExhibitors: expoData.maxExhibitors,
        registrationDeadline: expoData.registrationDeadline,
        status: expoData.status,
      };

      const response = await expoService.updateExpo(id, backendData);
      
      if (response.status) {
        await refreshExpos();
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to update expo' };
      }
    } catch (error) {
      console.error('Error updating expo:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const deleteExpo = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await expoService.deleteExpo(id);
      
      if (response.status) {
        await refreshExpos();
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to delete expo' };
      }
    } catch (error) {
      console.error('Error deleting expo:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const submitFeedback = async (feedbackData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const backendData = {
        userId: user.id,
        expoId: feedbackData.expoId,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      };

      const response = await feedbackService.createFeedback(backendData);
      
      if (response.status) {
        await refreshFeedbacks();
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to submit feedback' };
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const registerForExpo = async (expoId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const response = await expoService.registerAttendee({
        userId: user.id,
        expoId,
      });
      
      if (response.status) {
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to register for expo' };
      }
    } catch (error) {
      console.error('Error registering for expo:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const submitExhibitorRequest = async (requestData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const backendData = {
        userId: user.id,
        expoId: requestData.expoId,
        companyName: requestData.companyName,
        companyDescription: requestData.companyDescription,
      };

      const response = await expoService.submitExhibitorRequest(backendData);
      
      if (response.status) {
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to submit exhibitor request' };
      }
    } catch (error) {
      console.error('Error submitting exhibitor request:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Load initial data
  useEffect(() => {
    refreshExpos();
    refreshFeedbacks();
  }, []);

  return (
    <DataContext.Provider value={{
      expos,
      exhibitors,
      feedbacks,
      loading,
      refreshExpos,
      refreshFeedbacks,
      createExpo,
      updateExpo,
      deleteExpo,
      submitFeedback,
      registerForExpo,
      submitExhibitorRequest,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
