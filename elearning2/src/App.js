import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LearnerDashboard from "./LearnerDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LearnerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
