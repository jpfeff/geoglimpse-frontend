import React, { useState } from 'react'; // Import useState from React
import { Segmented } from 'antd';
import MapComponent from '../../components/MapComponent/MapComponent';

function Map() {
  const [mode, setMode] = useState('Unlocked Area');

  return (
    <div>
      <Segmented
        options={['Unlocked Area', 'Heat Map']}
        onChange={(value) => {
          setMode(value);
        }}
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      />
      <MapComponent mode={mode} />
    </div>
  );
}

export default Map;
