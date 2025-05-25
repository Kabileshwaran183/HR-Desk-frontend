import React, { useEffect, useState } from "react";

const Userlist = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [interviewDates, setInterviewDates] = useState({});
  const [scheduling, setScheduling] = useState({});
  const [errors, setErrors] = useState({}); // For validation errors

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

  const jobTitles = Array.from(
    new Set(applications.map((app) => app.jobTitle).filter(Boolean))
  );

  const filteredApplications = selectedJobTitle
    ? applications.filter(
      (app) =>
        app.jobTitle &&
        app.jobTitle.toLowerCase() === selectedJobTitle.toLowerCase()
    )
    : applications;

  // Sort filtered applications by matchPercentage descending
  const sortedApplications = filteredApplications.slice().sort((a, b) => {
    const aPerc = a.matchPercentage ?? 0;
    const bPerc = b.matchPercentage ?? 0;
    return bPerc - aPerc;
  });

  const validateFields = (app) => {
    const newErrors = {};
    if (!app.email) newErrors.email = "Email is required.";
    if (!app.firstName || !app.lastName)
      newErrors.name = "Full name is required.";
    if (!interviewDates[app._id])
      newErrors.date = "Please select a date and time for the interview.";
    return newErrors;
  };

  const handleSchedule = async (app) => {
    const validationErrors = validateFields(app);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [app._id]: validationErrors }));
      return;
    }

    setErrors((prev) => ({ ...prev, [app._id]: {} })); // Clear errors
    setScheduling((prev) => ({ ...prev, [app._id]: true }));

    try {
      const response = await fetch(
        "https://hr-desk-backend.onrender.com/api/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: app.email,
            name: `${app.firstName} ${app.lastName}`,
            date: interviewDates[app._id],
          }),
        }
      );

      const result = await response.json();
      alert(result.message || "Interview scheduled!");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview.");
    } finally {
      setScheduling((prev) => ({ ...prev, [app._id]: false }));
    }
  };

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

      {/* Job Title Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => setSelectedJobTitle(null)}
          className={`px-4 py-2 rounded ${selectedJobTitle === null
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Show All
        </button>
        {jobTitles.map((title) => (
          <button
            key={title}
            onClick={() => setSelectedJobTitle(title)}
            className={`px-4 py-2 rounded ${selectedJobTitle === title
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-6">
        {sortedApplications.length === 0 ? (
          <p className="text-gray-600">No applications found for this job.</p>
        ) : (
          sortedApplications.map((app) => {
            const appErrors = errors[app._id] || {};
            const isButtonDisabled =
              scheduling[app._id] ||
              !app.email ||
              !app.firstName ||
              !app.lastName ||
              !interviewDates[app._id];

            return (
              <div
                key={app._id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-300 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">
                  {app.firstName} {app.lastName}
                </h2>
                <p className="text-lg font-semibold mb-2 text-purple-700">
                  Job Title: {app.jobTitle || "N/A"}
                </p>
                <h2 className="text-lg font-semibold">
                  <span className="text-green-700">Match Percentage:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white font-semibold ${app.matchPercentage != null
                        ? app.matchPercentage > 75
                          ? "bg-green-600"
                          : app.matchPercentage >= 50
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        : "bg-gray-400"
                      }`}
                  >
                    {app.matchPercentage != null
                      ? `${app.matchPercentage}%`
                      : "N/A"}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                  <div>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {app.phoneNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {app.email}
                    </p>
                    <p>
                      <span className="font-semibold">Year of Graduation:</span>{" "}
                      {app.yearOfGraduation || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {app.gender || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Experience:</span>{" "}
                      {app.experience || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {app.location || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Pincode:</span>{" "}
                      {app.pincode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Skills:</span>{" "}
                      {app.skills || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Resume:</span>{" "}
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold">Match Percentage:</span>{" "}
                      {app.matchPercentage != null
                        ? `${app.matchPercentage}%`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {app.status || "Pending"}
                    </p>
                    <p>
                      <span className="font-semibold">Applied On:</span>{" "}
                      {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Schedule Interview Section */}
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="datetime-local"
                    className={`border p-2 rounded w-full sm:w-auto ${appErrors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    value={interviewDates[app._id] || ""}
                    onChange={(e) =>
                      setInterviewDates({
                        ...interviewDates,
                        [app._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleSchedule(app)}
                    disabled={isButtonDisabled}
                    className={`px-4 py-2 rounded text-white transition ${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {scheduling[app._id] ? "Scheduling..." : "Schedule Interview"}
                  </button>
                </div>

                {/* Inline error messages */}
                <div className="mt-1 text-red-600 text-sm">
                  {appErrors.name && <p>{appErrors.name}</p>}
                  {appErrors.email && <p>{appErrors.email}</p>}
                  {appErrors.date && <p>{appErrors.date}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Userlist;
