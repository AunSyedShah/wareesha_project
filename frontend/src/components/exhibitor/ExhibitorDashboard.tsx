import React from 'react';
import { Store, Calendar, MessageSquare, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function ExhibitorDashboard() {
  const { exhibitors, expos, schedules } = useData();
  const { user } = useAuth();

  const myExhibitorProfile = exhibitors.find(e => e.userId === user?.id);
  // Find expo where this exhibitor is registered (approved status)
  const myExpo = myExhibitorProfile ? expos.find(e => e.id === myExhibitorProfile.expoId) : 
                 // If no specific expo assigned, show the first upcoming expo
                 expos.find(e => e.status === 'upcoming');
  const myBooths = myExpo ? myExpo.floorPlan.booths.filter(b => b.exhibitorId === myExhibitorProfile?.id) : [];
  const upcomingSessions = myExpo ? schedules.filter(s => s.expoId === myExpo.id).slice(0, 3) : [];

  const stats = [
    {
      title: 'Booth Revenue',
      value: `$${(myBooths.reduce((sum, booth) => sum + booth.price, 0) / 1000).toFixed(0)}K`,
      change: '+5%',
      icon: DollarSign,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Booth Spaces',
      value: myBooths.length.toString(),
      change: '0%',
      icon: Store,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Expo Status',
      value: myExhibitorProfile?.status || 'Pending',
      change: '+1',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Messages',
      value: '12',
      change: '+3',
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exhibitor Dashboard</h1>
        <p className="text-gray-600">Manage your expo presence and engagement</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last week</p>
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
        {/* Company Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Profile</h3>
          {myExhibitorProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {myExhibitorProfile.logo && (
                  <img
                    src={myExhibitorProfile.logo}
                    alt={myExhibitorProfile.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{myExhibitorProfile.companyName}</h4>
                  <p className="text-gray-600">{myExhibitorProfile.contactPerson}</p>
                </div>
              </div>
              <p className="text-gray-700">{myExhibitorProfile.description}</p>
              <div className="flex flex-wrap gap-2">
                {myExhibitorProfile.products.map((product, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Complete your exhibitor profile to get started</p>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Create Profile
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expo Information */}
      {myExpo && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expo Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{myExpo.title}</h4>
              <p className="text-gray-600 mb-4">{myExpo.description}</p>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Date:</span> {new Date(myExpo.date).toLocaleDateString()} - {new Date(myExpo.endDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {myExpo.location}</p>
                <p><span className="font-medium">Theme:</span> {myExpo.theme}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Your Booths</h4>
              <div className="space-y-2">
                {myBooths.map((booth) => (
                  <div key={booth.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Booth {booth.number}</span>
                    <span className="text-rose-600 font-semibold">${booth.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}