import React, { createContext, useContext, useState } from 'react';
import { Expo, Exhibitor, Schedule, Message, Registration, Booth } from '../types';

interface DataContextType {
  expos: Expo[];
  exhibitors: Exhibitor[];
  schedules: Schedule[];
  messages: Message[];
  registrations: Registration[];
  addExpo: (expo: Omit<Expo, 'id' | 'createdAt'>) => void;
  updateExpo: (id: string, expo: Partial<Expo>) => void;
  deleteExpo: (id: string) => void;
  addExhibitor: (exhibitor: Omit<Exhibitor, 'id' | 'appliedAt'>) => void;
  updateExhibitor: (id: string, exhibitor: Partial<Exhibitor>) => void;
  deleteExhibitor: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  addRegistration: (registration: Omit<Registration, 'id' | 'registeredAt'>) => void;
  updateBoothStatus: (expoId: string, boothId: string, status: Booth['status'], exhibitorId?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockExpos: Expo[] = [
  {
    id: '1',
    title: 'Tech Innovation Expo 2024',
    description: 'The largest technology showcase featuring cutting-edge innovations, AI solutions, and digital transformation.',
    date: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    location: 'San Francisco Convention Center',
    theme: 'Future of Technology',
    maxExhibitors: 200,
    registrationDeadline: new Date('2024-02-15'),
    status: 'upcoming',
    floorPlan: {
      width: 800,
      height: 600,
      booths: Array.from({ length: 50 }, (_, i) => ({
        id: `booth-${i + 1}`,
        number: `A${i + 1}`,
        x: (i % 10) * 80,
        y: Math.floor(i / 10) * 120,
        width: 70,
        height: 100,
        price: 2500 + (i % 3) * 500,
        status: i < 15 ? 'occupied' : i < 30 ? 'reserved' : 'available',
        exhibitorId: i < 15 ? `exhibitor-${i + 1}` : undefined,
        category: ['Technology', 'Healthcare', 'Finance'][i % 3]
      }))
    },
    createdBy: '1',
    createdAt: new Date()
  }
];

const mockExhibitors: Exhibitor[] = [
  {
    id: 'exhibitor-1',
    userId: '2',
    companyName: 'TechCorp Solutions',
    description: 'Leading provider of enterprise software solutions and AI-powered automation tools.',
    logo: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    website: 'https://techcorp.com',
    contactPerson: 'Sarah Chen',
    email: 'exhibitor@techcorp.com',
    phone: '+1-555-0123',
    products: ['Enterprise Software', 'AI Solutions', 'Cloud Services'],
    services: ['Consulting', 'Implementation', 'Support'],
    boothIds: ['booth-1'],
    expoId: '1',
    status: 'approved',
    appliedAt: new Date()
  }
];

const mockSchedules: Schedule[] = [
  {
    id: 'schedule-1',
    expoId: '1',
    title: 'Opening Keynote: The Future of AI',
    description: 'Join industry leaders as they discuss the transformative power of artificial intelligence.',
    startTime: new Date('2024-03-15T09:00:00'),
    endTime: new Date('2024-03-15T10:30:00'),
    speaker: 'Dr. Jennifer Liu',
    location: 'Main Auditorium',
    category: 'Keynote',
    maxAttendees: 500,
    registeredAttendees: []
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [expos, setExpos] = useState<Expo[]>(mockExpos);
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(mockExhibitors);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [messages, setMessages] = useState<Message[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const addExpo = (expoData: Omit<Expo, 'id' | 'createdAt'>) => {
    const newExpo: Expo = {
      ...expoData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setExpos(prev => [...prev, newExpo]);
  };

  const updateExpo = (id: string, expoData: Partial<Expo>) => {
    setExpos(prev => prev.map(expo => expo.id === id ? { ...expo, ...expoData } : expo));
  };

  const addExhibitor = (exhibitorData: Omit<Exhibitor, 'id' | 'appliedAt'>) => {
    const newExhibitor: Exhibitor = {
      ...exhibitorData,
      id: Math.random().toString(36).substr(2, 9),
      appliedAt: new Date()
    };
    setExhibitors(prev => [...prev, newExhibitor]);
  };

  const updateExhibitor = (id: string, exhibitorData: Partial<Exhibitor>) => {
    setExhibitors(prev => prev.map(exhibitor => exhibitor.id === id ? { ...exhibitor, ...exhibitorData } : exhibitor));
  };

  const addSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addRegistration = (registrationData: Omit<Registration, 'id' | 'registeredAt'>) => {
    const newRegistration: Registration = {
      ...registrationData,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date()
    };
    setRegistrations(prev => [...prev, newRegistration]);
  };

  const updateBoothStatus = (expoId: string, boothId: string, status: Booth['status'], exhibitorId?: string) => {
    setExpos(prev => prev.map(expo => {
      if (expo.id === expoId) {
        return {
          ...expo,
          floorPlan: {
            ...expo.floorPlan,
            booths: expo.floorPlan.booths.map(booth => 
              booth.id === boothId 
                ? { ...booth, status, exhibitorId }
                : booth
            )
          }
        };
      }
      return expo;
    }));
  };

  const deleteExpo = (id: string) => {
    setExpos(prev => prev.filter(expo => expo.id !== id));
  };

  const deleteExhibitor = (id: string) => {
    setExhibitors(prev => prev.filter(exhibitor => exhibitor.id !== id));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  return (
    <DataContext.Provider value={{
      expos,
      exhibitors,
      schedules,
      messages,
      registrations,
      addExpo,
      updateExpo,
      deleteExpo,
      addExhibitor,
      updateExhibitor,
      deleteExhibitor,
      addSchedule,
      deleteSchedule,
      addMessage,
      addRegistration,
      updateBoothStatus
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