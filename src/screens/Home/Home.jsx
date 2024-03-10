/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Segmented, Button, Radio, Statistic,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/MapComponent/MapComponent';
import { logout } from '../../redux/userSlice';
import './index.scss';
import tiledGrid from '../../assets/hex_grid_test.json';
import LatLngToAddress from '../../utils/geocoder';

function Home() {
  const [mode, setMode] = useState('Unlocked Area');
  const [baseLayer, setBaseLayer] = useState('default');
  const [address, setAddress] = useState('Unknown');
  const [numPlacesVisited, setNumPlacesVisited] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const places = useSelector((state) => state.places.places);

  console.log('user', user);

  const getMax = (obj) => {
    let max = 0;
    let maxKey = 0;
    Object.keys(obj).forEach((key) => {
      if (obj[key] > max) {
        max = obj[key];
        maxKey = key;
      }
    });
    return maxKey;
  };

  const getLatLingForTile = (tileIndex) => {
    const newIndex = parseInt(tileIndex, 10) + 1;
    console.log(tiledGrid.features[1]);
    const tile = tiledGrid.features[newIndex + 1];
    const lng = tile.properties.longitude;
    const lat = tile.properties.latitude;
    return [lat, lng];
  };

  const getAddress = async () => {
    const maxTileIndex = getMax(user.tileFrequency);
    const latLng = getLatLingForTile(maxTileIndex);
    console.log('latLng', latLng);
    const resultAddress = await LatLngToAddress(latLng[0], latLng[1]);
    // const resultAddress = await LatLngToAddress(43.710864, -72.287812);
    setAddress(resultAddress);
  };

  useEffect(() => {
    if (Object.keys(user.tileFrequency).length > 0) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (places.length > 0) {
      const filteredPlaces = places.filter(
        (place) => place.discoveredBy.some(
          (discovery) => discovery.user && discovery.user._id === user._id,
        ),
      );

      setNumPlacesVisited(filteredPlaces.length);
    }
  }, [places]);

  const onLogOut = () => {
    navigate('/login');
    dispatch(logout());
  };

  const onChange = (e) => {
    setBaseLayer(e.target.value);
  };

  return (
    <div className="home-wrapper">
      <div className="header">
        <h1>Welcome to GeoGlimpse!</h1>
        <Button type="primary" onClick={onLogOut}>Log out</Button>
      </div>

      <div className="home-content">
        <div className="home-content-left">
          <Segmented
            options={['Unlocked Area', 'Heat Map']}
            onChange={(value) => {
              setMode(value);
            }}
            style={{ marginBottom: '1rem', marginRight: '2rem' }}
          />
          <Radio.Group
            onChange={onChange}
            defaultValue="default"
            value={baseLayer}
          >
            <Radio value="default">Default</Radio>
            <Radio value="satellite">Satellite</Radio>
            <Radio value="simple">Simple</Radio>
            <Radio value="watercolor">Watercolor</Radio>
          </Radio.Group>
          <MapComponent mode={mode} baseLayer={baseLayer} />
        </div>
        <div className="home-content-right">
          <Statistic
            title="Tiles Explored"
            value={Object.keys(user.tileFrequency).length}
            suffix={`/ 40320 (${((Object.keys(user.tileFrequency).length / 40320) * 100).toFixed(2)}%)`}
            loading={Object.keys(user.tileFrequency).length === 0}
          />
          <Statistic
            title="Total Area Explored"
            value={Object.keys(user.tileFrequency).length * 110}
            suffix="m²"
            prefix="~"
            loading={Object.keys(user.tileFrequency).length === 0}
          />
          <Statistic
            title="Places Visited"
            value={numPlacesVisited}
            loading={numPlacesVisited === null}
          />
          <Statistic
            title="Most Time Spent"
            value={address}
            loading={address === 'Unknown'}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
