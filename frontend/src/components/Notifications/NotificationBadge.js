// src/components/Notifications/NotificationBadge.js
import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
`;

const NotificationBadge = ({ count, children }) => (
  <BadgeContainer>
    {children}
    {count > 0 && <Badge>{count}</Badge>}
  </BadgeContainer>
);

export default NotificationBadge;
