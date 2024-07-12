import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(180deg, #333333, #000000);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  z-index: 1000;
  color: white;
  transition: top 0.3s ease-in-out;
`;

const Logo = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const GreetingMessage = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const ProfileIcon = styled.img`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const NotificationBell = styled.div`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    right: 70px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    right: 60px;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

const Header = () => {
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState(0);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-refresh-token': refreshToken,
          },
        });

        const newToken = response.headers['x-access-token'];
        const newRefreshToken = response.headers['x-refresh-token'];
        if (newToken && newRefreshToken) {
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-refresh-token': refreshToken,
          },
        });

        console.log('Raw response data:', response);

        const newToken = response.headers['x-access-token'];
        const newRefreshToken = response.headers['x-refresh-token'];
        if (newToken && newRefreshToken) {
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        if (response.data.notifications && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications.length);
          console.log('Notifications fetched:', response.data.notifications);
        } else {
          console.warn('Unexpected notifications data structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    fetchUserData();
    fetchNotifications();
    setGreeting(getGreeting());

    const handleScroll = () => {
      const header = document.getElementById('header');
      let lastScrollY = window.scrollY;

      window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY) {
          header.style.top = '-70px'; // hide
        } else {
          header.style.top = '0'; // show
        }
        lastScrollY = window.scrollY;
      });
    };

    handleScroll();
  }, []);

  return (
    <HeaderContainer id="header">
      <Logo onClick={() => window.location.href = '/'}>Nour</Logo>
      <GreetingMessage aria-label={`Greeting message: ${greeting}, ${user.firstName || 'User'}`}>
        {greeting}, <span className="username">{user.firstName || 'User'}</span>
      </GreetingMessage>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NotificationBell onClick={() => window.location.href = '/notifications'}>
          <i className="fa fa-bell"></i>
          {notifications > 0 && <NotificationBadge>{notifications}</NotificationBadge>}
        </NotificationBell>
        <ProfileIcon 
          src={user.profileImage || 'path/to/default-profile.jpg'} 
          alt="User profile" 
          onClick={() => window.location.href = '/profile'} 
          aria-label="User profile"
        />
      </div>
    </HeaderContainer>
  );
};

export default Header;
