import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building2, 
  MessageSquare, 
  BarChart3,
  Settings,
  Store,
  UserCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'expos', label: 'Expo Management', icon: Calendar },
          { id: 'exhibitors', label: 'Exhibitor Management', icon: Building2 },
          { id: 'schedules', label: 'Schedule Management', icon: UserCheck },
          { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'exhibitor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'Company Profile', icon: Building2 },
          { id: 'booths', label: 'Booth Management', icon: Store },
          { id: 'schedule', label: 'Event Schedule', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'attendee':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'events', label: 'Browse Events', icon: Calendar },
          { id: 'exhibitors', label: 'Find Exhibitors', icon: Search },
          { id: 'schedule', label: 'My Schedule', icon: UserCheck },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-r border-gray-200 w-64 p-6">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}