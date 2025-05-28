import React, { useEffect, useState } from "react";

const JobinterviewManger = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJobTitle, setSelectedJobTitle] = useState(null);
    const [interviewDates, setInterviewDates] = useState({});
    const [scheduling, setScheduling] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications");
                if (!response.ok) throw new Error("Failed to fetch applications");
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

    const sortedApplications = filteredApplications
        .slice()
        .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));

    const validateFields = (app) => {
        const newErrors = {};
        if (!app.email) newErrors.email = "Email is required.";
        if (!app.firstName || !app.lastName) newErrors.name = "Full name is required.";
        if (!interviewDates[app._id]) newErrors.date = "Interview date is required.";
        return newErrors;
    };

    const handleSchedule = async (app) => {
        const validationErrors = validateFields(app);
        if (Object.keys(validationErrors).length > 0) {
            setErrors((prev) => ({ ...prev, [app._id]: validationErrors }));
            return;
        }

        setErrors((prev) => ({ ...prev, [app._id]: {} }));
        setScheduling((prev) => ({ ...prev, [app._id]: true }));

        try {
            const response = await fetch("https://hr-desk-backend.onrender.com/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: app.email,
                    name: `${app.firstName} ${app.lastName}`,
                    date: interviewDates[app._id],
                }),
            });

            const result = await response.json();
            alert(result.message || "Interview scheduled!");
        } catch (error) {
            console.error("Scheduling error:", error);
            alert("Failed to schedule interview.");
        } finally {
            setScheduling((prev) => ({ ...prev, [app._id]: false }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Applicants Dashboard</h1>

            {/* Job Title Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
                <button
                    onClick={() => setSelectedJobTitle(null)}
                    className={`px-4 py-2 rounded-full font-medium ${selectedJobTitle === null
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
                        className={`px-4 py-2 rounded-full font-medium ${selectedJobTitle === title
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {title}
                    </button>
                ))}
            </div>

            {/* Application Cards */}
            {loading && <p className="text-center text-gray-500">Loading applications...</p>}
            {error && <p className="text-center text-red-600">Error: {error}</p>}
            {!loading && sortedApplications.length === 0 && (
                <p className="text-center text-gray-600">No applications found.</p>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {sortedApplications.map((app) => {
                    const appErrors = errors[app._id] || {};
                    const isDisabled =
                        scheduling[app._id] ||
                        !app.email ||
                        !app.firstName ||
                        !app.lastName ||
                        !interviewDates[app._id];

                    return (
                        <div
                            key={app._id}
                            className="bg-white rounded-xl border shadow-md hover:shadow-lg p-6 transition duration-300 flex flex-col justify-between"
                        >
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold text-blue-800 mb-1">
                                    {app.firstName} {app.lastName}
                                </h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                                <span
                                    className={`text-sm px-2 py-1 rounded font-medium ${app.matchPercentage >= 75
                                            ? "bg-green-600 text-white"
                                            : app.matchPercentage >= 50
                                                ? "bg-yellow-500 text-white"
                                                : "bg-red-600 text-white"
                                        }`}
                                >
                                    Match: {app.matchPercentage ?? "N/A"}%
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm mb-4">
                                <p><strong>Email:</strong> {app.email}</p>
                                <p><strong>Phone:</strong> {app.phoneNumber ?? "N/A"}</p>
                                <p><strong>Gender:</strong> {app.gender ?? "N/A"}</p>
                                <p><strong>Experience:</strong> {app.experience ?? "N/A"}</p>
                                <p><strong>Location:</strong> {app.location ?? "N/A"}</p>
                                <p><strong>Pincode:</strong> {app.pincode ?? "N/A"}</p>
                                <p><strong>Graduation:</strong> {app.yearOfGraduation ?? "N/A"}</p>
                                <p><strong>Status:</strong> {app.status ?? "Pending"}</p>
                            </div>

                            <div className="mb-4 text-sm">
                                <p><strong>Skills:</strong> {app.skills}</p>
                              
                            </div>

                            {/* Schedule Section */}
                            <div className="mt-4 flex flex-col gap-2">
                                <label className="font-medium text-sm text-gray-600">
                                    Select Interview Date:
                                </label>
                                <input
                                    type="datetime-local"
                                    className={`w-full p-2 rounded border ${appErrors.date ? "border-red-500" : "border-gray-300"
                                        }`}
                                    value={interviewDates[app._id] || ""}
                                    onChange={(e) =>
                                        setInterviewDates({
                                            ...interviewDates,
                                            [app._id]: e.target.value,
                                        })
                                    }
                                />
                                {appErrors.date && <p className="text-red-500 text-sm">{appErrors.date}</p>}
                                <button
                                    onClick={() => handleSchedule(app)}
                                    disabled={isDisabled}
                                    className={`mt-2 px-4 py-2 text-white font-medium rounded ${isDisabled
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                >
                                    {scheduling[app._id] ? "Scheduling..." : "Schedule Interview"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobinterviewManger;
