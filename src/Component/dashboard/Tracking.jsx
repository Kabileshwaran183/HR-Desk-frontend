import React, { useEffect, useState } from "react";
import axios from "axios";

const statusSteps = [
    "Applied",
    "Phone Screen",
    "Technical Interview",
    "Interview Scheduled",
    "Offer Made",
    "Hired",
    "Rejected",
];

export default function TrackingPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all applications on mount
    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        setLoading(true);
        try {
            const res = await axios.get("/api/jobapplications");
            setApplications(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    }

    // Update status handler
    async function handleStatusChange(appId, newStatus) {
        try {
            await axios.patch(`/api/jobapplications/${appId}/status`, { status: newStatus });
            // Update local state to reflect change immediately
            setApplications((prev) =>
                prev.map((app) =>
                    app._id === appId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            alert("Failed to update status");
        }
    }

    // Calculate progress % based on current status index
    function getProgressPercent(status) {
        const index = statusSteps.indexOf(status);
        if (index === -1) return 0;
        return ((index + 1) / statusSteps.length) * 100;
    }

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Applicant Tracking</h1>

            {applications.map((app) => (
                <div
                    key={app._id}
                    className="border rounded-lg p-4 shadow-md bg-white"
                >
                    <h2 className="text-xl font-semibold">{app.name}</h2>
                    <p className="text-gray-600 mb-2">Email: {app.email}</p>

                    {/* Status selector */}
                    <label className="block mb-2 font-semibold">
                        Status:
                        <select
                            value={app.status || "Applied"}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="ml-2 border rounded px-2 py-1"
                        >
                            {statusSteps.map((step) => (
                                <option key={step} value={step}>
                                    {step}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercent(app.status || "Applied")}%` }}
                        ></div>
                    </div>

                    {/* Timeline / Steps */}
                    <div className="flex justify-between text-sm mt-2 text-gray-700">
                        {statusSteps.map((step, i) => {
                            const stepIndex = statusSteps.indexOf(app.status || "Applied");
                            const active = i <= stepIndex;
                            return (
                                <div
                                    key={step}
                                    className={`flex-1 text-center ${active ? "font-bold text-green-700" : "text-gray-400"
                                        }`}
                                >
                                    {step}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
