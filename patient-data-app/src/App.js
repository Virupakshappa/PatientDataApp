import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PatientCard from './components/PatientCard';


function App() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5216/api/PatientData/stream');

    eventSource.onmessage = function (event) {
      const newPatientData = JSON.parse(event.data);

      console.log("Received patient data:", newPatientData);

      // Assuming newPatientData is an array of patient objects
      setPatients(newPatientData);
    };

    eventSource.onerror = function (err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Layout>
      {patients.map((patient) => (
        <PatientCard key={patient.PatientId} patient={patient} />
      ))}
    </Layout>
  );
}

export default App;
