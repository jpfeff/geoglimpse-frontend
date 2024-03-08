/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// import tiledGrid from '../../assets/hex_grid13_smaller_area.json';
import tiledGrid from '../../assets/hex_grid_test.json';

function MapComponent({ mode }) {
  const mapRef = useRef(null);
  const tileFrequency = useSelector((state) => state.user.tileFrequency);
  const [map, setMap] = useState(null);
  const geojsonLayerRef = useRef(null);

  // DISCRETE FUNCTION
  const colorStops = [
    { offset: 0.0, color: '#2c7bb6' },
    { offset: 0.125, color: '#00a6ca' },
    { offset: 0.25, color: '#00ccbc' },
    { offset: 0.375, color: '#90eb9d' },
    { offset: 0.5, color: '#ffff8c' },
    { offset: 0.625, color: '#f9d057' },
    { offset: 0.75, color: '#f29e2e' },
    { offset: 0.875, color: '#e76818' },
    { offset: 1.0, color: '#d7191c' },
  ];

  const getColorForFrequency = (frequency) => {
    const maxFrequency = 10;
    const normalizedFrequency = Math.min(frequency / maxFrequency, 1);

    // Find the two color stops between which the frequency falls
    for (let i = 1; i < colorStops.length; i++) {
      if (normalizedFrequency <= colorStops[i].offset) {
        const lowerStop = colorStops[i - 1];
        const upperStop = colorStops[i];

        const ratio = (normalizedFrequency - lowerStop.offset) / (upperStop.offset - lowerStop.offset);

        // Function to interpolate between two colors
        const interpolateColor = (color1, color2, ratio) => {
          const hex = (color) => color.match(/#(..)(..)(..)/).slice(1).map((v) => parseInt(v, 16));

          const c1 = hex(color1);
          const c2 = hex(color2);

          const ci = c1.map((c, i) => Math.round(c + (c2[i] - c) * ratio));
          return `rgb(${ci[0]}, ${ci[1]}, ${ci[2]})`;
        };

        return interpolateColor(lowerStop.color, upperStop.color, ratio);
      }
    }

    // Return the last color stop if frequency exceeds maxFrequency
    return colorStops[colorStops.length - 1].color;
  };

  useEffect(() => {
    if (!mapRef.current) return;
    // Directly check if the map container already has a Leaflet instance

    if (!mapRef.current._leaflet_id) {
      const initializedMap = L.map(mapRef.current, {
        // set max zoom level to 18
        minZoom: 15.5,
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5,
      });

      initializedMap.setView([43.7051218896, -72.2881465766], 15.5);
      initializedMap.setMaxBounds(initializedMap.getBounds());

      console.log('Initialized map', initializedMap.getBounds());

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(initializedMap);

      setMap(initializedMap);
    }
  }, []);

  useEffect(
    () => {
    // add the geojson layer here
      if (!map) return;

      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
        geojsonLayerRef.current = null;
      }

      console.time('Total Color Calculation Time');
      const createGeoJsonLayer = () => L.geoJSON(tiledGrid, {
        renderer: L.canvas(),
        style: (feature) => {
          const index = tiledGrid.features.indexOf(feature) + 1;

          // handle heat map mode
          if (mode === 'Heat Map') {
            const frequency = tileFrequency[index.toString()] || 0;
            const color = getColorForFrequency(frequency);

            return {
              color,
              fillColor: color,
              fillOpacity: 0.5,
              opacity: 0.2,
              weight: 1,
            };
          }

          // handle unlocked area mode
          let frequency = tileFrequency[index.toString()] || 0;
          frequency = Math.floor(frequency);

          if (frequency === 0) {
            return {
              color: 'black',
              fillOpacity: 0.92,
              weight: 1,
              opacity: 1,
            };
          }
          return {
            color: 'black',
            fillOpacity: 0,
            weight: 1,
            opacity: 0,
          };
        },
      });

      console.timeEnd('Total Color Calculation Time');

      console.time('Total GeoJSON Layer Creation Time');
      const newGeojsonLayer = createGeoJsonLayer();
      newGeojsonLayer.addTo(map);
      geojsonLayerRef.current = newGeojsonLayer;
      console.timeEnd('Total GeoJSON Layer Creation Time');
    },
    [mode, tileFrequency, map],
  );

  return <div id="map" ref={mapRef} style={{ height: '42rem', width: '50rem' }} />;
}

export default MapComponent;