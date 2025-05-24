# Blockchain Academic Certificates - Enhanced Frontend

This is an enhanced React-based frontend for the Blockchain Academic Certificates project.

## Features

- Modern UI with Bootstrap 5
- React Router for navigation
- Context API for state management
- Protected routes for authentication
- Multiple screens for different user types (students and universities)
- Certificate viewing and verification system
- Responsive design

## Installation

1. First, make sure Node.js and npm are installed on your system

2. Install dependencies:
```bash
cd e:\Blockchain\blockchain-academic-certificates\web-dev\client
npm install
```

3. Rename the enhanced package.json:
```bash
mv package.json.new package.json
```

4. Rename the enhanced App.js:
```bash
mv AppNew.js App.js
```

5. Install additional dependencies:
```bash
npm install bootstrap@5.3.2 bootstrap-icons@1.11.2 react-bootstrap@2.9.1 react-router-dom@6.20.1 axios@1.6.2 html2canvas@1.4.1 jspdf@2.5.1 qrcode.react@3.1.0 react-qr-reader@3.0.0-beta-1
```

## Running the Application

1. Start the backend server in a separate terminal:
```bash
cd e:\Blockchain\blockchain-academic-certificates\web-app
npm start
```

2. Start the React development server:
```bash
cd e:\Blockchain\blockchain-academic-certificates\web-dev\client
npm start
```

This will launch the application at http://localhost:3000.

## Main Pages

- **/** - Home page
- **/login** - Login page for both students and universities
- **/register** - Registration page for both students and universities
- **/verify** - Certificate verification page for public access
- **/student/dashboard** - Student dashboard (requires authentication)
- **/university/dashboard** - University dashboard (requires authentication)
- **/university/issue** - Certificate issuance page for universities
- **/student/certificates** - List of certificates for students
- **/university/certificates** - List of issued certificates for universities

## Project Structure

```
/client
  /components - Reusable components
  /contexts - Context providers for state management
  /pages - Main application pages
  /styles - Custom CSS files
  App.js - Main application component with routing
```

## Notes

- Make sure the backend server is running on port 5000 before starting the frontend
- Image uploads for profiles and university logos require the backend to be properly configured
- All certificate data is retrieved from the blockchain through the backend API
