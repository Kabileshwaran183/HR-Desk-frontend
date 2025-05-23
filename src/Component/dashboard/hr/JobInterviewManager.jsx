import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JobInterviewManager = () => {
    const { jobTitle } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ranks, setRanks] = useState({});

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications");
                const data = await res.json();
                const filtered = data.filter(
                    (app) => (app.jobTitle || "").toLowerCase() === decodeURIComponent(jobTitle).toLowerCase()
                );
                setApplicants(filtered);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobTitle]);

    const handleRankChange = (id, value) => {
        setRanks({ ...ranks, [id]: value });
    };

    const handleScheduleInterview = async (applicant) => {
        const interviewDate = prompt("Enter Interview Date & Time (e.g., 2025-06-01T10:00):");
        if (!interviewDate) return;

        try {
            const res = await fetch("https://your-backend-api.com/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: applicant.email,
                    name: applicant.firstName + " " + applicant.lastName,
                    dateTime: interviewDate,
                    jobTitle,
                }),
            });

            const result = await res.json();
            alert("Interview Scheduled: " + result.status);
        } catch (err) {
            console.error("Scheduling error:", err);
            alert("Failed to schedule interview.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">
                Manage Applicants for: "{decodeURIComponent(jobTitle)}"
            </h1>

            {loading ? (
                <p>Loading applicants...</p>
            ) : applicants.length === 0 ? (
                <p>No applicants found for this job.</p>
            ) : (
                applicants.map((app) => (
                    <div
                        key={app._id}
                        className="bg-white shadow-md p-5 rounded-lg mb-4 border"
                    >
                        <h2 className="text-xl font-semibold">{app.firstName} {app.lastName}</h2>
                        <p>Email: {app.email}</p>
                        <p>Skills: {app.skills}</p>
                        <p>Experience: {app.experience}</p>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Rank this applicant:</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={ranks[app._id] || ""}
                                onChange={(e) => handleRankChange(app._id, e.target.value)}
                                className="border p-2 rounded w-24"
                            />
                        </div>

                        <button
                            onClick={() => handleScheduleInterview(app)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Schedule Interview
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default JobInterviewManager;
