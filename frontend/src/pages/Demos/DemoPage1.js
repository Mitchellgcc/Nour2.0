// src/pages/DemoPage1.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import Card from '../../components/Card';
import InputField from '../../components/FormElements/InputField';
import SelectDropdown from '../../components/FormElements/SelectDropdown';
import RadioButton from '../../components/FormElements/RadioButton';
import Checkbox from '../../components/FormElements/Checkbox';
import Textarea from '../../components/FormElements/Textarea';
import DatePicker from '../../components/FormElements/DatePicker';
import ToggleSwitch from '../../components/FormElements/ToggleSwitch';
import FileUpload from '../../components/FormElements/FileUpload';
import BasicModal from '../../components/Modals/BasicModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import FormModal from '../../components/Modals/FormModal';
import ToastNotification from '../../components/Notifications/ToastNotification';
import AlertBanner from '../../components/Notifications/AlertBanner';
import Snackbar from '../../components/Notifications/Snackbar';
import InlineNotification from '../../components/Notifications/InlineNotification';
import NotificationBadge from '../../components/Notifications/NotificationBadge';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import Avatar from '../../components/Misc/Avatar';
import Tooltip from '../../components/Misc/Tooltip';
import Spinner from '../../components/Misc/Spinner';
import ProgressBar from '../../components/Misc/ProgressBar';
import Accordion from '../../components/Misc/Accordion';
import Carousel from '../../components/Misc/Carousel';

const DemoContainer = styled.div`
  padding: var(--spacing-large);
`;

const DemoSection = styled.div`
  margin-bottom: var(--spacing-large);
`;

const DemoPage1 = () => {
  const [radioValue, setRadioValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

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
      <DemoSection>
        <h2>Buttons</h2>
        <Button onClick={() => setIsBasicModalOpen(true)}>Open Basic Modal</Button>
        <Button type="secondary" onClick={() => setIsConfirmationModalOpen(true)}>Open Confirmation Modal</Button>
        <Button type="loading" loading={true}>Loading Button</Button>
        <Button type="secondary" onClick={() => setShowToast(true)}>Show Toast</Button>
        <Button type="secondary" onClick={() => setShowSnackbar(true)}>Show Snackbar</Button>
      </DemoSection>

      <DemoSection>
        <h2>Modals</h2>
        <BasicModal isOpen={isBasicModalOpen} onClose={() => setIsBasicModalOpen(false)}>
          <p>This is a basic modal.</p>
        </BasicModal>
        <ConfirmationModal 
          isOpen={isConfirmationModalOpen} 
          onClose={() => setIsConfirmationModalOpen(false)} 
          onConfirm={() => alert('Confirmed!')} 
          message="Are you sure?"
        />
        <Button onClick={() => setIsFormModalOpen(true)}>Open Form Modal</Button>
        <FormModal 
          isOpen={isFormModalOpen} 
          onClose={() => setIsFormModalOpen(false)} 
          onSubmit={(data) => alert(`Submitted: ${JSON.stringify(data)}`)}
        />
      </DemoSection>

      <DemoSection>
        <h2>Notifications</h2>
        {showAlert && <AlertBanner message="This is an alert banner!" onClose={() => setShowAlert(false)} />}
        {showToast && <ToastNotification message="This is a toast notification!" onClose={() => setShowToast(false)} />}
        {showSnackbar && <Snackbar message="This is a snackbar notification!" onClose={() => setShowSnackbar(false)} />}
        <InlineNotification message="This is an inline notification!" onClose={() => {}} />
        <NotificationBadge count={5}>
          <Button>Notifications</Button>
        </NotificationBadge>
      </DemoSection>

      <DemoSection>
        <h2>Cards</h2>
        <Card type="basic" title="Basic Card" description="This is a basic card.">
          <p>Additional content here.</p>
        </Card>
        <Card type="image" imageSrc="https://via.placeholder.com/400x200" title="Image Card" description="This is an image card." />
        <Card type="interactive" title="Interactive Card" description="This is an interactive card." actions={<Button>Action</Button>} />
        <Card type="profile" avatarSrc="https://via.placeholder.com/64" name="John Doe" role="Software Engineer" />
        <Card type="statistic" icon={<i className="fa fa-chart-bar"></i>} statValue="95%" statLabel="Success Rate" />
      </DemoSection>

      <DemoSection>
        <h2>Form Elements</h2>
        <div>
          <label>Input Field:</label>
          <InputField placeholder="Enter text" />
        </div>
        <div>
          <label>Select Dropdown:</label>
          <SelectDropdown
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' }
            ]}
          />
        </div>
        <div>
          <label>Radio Buttons:</label>
          <RadioButton name="radioGroup" value="option1" checked={radioValue === 'option1'} onChange={() => setRadioValue('option1')} label="Option 1" />
          <RadioButton name="radioGroup" value="option2" checked={radioValue === 'option2'} onChange={() => setRadioValue('option2')} label="Option 2" />
        </div>
        <div>
          <label>Checkbox:</label>
          <Checkbox name="checkbox" checked={checkboxValue} onChange={() => setCheckboxValue(!checkboxValue)} label="Check me" />
        </div>
        <div>
          <label>Textarea:</label>
          <Textarea placeholder="Enter text here" />
        </div>
        <div>
          <label>Date Picker:</label>
          <DatePicker />
        </div>
        <div>
          <label>Toggle Switch:</label>
          <ToggleSwitch checked={toggleValue} onChange={() => setToggleValue(!toggleValue)} />
        </div>
        <div>
          <label>File Upload:</label>
          <FileUpload />
        </div>
      </DemoSection>

      <DemoSection>
        <h2>Charts</h2>
        <div style={{ height: '300px' }}>
          <h3>Line Chart</h3>
          <LineChart data={data} options={options} />
        </div>
        <div style={{ height: '300px' }}>
          <h3>Bar Chart</h3>
          <BarChart data={data} options={options} />
        </div>
        <div style={{ height: '300px' }}>
          <h3>Pie Chart</h3>
          <PieChart data={data} options={options} />
        </div>
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
    </DemoContainer>
  );
};

export default DemoPage1;
