import React from 'react';
import axios from 'axios';

const WhoopSync = () => {
  const handleSync = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/whoop/sync`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Whoop data synced successfully', response.data);
    } catch (error) {
      console.error('Failed to sync Whoop data', error);
    }
  };

  return (
    <button onClick={handleSync}>Sync Whoop Data</button>
  );
};

export default WhoopSync;
