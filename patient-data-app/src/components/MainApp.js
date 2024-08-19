import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import PatientCard from './PatientCard';

function MainApp() {
    const [patients, setPatients] = useState([]);
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    useEffect(() => {
        if (!token) {
            console.error("No token found, redirecting to login.");
            return;
        }

        const eventSource = new EventSource(`http://localhost:5216/api/PatientData/stream?token=${token}`);

        eventSource.onmessage = function (event) {
            const newPatientData = JSON.parse(event.data);

            setPatients(newPatientData); // Set the entire array of patients
        };

        eventSource.onerror = function (err) {
            console.error('EventSource failed:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [token]);

    return (
        <Layout>
            {patients.map((patient) => (
                <PatientCard key={patient.PatientId} patient={patient} />
            ))}
        </Layout>
    );
}

export default MainApp;
