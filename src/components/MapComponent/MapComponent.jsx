/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
// import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

import tiledGrid from '../../assets/tiled_grid.json';

function MapComponent({ mode }) {
  const mapRef = useRef(null);
  const tileFrequency = useSelector((state) => state.user.tileFrequency);

  // CONTINUOUS FUNCTION
  // const getColorForFrequency = (frequency) => {
  //   const maxFrequency = 10;

  //   // scale the frequency to a value between 0 and 1
  //   const normalizedFrequency = Math.min(frequency / maxFrequency, 1);
  //   let red;
  //   let green;
  //   let blue;

  //   if (normalizedFrequency < 0.5) {
  //     const ratio = normalizedFrequency * 2;
  //     // eslint-disable-next-line no-multi-assign
  //     red = green = 255 * ratio;
  //     blue = 255 * (1 - ratio);
  //   } else {
  //     const ratio = (normalizedFrequency - 0.5) * 2;
  //     red = 255;
  //     green = 255 * (1 - ratio);
  //     blue = 0;
  //   }

  //   return `rgb(${red}, ${green}, ${blue})`;
  // };

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
    // Directly check if the map container already has a Leaflet instance
    if (mapRef.current && !mapRef.current._leaflet_id) {
      const initializedMap = L.map(mapRef.current, {
        // set max zoom level to 18
        minZoom: 14.5,
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5,
      });

      initializedMap.setView([43.7100, -72.2896], 14.5);
      initializedMap.setMaxBounds(initializedMap.getBounds());

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(initializedMap);

      if (mode === 'Heat Map') {
        L.geoJSON(tiledGrid, {
          style: (feature) => {
            const index = tiledGrid.features.indexOf(feature);
            const frequency = tileFrequency[index.toString()] || 0;

            return {
              color: 'black',
              fillColor: getColorForFrequency(frequency),
              fillOpacity: 0.5,
              weight: 0,
            };
          },
        }).addTo(initializedMap);
      } else {
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
      }

      // Cleanup function to remove the map when the component unmounts or needs reinitialization
      return () => {
        if (initializedMap) {
          initializedMap.remove();
        }
      };
    }
  }, [tileFrequency, mode]);

  return <div id="map" ref={mapRef} style={{ height: '42rem', width: '80rem' }} />;
}

export default MapComponent;
