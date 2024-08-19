// src/components/HeartRateChart.js
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function HeartRateChart({ heartRateData }) {
  const chartRef = useRef();

  const data = {
    labels: heartRateData.map((_, index) => index), // X-axis labels (time points)
    datasets: [
      {
        label: 'Heart Rate',
        data: heartRateData, // Y-axis data (heart rates)
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
        min: 40,
        max: 120,
      },
      x: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [heartRateData]);

  return <Line ref={chartRef} data={data} options={options} />;
}

export default HeartRateChart;
