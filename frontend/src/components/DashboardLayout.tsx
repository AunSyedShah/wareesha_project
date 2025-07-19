import React, { useState } from 'react';
import { Header } from './layout/Header';
import { Navigation } from './layout/Navigation';
import { AdminDashboard } from './admin/AdminDashboard';
import { ExpoManagement } from './admin/ExpoManagement';
import { ExhibitorDashboard } from './exhibitor/ExhibitorDashboard';
import { CompanyProfile } from './exhibitor/CompanyProfile';
import { BoothManagement } from './exhibitor/BoothManagement';
import { EventSchedule } from './exhibitor/EventSchedule';
import { AttendeeDashboard } from './attendee/AttendeeDashboard';
import { BrowseEvents } from './attendee/BrowseEvents';
import { FindExhibitors } from './attendee/FindExhibitors';
import { MySchedule } from './attendee/MySchedule';
import { useAuth } from '../contexts/AuthContext';

export function DashboardLayout() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    if (user?.role === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'expos':
          return <ExpoManagement />;
        case 'exhibitors':
          return <div className="p-6"><h1 className="text-2xl font-bold">Exhibitor Management</h1><p>Manage exhibitor applications and approvals</p></div>;
        case 'schedules':
          return <div className="p-6"><h1 className="text-2xl font-bold">Schedule Management</h1><p>Create and manage event schedules</p></div>;
        case 'analytics':
          return <div className="p-6"><h1 className="text-2xl font-bold">Analytics & Reports</h1><p>View detailed analytics and generate reports</p></div>;
        case 'messages':
          return <div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Communication hub for all users</p></div>;
        case 'settings':
          return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>System and account settings</p></div>;
        default:
          return <AdminDashboard />;
      }
    } else if (user?.role === 'exhibitor') {
      switch (activeView) {
        case 'dashboard':
          return <ExhibitorDashboard />;
        case 'profile':
          return <CompanyProfile />;
        case 'booths':
          return <BoothManagement />;
        case 'schedule':
          return <EventSchedule />;
        case 'messages':
          return <div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Communicate with organizers and attendees</p></div>;
        case 'settings':
          return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Account and notification settings</p></div>;
        default:
          return <ExhibitorDashboard />;
      }
    } else {
      switch (activeView) {
        case 'dashboard':
          return <AttendeeDashboard />;
        case 'events':
          return <BrowseEvents />;
        case 'exhibitors':
          return <FindExhibitors />;
        case 'schedule':
          return <MySchedule />;
        case 'messages':
          return <div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Messages from exhibitors and organizers</p></div>;
        case 'settings':
          return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Personal preferences and account settings</p></div>;
        default:
          return <AttendeeDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Navigation activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}