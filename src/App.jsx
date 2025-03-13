import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Component/Hero";
import JobList from "./Component/Jobs/Joblist";
import JobApplication from "./Component/Jobs/Jobapplication"; // Import Job Application Form
import Navbar from "./Component/Navbar";
import NotFound from "./Component/RouteNootFound";
import ApplicationsList from "./Component/Jobs/ApplicationsList";

function App() {
  return (
    <Router>
      <Navbar />
      <ApplicationsList/>
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



        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
