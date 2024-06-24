import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile'); // Update this endpoint as needed
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle unauthenticated state, e.g., redirect to login screen
      }
    };

    fetchProfile();
  }, []);

  return (
    <View>
      <Text>Profile</Text>
      {profile ? (
        <View>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          {/* Add other profile information as needed */}
        </View>
      ) : (
        <Text>Loading profile...</Text>
      )}
    </View>
  );
};

export default Profile;
