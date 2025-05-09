import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Component/Hero";
import JobList from "./Component/Jobs/Joblist";
import JobApplication from "./Component/Jobs/Jobapplication"; // Import Job Application Form
import Navbar from "./Component/Navbar";
import NotFound from "./Component/RouteNootFound";
import Dashboard from "./Component/dashboard/Dashboard";
import Login from "./Component/login/Login";
import Register from "./Component/login/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <JobList />
            </>
          }
        />
        <Route path="/apply/:id" element={<JobApplication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
