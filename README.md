# Patient Data Monitoring Application

This project is a real-time patient data monitoring application that streams patient information from a C# backend to a React frontend using Server-Sent Events (SSE). The application displays patient details such as patient ID, first name, last name, heart rate, and more. Additionally, it visualizes the heart rate data in real-time graphs, enhancing the ability to monitor patient health effectively.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Running the Backend (C#)](#running-the-backend-c)
- [Running the Frontend (React)](#running-the-frontend-react)

## Features

- **Real-Time Streaming**: Streams patient data in real-time using Server-Sent Events (SSE).
- **Interactive UI**: Displays patient data in a user-friendly card format with dynamic content.
- **Real-Time Graphs**: Visualizes heart rate data for each patient in real-time, using responsive and interactive graphs.
- **Component-Based Architecture**: Both frontend and backend are modular and easy to maintain.
- **Scalable Backend**: Built with ASP.NET Core, providing a scalable and robust API.
- **Responsive Frontend**: Implemented with React and Material-UI, ensuring a responsive and customizable user interface.

## Technologies Used

- **Backend**: C# with ASP.NET Core
- **Frontend**: React, Material-UI, react-chartjs-2, Chart.js
- **Database**: YugabyteDB (Optional for storing real-time data)
- **Communication**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- **.NET SDK**: Required to run the C# backend.
- **Node.js and npm**: Required to run the React frontend.
- **YugabyteDB**: (Optional) Required if you plan to store patient data.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Virupakshappa/patient-data-app.git
   cd patient-data-app
   ```
