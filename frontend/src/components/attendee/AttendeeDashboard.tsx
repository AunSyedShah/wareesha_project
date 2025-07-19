import React from 'react';
import { Calendar, Users, Building2, Clock, Star, MapPin } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function AttendeeDashboard() {
  const { expos, exhibitors, schedules, registrations } = useData();
  const { user } = useAuth();

  const myRegistrations = registrations.filter(r => r.userId === user?.id);
  const upcomingExpos = expos.filter(expo => 
    expo.status === 'upcoming' && new Date(expo.date) > new Date()
  ).slice(0, 3);
  const featuredExhibitors = exhibitors.filter(e => e.status === 'approved').slice(0, 4);
  const upcomingSessions = schedules.slice(0, 3);

  const stats = [
    {
      title: 'Registered Events',
      value: myRegistrations.length.toString(),
      change: '+2',
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Bookmarked Sessions',
      value: '8',
      change: '+3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Exhibitor Connections',
      value: '12',
      change: '+5',
      icon: Building2,
      color: 'text-lime-600',
      bgColor: 'bg-lime-50'
    },
    {
      title: 'Favorite Events',
      value: '4',
      change: '+1',
      icon: Star,
      color: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, {user?.name}!</h1>
        <p className="text-gray-600">Discover amazing events and connect with exhibitors</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} this month</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingExpos.map((expo) => (
              <div key={expo.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{expo.title}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {expo.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{expo.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(expo.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {expo.location}
                  </div>
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Exhibitors */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Exhibitors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredExhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {exhibitor.logo && (
                    <img
                      src={exhibitor.logo}
                      alt={exhibitor.companyName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{exhibitor.companyName}</h4>
                    <p className="text-xs text-gray-600">{exhibitor.contactPerson}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {exhibitor.products.slice(0, 2).map((product, index) => (
                    <span
                      key={index}
                    className="px-2 py-1 bg-lime-100 text-lime-700 text-xs rounded-full"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              <button className="mt-3 w-full bg-lime-50 text-lime-700 px-3 py-2 rounded-lg text-sm hover:bg-lime-100 transition-colors">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingSessions.map((session) => (
          <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-sm">{session.title}</h4>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {session.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{session.description}</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {session.location}
                </div>
                {session.speaker && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.speaker}
                  </div>
                )}
              </div>
            <button className="mt-3 w-full bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm hover:bg-orange-100 transition-colors">
                Add to Schedule
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}