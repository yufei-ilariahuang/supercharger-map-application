import React, { DependencyList, EffectCallback,useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { styled } from '@mui/material/styles';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from './marker-icon.png';
import isEqual from 'lodash/isEqual';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Site {
  id: number;
  gps: {
    latitude: number;
    longitude: number;
  };
  name: string;
  address: Address;
}


const MapWrapper = styled('div')({
  height: '100vh',
  width: '100%',
});

const customIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

/** 
 * Before running the effect, it checks if the current dependencies are different from the last stored ones using isEqual from lodash. 
 * mapBounds is only updated if the actual coordinates change, rather than being recreated on every render
*/

const useDeepCompareEffect = (effect: EffectCallback, dependencies: DependencyList) => {
  const currentDependenciesRef = useRef<DependencyList>();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    console.log("Dependencies changed, effect will run");
    currentDependenciesRef.current = dependencies;
  } else {
    console.log("Dependencies did not change, effect will not run");
  }

  useEffect(effect, [currentDependenciesRef.current]);
}

const MapPage = () => {
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);

  useDeepCompareEffect(() => {
    fetch('https://supercharge.info/service/supercharge/allSites')
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((site: any)  => ({
          id: site.id,
          name: site.name,
          gps: site.gps,
          address: site.address
        }));
        setMarkers(transformedData);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching supercharger sites:', error);
        
      });
  }, []); // Add dependencies here if needed

  const handleMarkerClick = (site: Site) => {
    console.log('Marker clicked:', site.name);
  };

  return (
    <MapWrapper>
      <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {error ? <div>Error: {error}</div> :
          markers.map((site: Site) => (
            <Marker key={site.id} position={[site.gps.latitude, site.gps.longitude]} icon={customIcon} eventHandlers={{ click: () => handleMarkerClick(site) }}>
              <Popup>
                <strong>{site.name}</strong><br />
                {site.address.street}, {site.address.city}, {site.address.state}, {site.address.zip}, {site.address.country}
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </MapWrapper>
  );
};

export default MapPage;
