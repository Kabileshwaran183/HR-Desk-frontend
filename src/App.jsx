import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Hero from "./Component/Hero";
import JobList from "./Component/Jobs/Joblist";
import JobApplication from "./Component/Jobs/Jobapplication"; // Import Job Application Form
import Navbar from "./Component/Navbar";
import NotFound from "./Component/RouteNootFound";
import Dashboard from "./Component/dashboard/Dashboard";
import Login from "./Component/login/Login";
import Register from "./Component/login/Register";
import PrivateRoute from "./Component/PrivateRoute"; // import it

import JobInterviewManager from "./Component/dashboard/hr/JobInterviewManager";

import HRDashboard from "./Component/dashboard/HRDashboard";
import Analysis from "./Component/dashboard/Analysis";
import Tracking from "./Component/dashboard/Tracking";

import AddApplicant from "./Component/dashboard/AddApplicant";
import AllApplicants from "./Component/dashboard/AllApplicants";
import AllApplicantsPage from "./Component/dashboard/AllApplicants";
import Userlist from "./Component/dashboard/TaskList";

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
        <Route path="/login" element={<Login />} />
        <Route path="/job/:jobTitle" element={<JobInterviewManager />} />
        <Route path="/Dashboard/applicants" element={<AllApplicantsPage />} />
        <Route path="/Dashboard/add-applicant" element={<AddApplicant />} />
        <Route path="/Dashboard/task-list" element={<Userlist />} />
        <Route path="/Dashboard/ranking" element={<HRDashboard />} />
        <Route path="/Dashboard/analytics" element={<Analysis />} />
        <Route path="/Dashboard/tracking" element={<Tracking />} />
        

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
