import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: var(--spacing-small);
`;

const ImageCardContainer = styled(CardContainer)`
  padding: 0;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  font-size: var(--font-size-h5);
  margin-bottom: 12px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: var(--font-size-body1);
  color: var(--gray);
  margin-bottom: 12px;
`;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 8px;
  }
`;

const ProfileCardContainer = styled(CardContainer)`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 16px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  font-size: var(--font-size-h5);
  font-weight: var(--font-bold);
`;

const Role = styled.span`
  font-size: var(--font-size-body2);
  color: var(--gray);
`;

const StatisticCardContainer = styled(CardContainer)`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  font-size: 32px;
  color: var(--primary-color);
  margin-right: 16px;
`;

const Statistic = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: var(--font-size-h4);
  font-weight: var(--font-bold);
`;

const StatLabel = styled.span`
  font-size: var(--font-size-body2);
  color: var(--gray);
`;

const Card = ({ type, imageSrc, title, description, actions, avatarSrc, name, role, icon, statValue, statLabel, children }) => {
  switch (type) {
    case 'image':
      return (
        <ImageCardContainer>
          <Image src={imageSrc} alt={title} />
          <Content>
            <Title>{title}</Title>
            <Description>{description}</Description>
            {actions && <Actions>{actions}</Actions>}
          </Content>
        </ImageCardContainer>
      );
    case 'interactive':
      return (
        <CardContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {actions && <Actions>{actions}</Actions>}
        </CardContainer>
      );
    case 'profile':
      return (
        <ProfileCardContainer>
          <Avatar src={avatarSrc} alt={name} />
          <ProfileInfo>
            <Name>{name}</Name>
            <Role>{role}</Role>
          </ProfileInfo>
        </ProfileCardContainer>
      );
    case 'statistic':
      return (
        <StatisticCardContainer>
          <Icon>{icon}</Icon>
          <Statistic>
            <StatValue>{statValue}</StatValue>
            <StatLabel>{statLabel}</StatLabel>
          </Statistic>
        </StatisticCardContainer>
      );
    default:
      return (
        <CardContainer>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {children}
        </CardContainer>
      );
  }
};

export default Card;
