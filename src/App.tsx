import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DisplayFormComponents from './Components/DisplayFormComponents';
import GeneratedForm from './Components/GeneratedForm';
import ThankYouPage from './Components/ThankYouPage';
import Responses from './Components/Responses';
import './App.css'; // Ensure this is imported


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayFormComponents />} />
        <Route path="/form" element={<GeneratedForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/Responses" element={<Responses />} />
      </Routes>
    </Router>
  );
}

export default App;
