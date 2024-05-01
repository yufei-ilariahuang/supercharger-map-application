import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to import the CSS
import MapSuperchargers from './tesla';

const MapPage: React.FC = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MapSuperchargers.map((site) => (
        <Marker key={site.id} position={[site.gps.latitude, site.gps.longitude]}>
          <Popup>
            <strong>{site.name}</strong><br />
            {site.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapPage;
