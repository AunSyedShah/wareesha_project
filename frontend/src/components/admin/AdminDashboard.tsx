import React from 'react';
import { Calendar, Building2, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function AdminDashboard() {
  const { expos, exhibitors, schedules, registrations } = useData();

  const totalRevenue = expos.reduce((sum, expo) => {
    const occupiedBooths = expo.floorPlan.booths.filter(booth => booth.status === 'occupied');
    return sum + occupiedBooths.reduce((boothSum, booth) => boothSum + booth.price, 0);
  }, 0);

  const upcomingExpos = expos.filter(expo => expo.status === 'upcoming').length;
  const totalExhibitors = exhibitors.length;
  const totalAttendees = registrations.length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+12%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Active Expos',
      value: upcomingExpos.toString(),
      change: '+3%',
      icon: Calendar,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    {
      title: 'Total Exhibitors',
      value: totalExhibitors.toString(),
      change: '+8%',
      icon: Building2,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50'
    },
    {
      title: 'Registered Attendees',
      value: totalAttendees.toString(),
      change: '+15%',
      icon: Users,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your expo management platform</p>
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
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expos</h3>
          <div className="space-y-4">
            {expos.slice(0, 3).map((expo) => (
              <div key={expo.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expo.title}</p>
                  <p className="text-sm text-gray-600">{expo.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(expo.date).toLocaleDateString()}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    expo.status === 'upcoming' ? 'bg-sky-100 text-sky-700' :
                    expo.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {expo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Exhibitor Applications</h3>
          <div className="space-y-4">
            {exhibitors.slice(0, 3).map((exhibitor) => (
              <div key={exhibitor.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{exhibitor.companyName}</p>
                  <p className="text-sm text-gray-600">{exhibitor.contactPerson}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    exhibitor.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    exhibitor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {exhibitor.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-400 hover:bg-sky-50 transition-colors">
            <Calendar className="w-6 h-6 text-sky-600" />
            <span className="font-medium text-gray-700">Create New Expo</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
            <Clock className="w-6 h-6 text-cyan-600" />
            <span className="font-medium text-gray-700">Schedule Session</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-gray-700">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}