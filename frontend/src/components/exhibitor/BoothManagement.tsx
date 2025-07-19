import React, { useState } from 'react';
import { Store, MapPin, DollarSign, Users, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { FloorPlan } from '../common/FloorPlan';
import { Booth } from '../../types';

export function BoothManagement() {
  const { expos, exhibitors, updateBoothStatus } = useData();
  const { user } = useAuth();
  const [selectedExpo, setSelectedExpo] = useState<string>('');
  const [selectedBooths, setSelectedBooths] = useState<string[]>([]);
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  const myProfile = exhibitors.find(e => e.userId === user?.id);
  const availableExpos = expos.filter(expo => expo.status === 'upcoming');
  const currentExpo = selectedExpo ? expos.find(e => e.id === selectedExpo) : null;
  const myBooths = currentExpo ? currentExpo.floorPlan.booths.filter(b => b.exhibitorId === myProfile?.id) : [];

  const handleBoothClick = (booth: Booth) => {
    if (booth.status === 'available') {
      setSelectedBooths(prev => 
        prev.includes(booth.id) 
          ? prev.filter(id => id !== booth.id)
          : [...prev, booth.id]
      );
    }
  };

  const reserveBooths = () => {
    if (!currentExpo || !myProfile) return;
    
    selectedBooths.forEach(boothId => {
      updateBoothStatus(currentExpo.id, boothId, 'reserved', myProfile.id);
    });
    
    setSelectedBooths([]);
    alert(`Successfully reserved ${selectedBooths.length} booth(s)!`);
  };

  const getBoothStats = () => {
    if (!currentExpo) return { available: 0, reserved: 0, occupied: 0, total: 0 };
    
    const booths = currentExpo.floorPlan.booths;
    return {
      available: booths.filter(b => b.status === 'available').length,
      reserved: booths.filter(b => b.status === 'reserved').length,
      occupied: booths.filter(b => b.status === 'occupied').length,
      total: booths.length
    };
  };

  const stats = getBoothStats();
  const totalCost = selectedBooths.reduce((sum, boothId) => {
    const booth = currentExpo?.floorPlan.booths.find(b => b.id === boothId);
    return sum + (booth?.price || 0);
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booth Management</h1>
          <p className="text-gray-600">Select and manage your booth spaces</p>
        </div>
        <div className="flex gap-3">
          {selectedBooths.length > 0 && (
            <button
              onClick={reserveBooths}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Reserve {selectedBooths.length} Booth(s)
            </button>
          )}
          <button
            onClick={() => setShowFloorPlan(!showFloorPlan)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            {showFloorPlan ? 'Hide' : 'Show'} Floor Plan
          </button>
        </div>
      </div>

      {/* Expo Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Expo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableExpos.map((expo) => (
            <div
              key={expo.id}
              onClick={() => setSelectedExpo(expo.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedExpo === expo.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{expo.title}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(expo.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {expo.location}
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  {expo.floorPlan.booths.filter(b => b.status === 'available').length} available booths
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentExpo && (
        <>
          {/* Booth Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Booths</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reserved Booths</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.reserved}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied Booths</p>
                  <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Booths</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedBooths.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Selection Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Selected Booths</p>
                    <p className="font-semibold text-blue-900">{selectedBooths.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Total Cost</p>
                    <p className="font-semibold text-blue-900">${totalCost.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Average Price</p>
                    <p className="font-semibold text-blue-900">${Math.round(totalCost / selectedBooths.length).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Current Booths */}
          {myBooths.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Current Booths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBooths.map((booth) => (
                  <div key={booth.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Booth {booth.number}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booth.status === 'occupied' ? 'bg-green-100 text-green-700' :
                        booth.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booth.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span>{booth.width} × {booth.height} ft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-green-600">${booth.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Category:</span>
                        <span>{booth.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floor Plan */}
          {showFloorPlan && (
            <FloorPlan
              floorPlan={currentExpo.floorPlan}
              onBoothClick={handleBoothClick}
              selectedBooths={selectedBooths}
              viewMode="exhibitor"
            />
          )}

          {/* Booth Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booth Categories & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Technology', 'Healthcare', 'Finance'].map((category) => {
                const categoryBooths = currentExpo.floorPlan.booths.filter(b => b.category === category);
                const availableCount = categoryBooths.filter(b => b.status === 'available').length;
                const avgPrice = categoryBooths.reduce((sum, b) => sum + b.price, 0) / categoryBooths.length;
                
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium">{availableCount}/{categoryBooths.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Price:</span>
                        <span className="font-medium text-green-600">${Math.round(avgPrice).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(availableCount / categoryBooths.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}