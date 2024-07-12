import React, { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid var(--light-gray);
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: var(--spacing-small) var(--spacing-medium);
  cursor: pointer;
  font-size: var(--font-size-body1);
  color: var(--black);

  &.active {
    border-bottom: 2px solid var(--primary-color);
    font-weight: bold;
  }
`;

const TabContent = styled.div`
  padding: var(--spacing-medium);
`;

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].title);

  return (
    <>
      <TabsContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.title}
            className={tab.title === activeTab ? 'active' : ''}
            onClick={() => setActiveTab(tab.title)}
          >
            {tab.title}
          </Tab>
        ))}
      </TabsContainer>
      <TabContent>
        {tabs.map(tab => tab.title === activeTab && <div key={tab.title}>{tab.content}</div>)}
      </TabContent>
    </>
  );
};

export default Tabs;
