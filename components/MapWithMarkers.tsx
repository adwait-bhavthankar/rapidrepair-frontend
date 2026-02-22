'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Worker {
  _id: string;
  user: { username: string };
  serviceCategory: string;
  experienceYears: number;
  location: { lat: number; lng: number };
}

function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  
  return null;
}

export default function MapWithMarkers({ workers }: { workers: Worker[] }) {
  const positions: [number, number][] = workers.map(w => [w.location.lat, w.location.lng]);
  const defaultCenter: [number, number] = positions.length > 0 ? positions[0] : [51.505, -0.09];

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden mb-8 border">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds positions={positions} />
        {workers.map((worker) => (
          <Marker
            key={worker._id}
            position={[worker.location.lat, worker.location.lng]}
          >
            <Popup>
              <div className="text-center min-w-[120px]">
                <h3 className="font-semibold">{worker.user.username}</h3>
                <p className="text-sm">{worker.serviceCategory}</p>
                <p className="text-sm">{worker.experienceYears} years exp.</p>
                <Link 
                  href={`/workers/${worker._id}`}
                  className="text-blue-600 text-sm underline block mt-1"
                >
                  Book Now
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
