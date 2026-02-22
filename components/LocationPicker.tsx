'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LocationPickerProps {
  location: { lat: number | null; lng: number | null };
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

function LocationMarker({ location, onLocationChange }: LocationPickerProps) {
  const map = useMapEvents({
    click(e) {
      onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    if (location.lat && location.lng) {
      map.setView([location.lat, location.lng], 14);
    }
  }, [location, map]);

  return location.lat && location.lng ? (
    <Marker position={[location.lat, location.lng]} />
  ) : null;
}

export default function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [error, setError] = useState('');

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => setError(err.message)
    );
  };

  const defaultCenter: [number, number] = location.lat && location.lng 
    ? [location.lat, location.lng] 
    : [51.505, -0.09];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Get Current Location
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="h-64 w-full rounded-lg overflow-hidden border">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker location={location} onLocationChange={onLocationChange} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-500">Click on the map to set location manually</p>
      {location.lat && location.lng && (
        <p className="text-sm text-gray-600">
          Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
