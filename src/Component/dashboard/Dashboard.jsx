import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 border-b-2 border-blue-300 pb-2">
        Applicants Dashboard
      </h1>
      {loading && <p className="text-gray-600">Loading applications...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && applications.length === 0 && (
        <p className="text-gray-600">No applications found.</p>
      )}
      <div className="flex flex-col space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:shadow-lg transition-shadow duration-300"
          >
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                {app.firstName} {app.lastName}
              </h2>
              <p className="text-lg font-semibold mb-2 text-purple-700">Job Title: {app.jobTitle || "N/A"}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                <div>
                  <p><span className="font-semibold">Phone:</span> {app.phoneNumber || "N/A"}</p>
                  <p><span className="font-semibold">Email:</span> {app.email}</p>
                  <p><span className="font-semibold">Year of Graduation:</span> {app.yearOfGraduation || "N/A"}</p>
                  <p><span className="font-semibold">Gender:</span> {app.gender || "N/A"}</p>
                  <p><span className="font-semibold">Experience:</span> {app.experience || "N/A"}</p>
                  <p><span className="font-semibold">Location:</span> {app.location || "N/A"}</p>
                  <p><span className="font-semibold">Pincode:</span> {app.pincode || "N/A"}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Skills:</span> {app.skills || "N/A"}</p>
                  <p><span className="font-semibold">Resume:</span> {app.resume || "N/A"}</p>
                  <p><span className="font-semibold">Status:</span> {app.status || "Pending"}</p>
                  <p><span className="font-semibold">Applied On:</span> {new Date(app.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
