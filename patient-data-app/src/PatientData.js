import React, { useState, useEffect } from 'react';

const PatientData = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5216/api/PatientData/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPatients(data);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Patient Data</h1>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Admitted Date</th>
            <th>Discharge Date</th>
            <th>Heart Rate</th>
            <th>Data Stored DateTime</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.PatientId}>
              <td>{patient.PatientId}</td>
              <td>{patient.FirstName}</td>
              <td>{patient.LastName}</td>
              <td>{new Date(patient.AdmittedDate).toLocaleString()}</td>
              <td>{patient.DischargeDate ? new Date(patient.DischargeDate).toLocaleString() : 'N/A'}</td>
              <td>{patient.HeartRate}</td>
              <td>{new Date(patient.DataStoredDateTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientData;
