import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import PatientCard from './PatientCard';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function MainApp() {
    const [patients, setPatients] = useState([]);
    const [isStoringData, setIsStoringData] = useState(false); // Track if data is being stored
    const [loading, setLoading] = useState(false); // Track loading state
    const [notification, setNotification] = useState({ open: false, message: '' }); // Snackbar notification
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const startTimeoutRef = useRef(null); // Ref to store the timeout ID

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

    const handleStartStoring = async () => {
        setLoading(true);
        let hasResponded = false;

        // Create a timeout that assumes success if no response is received
        startTimeoutRef.current = setTimeout(() => {
            if (!hasResponded) {
                console.log('No response received, assuming data storing has started.');
                setIsStoringData(true);
                setNotification({ open: true, message: 'Data is being stored to the database' });
                setLoading(false); // Make sure to stop loading
            }
        }, 2000); // Timeout after 2 seconds

        try {
            const response = await axios.get('http://localhost:5225/api/SSEReceiver/start', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            hasResponded = true; // Mark that a response was received
            clearTimeout(startTimeoutRef.current); // Clear the timeout since we got a response

            // if (response.status === 204 || response.status === 200) {
            //     console.log('Data storing started:', response.data);
            //     setIsStoringData(true);
            //     setNotification({ open: true, message: 'Data is being stored to the database' });
            // } else
            if(response.error)
             {
                console.error('Unexpected response status:', response.status);
                setNotification({ open: true, message: 'Unexpected response while starting data storage' });
            }
        } catch (error) {
            hasResponded = true; // Mark that a response was received, even if it's an error
            clearTimeout(startTimeoutRef.current); // Clear the timeout since we got a response
            console.error('Error starting data storage:', error);
            setNotification({ open: true, message: 'Failed to start data storage' });
        } finally {
            if (!hasResponded) {
                setLoading(false); // Ensure loading is stopped in the timeout
            }
        }
    };

    const handleStopStoring = async () => {
        setLoading(true);

        // Clear any ongoing start timeout if user clicks stop
        if (startTimeoutRef.current) {
            clearTimeout(startTimeoutRef.current);
        }

        try {
            const response = await axios.get('http://localhost:5225/api/SSEReceiver/stop', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Data storing stopped:', response.data);
            setIsStoringData(false);
            setNotification({ open: true, message: 'Data storage has been stopped' });
        } catch (error) {
            console.error('Error stopping data storage:', error);
            setNotification({ open: true, message: 'Failed to stop data storage' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification({ open: false, message: '' });
    };

    return (
        <Layout>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={isStoringData ? handleStopStoring : handleStartStoring}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={24} style={{ marginRight: '10px' }} />
                            {isStoringData ? 'Stopping...' : 'Storing...'}
                        </>
                    ) : (
                        isStoringData ? 'Stop Storing' : 'Store Data to DB'
                    )}
                </Button>
            </div>
            {patients.map((patient) => (
                <PatientCard key={patient.PatientId} patient={patient} />
            ))}

            {/* Snackbar for notifications */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notification.message}
            />
        </Layout>
    );
}

export default MainApp;
