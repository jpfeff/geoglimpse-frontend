/* eslint-disable consistent-return */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import tiledGrid from '../../assets/tiled_grid.json';

function MapComponent() {
  const mapRef = useRef(null);
  const tileFrequency = useSelector((state) => state.user.tileFrequency);

  useEffect(() => {
    // Directly check if the map container already has a Leaflet instance
    if (mapRef.current && !mapRef.current._leaflet_id) {
      const initializedMap = L.map(mapRef.current).setView([43.7072, -72.2896], 15);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(initializedMap);

      L.geoJSON(tiledGrid, {
        style: (feature) => {
          const index = tiledGrid.features.indexOf(feature);
          const frequency = tileFrequency[index.toString()] || 0;
          const opacity = Math.min(frequency / 10, 1);

          return {
            color: 'black',
            fillOpacity: 1 - opacity,
            weight: 1,
            opacity: 1 - opacity,
          };
        },
      }).addTo(initializedMap);

      // Cleanup function to remove the map when the component unmounts or needs reinitialization
      return () => {
        if (initializedMap) {
          initializedMap.remove();
        }
      };
    }
  }, [tileFrequency]); // React will only re-run the effect if tileFrequency changes

  return <div id="map" ref={mapRef} style={{ height: '40rem', width: '100%' }} />;
}

export default MapComponent;
