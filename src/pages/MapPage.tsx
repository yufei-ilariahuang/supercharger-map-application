import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles
import 'leaflet/dist/leaflet.css'; // Make sure to import the CSS
import L from 'leaflet'; // Import Leaflet
import MapSuperchargers from './tesla';
import markerIcon from './marker-icon.png'; // Import your custom marker icon
interface Site {
  id: number;
  gps: {
    latitude: number;
    longitude: number;
  };
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const MapWrapper = styled('div')({
  height: '100vh',
  width: '100%',
});

// Create a Leaflet icon instance with your custom icon image
const customIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
});

const MapPage = () => {
  const handleMarkerClick = (site:Site) => {
    console.log('Marker clicked:', site.name);
  };

  return (
    <MapWrapper>
      <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {MapSuperchargers.map((site) => (
          <Marker key={site.id} position={[site.gps.latitude, site.gps.longitude]} icon={customIcon} eventHandlers={{ click: () => handleMarkerClick(site) }}>
            <Popup>
              <div>
                <strong>{site.name}</strong><br />
                {site.address.street}, {site.address.city}, {site.address.state}, {site.address.zip}, {site.address.country}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default MapPage;
