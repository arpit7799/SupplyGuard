import React from 'react';

const getColor = (weight) => {
  if (weight >= 0.8) return 'rgba(239,68,68,0.8)';
  if (weight >= 0.4) return 'rgba(245,158,11,0.7)';
  return 'rgba(16,185,129,0.6)';
};

export default function RiskHeatmap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-600 text-xs font-mono tracking-widest">
        NO DATA
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-wrap gap-3">
      {data.map((point, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-1"
          title={`lat: ${point.lat}, lng: ${point.lng}`}
        >
          <div
            style={{
              width: 40 + point.weight * 40,
              height: 40 + point.weight * 40,
              background: getColor(point.weight),
              borderRadius: '50%',
              filter: 'blur(2px)',
              transition: 'all 0.3s',
            }}
          />
        </div>
      ))}
    </div>
  );
}
