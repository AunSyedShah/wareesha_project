import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Expo } from '../../types';

export function ExpoManagement() {
  const { expos, addExpo, updateExpo, deleteExpo } = useData();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExpo, setEditingExpo] = useState<Expo | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    theme: '',
    maxExhibitors: 100,
    registrationDeadline: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const expoData = {
      ...formData,
      date: new Date(formData.date),
      endDate: new Date(formData.endDate),
      registrationDeadline: new Date(formData.registrationDeadline),
      status: 'upcoming' as const,
      floorPlan: {
        width: 800,
        height: 600,
        booths: Array.from({ length: formData.maxExhibitors }, (_, i) => ({
          id: `booth-${Date.now()}-${i + 1}`,
          number: `A${i + 1}`,
          x: (i % 10) * 80,
          y: Math.floor(i / 10) * 120,
          width: 70,
          height: 100,
          price: 2500 + (i % 3) * 500,
          status: 'available' as const,
          category: ['Technology', 'Healthcare', 'Finance'][i % 3]
        }))
      },
      createdBy: user.id
    };

    if (editingExpo) {
      updateExpo(editingExpo.id, expoData);
      setEditingExpo(null);
    } else {
      addExpo(expoData);
    }

    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      theme: '',
      maxExhibitors: 100,
      registrationDeadline: ''
    });
  };

  const handleEdit = (expo: Expo) => {
    setEditingExpo(expo);
    setFormData({
      title: expo.title,
      description: expo.description,
      date: expo.date.toISOString().split('T')[0],
      endDate: expo.endDate.toISOString().split('T')[0],
      location: expo.location,
      theme: expo.theme,
      maxExhibitors: expo.maxExhibitors,
      registrationDeadline: expo.registrationDeadline.toISOString().split('T')[0]
    });
    setShowCreateForm(true);
  };

  const handleDelete = (expoId: string) => {
    if (window.confirm('Are you sure you want to delete this expo? This action cannot be undone.')) {
      deleteExpo(expoId);
    }
  };

  const getBoothStats = (expo: Expo) => {
    const occupied = expo.floorPlan.booths.filter(b => b.status === 'occupied').length;
    const reserved = expo.floorPlan.booths.filter(b => b.status === 'reserved').length;
    const available = expo.floorPlan.booths.filter(b => b.status === 'available').length;
    const revenue = expo.floorPlan.booths
      .filter(b => b.status === 'occupied')
      .reduce((sum, b) => sum + b.price, 0);
    
    return { occupied, reserved, available, revenue };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expo Management</h1>
          <p className="text-gray-600">Create and manage your expo events</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Expo
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingExpo ? 'Edit Expo' : 'Create New Expo'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expo Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Exhibitors
              </label>
              <input
                type="number"
                value={formData.maxExhibitors}
                onChange={(e) => setFormData(prev => ({ ...prev, maxExhibitors: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline
              </label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {editingExpo ? 'Update Expo' : 'Create Expo'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingExpo(null);
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    endDate: '',
                    location: '',
                    theme: '',
                    maxExhibitors: 100,
                    registrationDeadline: ''
                  });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expo List */}
      <div className="grid grid-cols-1 gap-6">
        {expos.map((expo) => {
          const stats = getBoothStats(expo);
          return (
            <div key={expo.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{expo.title}</h3>
                  <p className="text-gray-600 mt-1">{expo.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expo)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(expo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(expo.date).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{expo.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{stats.occupied}/{expo.maxExhibitors} booths</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <DollarSign className="w-5 h-5" />
                  <span>${(stats.revenue / 1000).toFixed(0)}K revenue</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{stats.occupied}</p>
                  <p className="text-sm text-green-600">Occupied Booths</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{stats.reserved}</p>
                  <p className="text-sm text-yellow-600">Reserved Booths</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{stats.available}</p>
                  <p className="text-sm text-blue-600">Available Booths</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}