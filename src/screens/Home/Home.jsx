import React, { useState } from 'react';
import { Segmented, Button, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../../components/MapComponent/MapComponent';
import { logout } from '../../redux/userSlice';
import './index.scss';

function Home() {
  const [mode, setMode] = useState('Unlocked Area');
  const [baseLayer, setBaseLayer] = useState('default');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogOut = () => {
    navigate('/login');
    dispatch(logout());
  };

  const onChange = (e) => {
    setBaseLayer(e.target.value);
  };

  return (
    <div className="home-wrapper">
      <Button type="primary" onClick={onLogOut}>Log out</Button>
      <Segmented
        options={['Unlocked Area', 'Heat Map']}
        onChange={(value) => {
          setMode(value);
        }}
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
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
  );
}

export default Home;
