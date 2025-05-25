import React, { useEffect, useState } from "react";

const HRDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://hr-desk-backend.onrender.com/api/jobapplications",
        {
          method: "GET",
          credentials: "include", // if your backend uses cookies/auth
        }
      );
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();

      // Sort by descending matchPercentage
      const sortedData = data.sort(
        (a, b) => (Number(b.matchPercentage) || 0) - (Number(a.matchPercentage) || 0)
      );

      setCandidates(sortedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(
        `https://hr-desk-backend.onrender.com/api/jobapplications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete candidate");
      }

      // Update UI by removing deleted candidate
      setCandidates((prev) => prev.filter((candidate) => candidate._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading candidates...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        Candidates Ranked by Match Percentage
      </h2>

      {candidates.length === 0 ? (
        <p className="text-center">No candidates found.</p>
      ) : (
        <div
          className="grid gap-6
                     grid-cols-1
                     sm:grid-cols-2
                     md:grid-cols-3
                     lg:grid-cols-4"
        >
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <span className="text-sm font-medium text-indigo-600">
                  Match: {candidate.matchPercentage ?? "N/A"}%
                </span>
              </div>

              <p>
                <strong>Email:</strong> {candidate.email}
              </p>
              <p>
                <strong>Job Title:</strong> {candidate.jobTitle}
              </p>
              <p>
                <strong>Experience:</strong> {candidate.experience}
              </p>
              <p>
                <strong>Skills:</strong> {candidate.skills}
              </p>
              <p>
                <strong>Location:</strong> {candidate.location}
              </p>
              <p className="text-sm text-gray-500 mt-auto">
                Applied at: {new Date(candidate.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(candidate._id)}
                disabled={deletingId === candidate._id}
                className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === candidate._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
