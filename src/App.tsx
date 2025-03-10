import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DisplayFormComponents from './Components/DisplayFormComponents';
import GeneratedForm from './Components/GeneratedForm';
import ThankYouPage from './Components/ThankYouPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayFormComponents />} />
        <Route path="/form" element={<GeneratedForm />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
}

export default App;
