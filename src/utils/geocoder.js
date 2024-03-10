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

console.log('VITE_MAPS_API_KEY', VITE_MAPS_API_KEY);

console.log('MAPS_API_KEY', VITE_MAPS_API_KEY);

const LatLngToAddress = async (lat, lng) => {
  console.log('lat', lat);
  console.log('lng', lng);
  try {
    const response = await fromLatLng(lat, lng);
    console.log('response', response.results[0].formatted_address);
    console.log('fillResponse', response);
    return response.results[0].formatted_address;
  } catch (error) {
    console.error(error);
    return 'Unknown';
  }
};

export default LatLngToAddress;
