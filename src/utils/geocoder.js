import {
  setDefaults,
  // fromAddress,
  fromLatLng,
  // fromPlaceId,
  // setLocationType,
  // geocode,
  // RequestType,
} from 'react-geocode';

const { VITE_MAPS_API_KEY } = import.meta.env;

// Set the API key

setDefaults({
  key: VITE_MAPS_API_KEY,
  language: 'en',
  region: 'es',
});

const LatLngToAddress = async (lat, lng) => {
  try {
    const response = await fromLatLng(lat, lng);
    return response.results[0].formatted_address;
  } catch (error) {
    console.error(error);
    return 'Unknown';
  }
};

export default LatLngToAddress;
