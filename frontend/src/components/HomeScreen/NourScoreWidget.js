import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const WidgetContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  padding: 20px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const dataTemplate = {
  labels: ['Calories', 'Proteins', 'Fats', 'Carbs', 'Hydration'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#CCCCCC', '#999999', '#666666', '#333333', '#AAAAAA'],
      hoverBackgroundColor: ['#BBBBBB', '#888888', '#555555', '#222222', '#999999'],
      borderColor: ['#333333', '#333333', '#333333', '#333333', '#333333'],
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw}%`;
        }
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleFont: { size: 14 },
      bodyFont: { size: 12 },
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#333'
    }
  },
  animation: {
    animateScale: true,
    animateRotate: true,
    duration: 500,
    easing: 'easeInOut'
  }
};

const NourScoreWidget = () => {
  const [data, setData] = useState(dataTemplate);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting fetchData");
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token from local storage:", token);

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/nour-score/calculate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Fetch response:", response);

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
          console.log("No content for NourScore");
          return;
        }

        const result = await response.json();
        console.log("Fetched result:", result);

        const { nourScore, individualMetrics } = result;

        setData({
          labels: dataTemplate.labels,
          datasets: [
            {
              ...dataTemplate.datasets[0],
              data: [
                individualMetrics.calories,     // Calories
                individualMetrics.proteins,     // Proteins
                individualMetrics.fats,         // Fats
                individualMetrics.carbs,        // Carbs
                individualMetrics.hydration     // Hydration
              ]
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching NourScore data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated data:", data);
  }, [data]);

  const handleSegmentClick = (e, element) => {
    if (element.length > 0) {
      const index = element[0].index;
      console.log("Segment clicked:", index);
      setModalContent({
        label: data.labels[index],
        value: data.datasets[0].data[index]
      });
    }
  };

  return (
    <WidgetContainer>
      {modalContent && (
        <>
          <Overlay onClick={() => setModalContent(null)} />
          <Modal>
            <h2>{modalContent.label}</h2>
            <p>{modalContent.value}%</p>
            <button onClick={() => setModalContent(null)}>Close</button>
          </Modal>
        </>
      )}
      <Pie data={data} options={{ ...options, onClick: handleSegmentClick }} />
    </WidgetContainer>
  );
};

export default NourScoreWidget;
