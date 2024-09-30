import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './UploadPage';
import SearchPage from './SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
