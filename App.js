import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatModal from './components/ChatModal';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ChatModal />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


