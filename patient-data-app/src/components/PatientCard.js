import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HeartRateChart from './HeartRateChart';

function PatientCard({ patient }) {
  const [heartRateData, setHeartRateData] = useState([patient.HeartRate]);

  useEffect(() => {
    setHeartRateData((prevData) => {
      if (prevData.length >= 20) {
        prevData.shift(); // Keep only the last 20 data points for simplicity
      }
      return [...prevData, patient.HeartRate];
    });
  }, [patient.HeartRate]);

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {patient.FirstName} {patient.LastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Patient ID: {patient.PatientId}
        </Typography>
        <Typography variant="body1" color="text.primary">
          Heart Rate: {patient.HeartRate} bpm
        </Typography>
        <HeartRateChart heartRateData={heartRateData} />
      </CardContent>
    </Card>
  );
}

export default PatientCard;
