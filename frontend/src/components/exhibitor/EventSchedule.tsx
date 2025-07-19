import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Plus, Filter, Search, Bell } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Schedule } from '../../types';

export function EventSchedule() {
  const { schedules, expos, exhibitors } = useData();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedSessions, setBookmarkedSessions] = useState<string[]>([]);
  const [registeredSessions, setRegisteredSessions] = useState<string[]>([]);

  const myProfile = exhibitors.find(e => e.userId === user?.id);
  const myExpo = myProfile ? expos.find(e => e.id === myProfile.expoId) : null;
  const expoSchedules = myExpo ? schedules.filter(s => s.expoId === myExpo.id) : [];

  // Filter schedules based on search and filters
  const filteredSchedules = expoSchedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (schedule.speaker && schedule.speaker.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !selectedDate || 
                       new Date(schedule.startTime).toDateString() === new Date(selectedDate).toDateString();
    
    const matchesCategory = !selectedCategory || schedule.category === selectedCategory;
    
    return matchesSearch && matchesDate && matchesCategory;
  });

  // Group schedules by date
  const schedulesByDate = filteredSchedules.reduce((acc, schedule) => {
    const date = new Date(schedule.startTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  // Sort schedules within each date by start time
  Object.keys(schedulesByDate).forEach(date => {
    schedulesByDate[date].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  const toggleBookmark = (sessionId: string) => {
    setBookmarkedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const registerForSession = (sessionId: string) => {
    setRegisteredSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const categories = [...new Set(expoSchedules.map(s => s.category))];
  const dates = [...new Set(expoSchedules.map(s => new Date(s.startTime).toDateString()))].sort();

  if (!myExpo) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Expo Found</h2>
          <p className="text-gray-600">You need to be registered for an expo to view the schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
          <p className="text-gray-600">{myExpo.title} - {myExpo.location}</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Request Session
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{expoSchedules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookmarked</p>
              <p className="text-2xl font-bold text-yellow-600">{bookmarkedSessions.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered</p>
              <p className="text-2xl font-bold text-green-600">{registeredSessions.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-6">
        {Object.keys(schedulesByDate).length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          Object.keys(schedulesByDate).map(date => (
            <div key={date} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-4">
                {schedulesByDate[date].map((session) => {
                  const isBookmarked = bookmarkedSessions.includes(session.id);
                  const isRegistered = registeredSessions.includes(session.id);
                  const startTime = new Date(session.startTime);
                  const endTime = new Date(session.endTime);
                  
                  return (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{session.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              session.category === 'Keynote' ? 'bg-purple-100 text-purple-700' :
                              session.category === 'Workshop' ? 'bg-blue-100 text-blue-700' :
                              session.category === 'Panel' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {session.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{session.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                            {session.speaker && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{session.speaker}</span>
                              </div>
                            )}
                          </div>
                          
                          {session.maxAttendees && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Capacity</span>
                                <span>{session.registeredAttendees.length}/{session.maxAttendees}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${(session.registeredAttendees.length / session.maxAttendees) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleBookmark(session.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isBookmarked 
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark session'}
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => registerForSession(session.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              isRegistered
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {isRegistered ? 'Registered' : 'Register'}
                          </button>
                          
                          <button
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Set reminder"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}