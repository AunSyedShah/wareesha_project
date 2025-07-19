import React, { useState } from 'react';
import { Building2, Search, Filter, Globe, Phone, Mail, MapPin, Star, MessageSquare } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function FindExhibitors() {
  const { exhibitors, expos } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpo, setSelectedExpo] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [favoriteExhibitors, setFavoriteExhibitors] = useState<string[]>([]);

  // Filter exhibitors based on search and filters
  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         exhibitor.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpo = !selectedExpo || exhibitor.expoId === selectedExpo;
    const matchesCategory = !selectedCategory || 
                           exhibitor.products.some(p => p.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                           exhibitor.services.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesExpo && matchesCategory && exhibitor.status === 'approved';
  });

  const toggleFavorite = (exhibitorId: string) => {
    setFavoriteExhibitors(prev => 
      prev.includes(exhibitorId) 
        ? prev.filter(id => id !== exhibitorId)
        : [...prev, exhibitorId]
    );
  };

  const categories = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education', 'Retail'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Exhibitors</h1>
        <p className="text-gray-600">Connect with exhibitors and explore their products and services</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exhibitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedExpo}
            onChange={(e) => setSelectedExpo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          >
            <option value="">All Events</option>
            {expos.map(expo => (
              <option key={expo.id} value={expo.id}>{expo.title}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="flex-1 bg-lime-100 text-lime-700 px-4 py-2 rounded-lg hover:bg-lime-200 transition-colors flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exhibitors</p>
              <p className="text-2xl font-bold text-gray-900">{exhibitors.filter(e => e.status === 'approved').length}</p>
            </div>
            <div className="w-12 h-12 bg-lime-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-lime-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-yellow-600">{favoriteExhibitors.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
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

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connections</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map((exhibitor) => {
          const isFavorite = favoriteExhibitors.includes(exhibitor.id);
          const expo = expos.find(e => e.id === exhibitor.expoId);
          
          return (
            <div key={exhibitor.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-lime-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {exhibitor.logo ? (
                    <img
                      src={exhibitor.logo}
                      alt={exhibitor.companyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-lime-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{exhibitor.companyName}</h3>
                    <p className="text-sm text-gray-600">{exhibitor.contactPerson}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(exhibitor.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{exhibitor.description}</p>

              {expo && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{expo.title}</span>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">PRODUCTS</p>
                  <div className="flex flex-wrap gap-1">
                    {exhibitor.products.slice(0, 3).map((product, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-lime-100 text-lime-700 text-xs rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                    {exhibitor.products.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{exhibitor.products.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">SERVICES</p>
                  <div className="flex flex-wrap gap-1">
                    {exhibitor.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                    {exhibitor.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{exhibitor.services.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {exhibitor.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a href={exhibitor.website} target="_blank" rel="noopener noreferrer" className="text-lime-600 hover:text-lime-700">
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{exhibitor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{exhibitor.email}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-lime-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-lime-700 transition-colors">
                  View Profile
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExhibitors.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Exhibitors Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}