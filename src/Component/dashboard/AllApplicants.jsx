import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllApplicantsPage = () => {
    const [applications, setApplications] = useState([]);
    const [interviewDates, setInterviewDates] = useState({});
    const [bulkSchedulingStatus, setBulkSchedulingStatus] = useState({
        low: false,
        high: false,
        full: false,
    });
    const [commonDateLow, setCommonDateLow] = useState("");
    const [commonDateHigh, setCommonDateHigh] = useState("");
    const [commonDateFull, setCommonDateFull] = useState("");
    const [scheduledStatus, setScheduledStatus] = useState({}); // track who is scheduled

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(
                    "https://hr-desk-backend.onrender.com/api/jobapplications"
                );
                const data = await res.json();
                setApplications(data);

                // Initialize interviewDates and scheduledStatus from existing data if available
                const initialDates = {};
                const statusMap = {};
                data.forEach((app) => {
                    if (app.interviewDate) {
                        initialDates[app._id] = app.interviewDate;
                        statusMap[app._id] = true;
                    } else {
                        statusMap[app._id] = false;
                    }
                });
                setInterviewDates(initialDates);
                setScheduledStatus(statusMap);
            } catch (error) {
                console.error("Error fetching applicants:", error);
                toast.error("Failed to fetch applicants.");
            }
        };

        fetchApplications();
    }, []);

    const handleInterviewDateChange = (id, date) => {
        setInterviewDates((prev) => ({ ...prev, [id]: date }));
        setScheduledStatus((prev) => ({ ...prev, [id]: false }));
    };

    // Reusable function to apply a common date to applicants in a match percentage range
    const applyCommonDateToAll = (minPercent, maxPercent, date) => {
        if (!date) return;
        const updatedDates = { ...interviewDates };
        applications.forEach((app) => {
            const match = app.matchPercentage ?? 0;
            if (match >= minPercent && match <= maxPercent) {
                updatedDates[app._id] = date;
            }
        });
        setInterviewDates(updatedDates);
    };

    // Reusable bulk scheduling function for any percentage range
    const handleBulkSchedule = async (minPercent, maxPercent, rangeKey) => {
        const toSchedule = applications.filter((app) => {
            const match = app.matchPercentage ?? 0;
            return (
                match >= minPercent &&
                match <= maxPercent &&
                interviewDates[app._id] &&
                app.email &&
                app.firstName &&
                app.lastName
            );
        });

        if (toSchedule.length === 0) {
            toast.warning(
                `No applicants with match percentage between ${minPercent}% and ${maxPercent}% and selected interview date.`
            );
            return;
        }

        setBulkSchedulingStatus((prev) => ({ ...prev, [rangeKey]: true }));

        let successCount = 0;
        let failCount = 0;
        const updatedStatus = { ...scheduledStatus };

        for (const app of toSchedule) {
            try {
                const response = await fetch(
                    "https://hr-desk-backend.onrender.com/api/schedule",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: app.email,
                            name: `${app.firstName} ${app.lastName}`,
                            date: interviewDates[app._id],
                        }),
                    }
                );

                if (response.ok) {
                    successCount++;
                    updatedStatus[app._id] = true;
                } else {
                    failCount++;
                }
            } catch {
                failCount++;
            }
        }

        setScheduledStatus(updatedStatus);

        toast.success(
            `Bulk scheduling complete for ${minPercent}% to ${maxPercent}%.\nScheduled: ${successCount}\nFailed: ${failCount}`
        );

        setBulkSchedulingStatus((prev) => ({ ...prev, [rangeKey]: false }));
    };

    // Sort applicants by descending match percentage
    const sortedApplications = [...applications].sort(
        (a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0)
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">All Applicants</h1>

            {/* Low Range: 0% to 50% */}
            <div className="mb-6 text-center">
                <label className="block font-semibold mb-2 text-gray-700">
                    Set Interview Date for All (0% to 50%)
                </label>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-2">
                    <input
                        type="datetime-local"
                        className="border border-gray-300 rounded p-2"
                        value={commonDateLow}
                        onChange={(e) => setCommonDateLow(e.target.value)}
                    />
                    <button
                        onClick={() => applyCommonDateToAll(0, 50, commonDateLow)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Apply Date to All
                    </button>
                </div>
                <button
                    onClick={() => handleBulkSchedule(0, 50, "low")}
                    disabled={bulkSchedulingStatus.low}
                    className={`px-6 py-3 rounded text-white font-semibold transition ${bulkSchedulingStatus.low
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {bulkSchedulingStatus.low
                        ? "Scheduling Interviews (0%-50%)..."
                        : "Schedule Interview for All (0% to 50%)"}
                </button>
            </div>

            {/* High Range: 50% to 100% */}
            <div className="mb-6 text-center">
                <label className="block font-semibold mb-2 text-gray-700">
                    Set Interview Date for All (50% to 100%)
                </label>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-2">
                    <input
                        type="datetime-local"
                        className="border border-gray-300 rounded p-2"
                        value={commonDateHigh}
                        onChange={(e) => setCommonDateHigh(e.target.value)}
                    />
                    <button
                        onClick={() => applyCommonDateToAll(50, 100, commonDateHigh)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Apply Date to All
                    </button>
                </div>
                <button
                    onClick={() => handleBulkSchedule(50, 100, "high")}
                    disabled={bulkSchedulingStatus.high}
                    className={`px-6 py-3 rounded text-white font-semibold transition ${bulkSchedulingStatus.high
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {bulkSchedulingStatus.high
                        ? "Scheduling Interviews (50%-100%)..."
                        : "Schedule Interview for All (50% to 100%)"}
                </button>
            </div>

            {/* Full Range: 0% to 100% */}
            <div className="mb-6 text-center">
                <label className="block font-semibold mb-2 text-gray-700">
                    Set Interview Date for All (0% to 100%)
                </label>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-2">
                    <input
                        type="datetime-local"
                        className="border border-gray-300 rounded p-2"
                        value={commonDateFull}
                        onChange={(e) => setCommonDateFull(e.target.value)}
                    />
                    <button
                        onClick={() => applyCommonDateToAll(0, 100, commonDateFull)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Apply Date to All
                    </button>
                </div>
                <button
                    onClick={() => handleBulkSchedule(0, 100, "full")}
                    disabled={bulkSchedulingStatus.full}
                    className={`px-6 py-3 rounded text-white font-semibold transition ${bulkSchedulingStatus.full
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {bulkSchedulingStatus.full
                        ? "Scheduling Interviews (0%-100%)..."
                        : "Schedule Interview for All (0% to 100%)"}
                </button>
            </div>

            {/* Applicant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedApplications.map((app) => {
                    const isScheduled = scheduledStatus[app._id];
                    return (
                        <div
                            key={app._id}
                            className={`p-5 rounded-lg shadow-md transition ${isScheduled
                                    ? "bg-green-100 border-green-300 border"
                                    : "bg-yellow-50 border border-yellow-300"
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold">
                                    {app.firstName} {app.lastName}
                                </h2>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${isScheduled
                                            ? "bg-green-600 text-white"
                                            : "bg-yellow-500 text-white"
                                        }`}
                                >
                                    {isScheduled ? "Scheduled" : "Pending"}
                                </span>
                            </div>
                            <p className="mb-1 text-sm text-gray-600">{app.email}</p>
                            <p className="mb-2 text-sm text-gray-600">Phone: {app.phone}</p>
                            <p
                                className={`mb-2 font-semibold ${app.matchPercentage >= 80
                                        ? "text-green-600"
                                        : app.matchPercentage >= 50
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                            >
                                Match: {app.matchPercentage ?? 0}%
                            </p>
                            <label className="block mb-1 font-semibold text-gray-700">
                                Interview Date
                            </label>
                            <input
                                type="datetime-local"
                                className="border border-gray-300 rounded p-2 w-full"
                                value={interviewDates[app._id] || ""}
                                onChange={(e) => handleInterviewDateChange(app._id, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Toast Container for notifications */}
            <ToastContainer position="top-right" autoClose={4000} />
        </div>
    );
};

export default AllApplicantsPage;
