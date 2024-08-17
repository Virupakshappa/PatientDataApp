# Patient Data Monitoring Application

This project is a real-time patient data monitoring application that streams patient information from a C# backend to a React frontend using Server-Sent Events (SSE). The patient data includes details such as patient ID, first name, last name, admitted date, discharge date, heart rate, and the date and time when the data was stored.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Running the Backend (C#)](#running-the-backend-c)
- [Running the Frontend (React)](#running-the-frontend-react)

## Features

- Real-time streaming of patient data using Server-Sent Events (SSE).
- Display of patient data in a user-friendly table format.
- Backend implemented with ASP.NET Core.
- Frontend implemented with React.

## Technologies Used

- **Backend**: C# with ASP.NET Core
- **Frontend**: React
- **Database**: YugabyteDB (Optional for storing real-time data)
- **Communication**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- **.NET SDK**: To run the C# backend.
- **Node.js and npm**: To run the React frontend.
- **YugabyteDB**: (Optional) For storing patient data.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Virupakshappa/patient-data-app.git
   cd patient-data-app
   ```
