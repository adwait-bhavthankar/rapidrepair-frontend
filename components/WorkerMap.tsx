'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, Briefcase } from 'lucide-react';

interface Worker {
  _id: string;
  user: { username: string };
  serviceCategory: string;
  experienceYears: number;
  description: string;
  location?: { lat: number; lng: number; address: string };
}

interface WorkerMapProps {
  workers: Worker[];
}

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: #2563eb;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

export default function WorkerMap({ workers }: WorkerMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const workersWithLocation = workers.filter(w => w.location?.lat && w.location?.lng);
  
  const defaultCenter: [number, number] = workersWithLocation.length > 0
    ? [workersWithLocation[0].location!.lat, workersWithLocation[0].location!.lng]
    : [40.7128, -74.0060];

  return (
    <>
      {/* CSS Override to fix Leaflet's default popup padding and borders */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 1rem !important;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 240px !important;
        }
        .leaflet-popup-tip {
          background: white !important;
        }
      `}} />

      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {workersWithLocation.map(worker => (
          <Marker 
            key={worker._id} 
            position={[worker.location!.lat, worker.location!.lng]}
            icon={createCustomIcon()}
          >
            <Popup>
              <div className="bg-white flex flex-col font-sans">
                {/* Header Profile Area */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 border-b border-slate-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black text-lg shadow-inner shrink-0">
                    {worker.user.username[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h3 className="font-black text-slate-900 text-sm truncate">{worker.user.username}</h3>
                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mt-0.5 truncate">{worker.serviceCategory}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3">
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {worker.description || "Professional service provider ready to assist you."}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <Briefcase size={12} className="text-blue-500" />
                      <span className="uppercase tracking-wider">
                        {worker.experienceYears} Yrs
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a 
                    href={`/workers/${worker._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}