import React, { useEffect, useState } from "react";

const HRDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications/candidates");
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading candidates...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Candidates Ranked by Match Percentage</h2>
      {candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Job Title</th>
              <th className="border px-4 py-2 text-left">Match %</th>
              <th className="border px-4 py-2 text-left">Experience</th>
              <th className="border px-4 py-2 text-left">Skills</th>
              <th className="border px-4 py-2 text-left">Location</th>
              <th className="border px-4 py-2 text-left">Applied At</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{candidate.firstName} {candidate.lastName}</td>
                <td className="border px-4 py-2">{candidate.email}</td>
                <td className="border px-4 py-2">{candidate.jobTitle}</td>
                <td className="border px-4 py-2">{candidate.matchPercentage}%</td>
                <td className="border px-4 py-2 whitespace-pre-wrap">{candidate.experience}</td>
                <td className="border px-4 py-2 whitespace-pre-wrap">{candidate.skills}</td>
                <td className="border px-4 py-2">{candidate.location}</td>
                <td className="border px-4 py-2">{new Date(candidate.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HRDashboard;
