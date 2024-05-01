import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface SuperchargerSite {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

const MapPage: React.FC = () => {
  const [superchargerSites, setSuperchargerSites] = useState<SuperchargerSite[]>([]);

  useEffect(() => {
    // Fetch data from the external API
    fetch('https://supercharge.info/service/supercharge/allSites')
      .then(response => response.json())
      .then(data => {
        // Transform data into your desired format if necessary
        const transformedData = data.map((site: any) => ({
          id: site.id.toString(),
          name: site.name,
          location: {
            latitude: site.gps.latitude,
            longitude: site.gps.longitude
          },
          address: site.address.street + ', ' + site.address.city
        }));
        setSuperchargerSites(transformedData);
      })
      .catch(error => console.error('Error fetching supercharger sites:', error));
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {superchargerSites.map(site => (
        <Marker key={site.id} position={[site.location.latitude, site.location.longitude]}>
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
