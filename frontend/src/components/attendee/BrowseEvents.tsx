import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, Star, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Expo } from '../../types';

export function BrowseEvents() {
  const { expos, addRegistration, registrations } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const myRegistrations = registrations.filter(r => r.userId === user?.id);
  const registeredExpoIds = myRegistrations.map(r => r.expoId);

  // Filter expos based on search and filters
  const filteredExpos = expos.filter(expo => {
    const matchesSearch = expo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expo.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || expo.status === selectedStatus;
    const matchesTheme = !selectedTheme || expo.theme.toLowerCase().includes(selectedTheme.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const handleRegister = (expo: Expo) => {
    if (!user) return;
    
    addRegistration({
      userId: user.id,
      expoId: expo.id,
      sessions: []
    });
    
    alert(`Successfully registered for ${expo.title}!`);
  };

  const isRegistered = (expoId: string) => registeredExpoIds.includes(expoId);

  const themes = [...new Set(expos.map(e => e.theme))];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Events</h1>
        <p className="text-gray-600">Discover and register for upcoming expos and trade shows</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Themes</option>
            {themes.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="flex-1 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-colors flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Registration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{expos.length}</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Events</p>
              <p className="text-2xl font-bold text-green-600">{myRegistrations.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-orange-600">
                {expos.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExpos.map((expo) => {
          const registered = isRegistered(expo.id);
          const availableBooths = expo.floorPlan.booths.filter(b => b.status === 'available').length;
          const totalBooths = expo.floorPlan.booths.length;
          
          return (
            <div key={expo.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{expo.title}</h3>
                  <p className="text-gray-600 mb-4">{expo.description}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  expo.status === 'upcoming' ? 'bg-teal-100 text-teal-700' :
                  expo.status === 'active' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {expo.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(expo.date).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{expo.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{availableBooths}/{totalBooths} booths available</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Registration until {new Date(expo.registrationDeadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Theme: {expo.theme}</span>
                  <span>Booth Availability</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(availableBooths / totalBooths) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-3">
                {registered ? (
                  <div className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Registered
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(expo)}
                    disabled={expo.status === 'completed' || new Date(expo.registrationDeadline) < new Date()}
                    className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Register Now
                  </button>
                )}
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExpos.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}