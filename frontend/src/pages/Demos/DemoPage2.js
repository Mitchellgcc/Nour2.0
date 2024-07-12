// src/pages/DemoPage2.js
import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';  // Import the Button component
import Sidebar from '../../components/Sidebar';
import Breadcrumbs from '../../components/Breadcrumbs';
import Pagination from '../../components/Pagination';
import Tabs from '../../components/Tabs';
import VerticalNavMenu from '../../components/VerticalNavMenu';
import BasicTable from '../../components/Tables/BasicTable';
import DoughnutChart from '../../components/Charts/DoughnutChart';
import AreaChart from '../../components/Charts/AreaChart';
import RadarChart from '../../components/Charts/RadarChart';
import BasicList from '../../components/Lists/BasicList';
import ExpandableList from '../../components/Lists/ExpandableList';
import EditableList from '../../components/Lists/EditableList';
import NestedList from '../../components/Lists/NestedList';
import SelectableList from '../../components/Lists/SelectableList';
import Avatar from '../../components/Misc/Avatar';
import Tooltip from '../../components/Misc/Tooltip';
import Spinner from '../../components/Misc/Spinner';
import ProgressBar from '../../components/Misc/ProgressBar';
import Accordion from '../../components/Misc/Accordion';
import Carousel from '../../components/Misc/Carousel';

const DemoContainer = styled.div`
  padding: var(--spacing-large);
  display: flex;
`;

const DemoSection = styled.div`
  margin-bottom: var(--spacing-large);
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding-left: var(--spacing-large);
`;

const DemoPage2 = () => {
  const sidebarItems = ['Home', 'Profile', 'Settings', 'Logout'];
  const breadcrumbsItems = ['Home', 'Profile', 'Edit'];
  const tabs = [
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'Content for Tab 2' },
    { title: 'Tab 3', content: 'Content for Tab 3' },
  ];
  const tableHeaders = ['Name', 'Age', 'Address'];
  const tableData = [
    ['John Doe', '30', '123 Main St'],
    ['Jane Smith', '25', '456 Oak St'],
    ['Sam Johnson', '40', '789 Pine St']
  ];

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Dataset 1',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const basicListItems = ['Item 1', 'Item 2', 'Item 3'];
  const expandableListItems = [
    { title: 'Item 1', content: 'This is the expanded content for Item 1.' },
    { title: 'Item 2', content: 'This is the expanded content for Item 2.' },
    { title: 'Item 3', content: 'This is the expanded content for Item 3.' }
  ];
  const editableListItems = ['Editable Item 1', 'Editable Item 2', 'Editable Item 3'];
  const nestedListItems = [
    {
      title: 'Parent Item 1',
      children: [
        { title: 'Child Item 1' },
        { title: 'Child Item 2' }
      ]
    },
    {
      title: 'Parent Item 2',
      children: [
        { title: 'Child Item 3' },
        { title: 'Child Item 4' }
      ]
    }
  ];
  const selectableListItems = ['Selectable Item 1', 'Selectable Item 2', 'Selectable Item 3'];

  const carouselItems = [
    <img src="https://via.placeholder.com/600x300" alt="Slide 1" />,
    <img src="https://via.placeholder.com/600x300" alt="Slide 2" />,
    <img src="https://via.placeholder.com/600x300" alt="Slide 3" />
  ];

  const accordionItems = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' }
  ];

  return (
    <DemoContainer>
      <Sidebar items={sidebarItems} />
      <ContentContainer>
        <DemoSection>
          <h2>Breadcrumbs</h2>
          <Breadcrumbs items={breadcrumbsItems} />
        </DemoSection>

        <DemoSection>
          <h2>Pagination</h2>
          <Pagination currentPage={1} totalPages={10} onPageChange={(page) => console.log(page)} />
        </DemoSection>

        <DemoSection>
          <h2>Tabs</h2>
          <Tabs tabs={tabs} />
        </DemoSection>

        <DemoSection>
          <h2>Vertical Navigation Menu</h2>
          <VerticalNavMenu items={sidebarItems} />
        </DemoSection>

        <DemoSection>
          <h2>Basic Table</h2>
          <BasicTable headers={tableHeaders} data={tableData} />
        </DemoSection>

        <DemoSection>
          <h2>Charts</h2>
          <div style={{ height: '300px' }}>
            <h3>Doughnut Chart</h3>
            <DoughnutChart data={data} options={options} />
          </div>
          <div style={{ height: '300px' }}>
            <h3>Area Chart</h3>
            <AreaChart data={data} options={options} />
          </div>
          <div style={{ height: '300px' }}>
            <h3>Radar Chart</h3>
            <RadarChart data={data} options={options} />
          </div>
        </DemoSection>

        <DemoSection>
          <h2>Lists</h2>
          <h3>Basic List</h3>
          <BasicList items={basicListItems} />
          <h3>Expandable List</h3>
          <ExpandableList items={expandableListItems} />
          <h3>Editable List</h3>
          <EditableList items={editableListItems} onEdit={(index, value) => console.log(`Edited item ${index}: ${value}`)} />
          <h3>Nested List</h3>
          <NestedList items={nestedListItems} />
          <h3>Selectable List</h3>
          <SelectableList items={selectableListItems} />
        </DemoSection>

        <DemoSection>
          <h2>Miscellaneous</h2>
          <h3>Avatar</h3>
          <Avatar src="https://via.placeholder.com/150" alt="Avatar" />
          <h3>Tooltip</h3>
          <Tooltip text="This is a tooltip!">
            <Button>Hover me</Button>
          </Tooltip>
          <h3>Spinner</h3>
          <Spinner />
          <h3>Progress Bar</h3>
          <ProgressBar percentage={50} />
          <h3>Accordion</h3>
          <Accordion items={accordionItems} />
          <h3>Carousel</h3>
          <Carousel items={carouselItems} />
        </DemoSection>
      </ContentContainer>
    </DemoContainer>
  );
};

export default DemoPage2;
