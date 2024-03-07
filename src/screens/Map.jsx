import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import tiledGrid from '../assets/tiled_grid.json';

function MapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  console.log('hello');

  console.log('tiledGrid', tiledGrid);

  useEffect(() => {
    if (mapRef.current && !map) {
      // Initialize the map
      const initializedMap = L.map(mapRef.current).setView([43.7042, -72.2896], 17);

      // Add OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution:
        //     '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        //     + ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
        maxZoom: 18,
      }).addTo(initializedMap);

      // Add a marker
      // L.marker([51.505, -0.09]).addTo(initializedMap)
      //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      //   .openPopup();

      const polygonStyle = {
        color: 'blue',
        weight: 1,
        opacity: 0.5,
      };

      L.geoJSON(tiledGrid, {
        style() {
          return polygonStyle;
        },
      }).addTo(initializedMap);

      // Store the map instance
      setMap(initializedMap);
    }

    // Cleanup on component unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]); // Depend on `map` to ensure cleanup and prevent reinitialization

  return <div id="map" ref={mapRef} style={{ height: '40rem', width: '100%' }} />;
}

export default MapComponent;
