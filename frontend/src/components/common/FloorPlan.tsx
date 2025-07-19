import React from 'react';
import { FloorPlan as FloorPlanType, Booth } from '../../types';

interface FloorPlanProps {
  floorPlan: FloorPlanType;
  onBoothClick?: (booth: Booth) => void;
  selectedBooths?: string[];
  viewMode?: 'admin' | 'exhibitor' | 'attendee';
}

export function FloorPlan({ floorPlan, onBoothClick, selectedBooths = [], viewMode = 'admin' }: FloorPlanProps) {
  const getBoothColor = (booth: Booth) => {
    if (selectedBooths.includes(booth.id)) {
      return '#3B82F6'; // blue for selected
    }
    
    switch (booth.status) {
      case 'available':
        return '#10B981'; // green
      case 'reserved':
        return '#F59E0B'; // yellow
      case 'occupied':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const getBoothStroke = (booth: Booth) => {
    if (selectedBooths.includes(booth.id)) {
      return '#1E40AF';
    }
    return '#374151';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Floor Plan</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
          {selectedBooths.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Selected</span>
            </div>
          )}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto">
        <svg
          width={floorPlan.width}
          height={floorPlan.height}
          viewBox={`0 0 ${floorPlan.width} ${floorPlan.height}`}
          className="max-w-full h-auto"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
          />

          {/* Booths */}
          {floorPlan.booths.map((booth) => (
            <g key={booth.id}>
              <rect
                x={booth.x}
                y={booth.y}
                width={booth.width}
                height={booth.height}
                fill={getBoothColor(booth)}
                stroke={getBoothStroke(booth)}
                strokeWidth="2"
                rx="4"
                className={`transition-all duration-200 ${
                  onBoothClick && (booth.status === 'available' || viewMode === 'admin')
                    ? 'cursor-pointer hover:opacity-80'
                    : ''
                }`}
                onClick={() => {
                  if (onBoothClick && (booth.status === 'available' || viewMode === 'admin')) {
                    onBoothClick(booth);
                  }
                }}
              />
              <text
                x={booth.x + booth.width / 2}
                y={booth.y + booth.height / 2 - 8}
                textAnchor="middle"
                className="text-xs font-semibold fill-white pointer-events-none"
              >
                {booth.number}
              </text>
              <text
                x={booth.x + booth.width / 2}
                y={booth.y + booth.height / 2 + 6}
                textAnchor="middle"
                className="text-xs fill-white pointer-events-none"
              >
                ${booth.price}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}