import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JobApplicants() {
    const [applications, setApplications] = useState([]);
    const [scheduleData, setScheduleData] = useState({
        applicantId: "",
        interviewDate: "",
        ranking: "",
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            const res = await axios.get("http://localhost:5000/api/jobapplications");
            setApplications(res.data);
        } catch {
            alert("Failed to fetch applications");
        }
    }

    async function handleScheduleInterview() {
        const { applicantId, interviewDate, ranking } = scheduleData;

        if (!applicantId || !interviewDate || !ranking) {
            alert("Please fill all scheduling fields");
            return;
        }

        try {
            // Convert interviewDate to ISO string (important!)
            const isoDate = new Date(interviewDate).toISOString();

            await axios.post("http://localhost:5000/api/schedule", {
                applicantId,
                interviewDate: isoDate,
                ranking,
            });

            alert("Interview scheduled successfully!");
            setScheduleData({ applicantId: "", interviewDate: "", ranking: "" });
            fetchApplications();
        } catch (error) {
            alert("Error scheduling interview");
            console.error(error.response?.data || error.message);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-3xl font-semibold mb-6">Job Applicants</h2>

            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {["Name", "Email", "Phone", "Job Title", "Status", "Interview Date", "Ranking"].map(header => (
                            <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wide">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {applications.length === 0 ? (
                        <tr><td colSpan="7" className="text-center py-6 text-gray-500">No applications found.</td></tr>
                    ) : (
                        applications.map(app => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">{app.firstName} {app.lastName}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-blue-600 underline"><a href={`mailto:${app.email}`}>{app.email}</a></td>
                                <td className="px-4 py-3 whitespace-nowrap">{app.phoneNumber}</td>
                                <td className="px-4 py-3 whitespace-nowrap font-semibold">{app.jobTitle}</td>
                                <td className={`px-4 py-3 whitespace-nowrap font-semibold ${app.status === "Interview Scheduled" ? "text-green-600" : "text-gray-600"}`}>
                                    {app.status || "Pending"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {app.interviewDate ? new Date(app.interviewDate).toLocaleString() : "-"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{app.ranking || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mt-10 border-t pt-8">
                <h3 className="text-2xl font-semibold mb-4">Schedule Interview</h3>
                <div className="flex gap-4 items-center flex-wrap">
                    <select
                        className="border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
                        value={scheduleData.applicantId}
                        onChange={e => setScheduleData({ ...scheduleData, applicantId: e.target.value })}
                    >
                        <option value="">Select Applicant</option>
                        {applications.map(app => (
                            <option key={app._id} value={app._id}>
                                {app.firstName} {app.lastName} ({app.jobTitle})
                            </option>
                        ))}
                    </select>

                    <input
                        type="datetime-local"
                        className="border px-4 py-2 rounded focus:ring-2 focus:ring-red-500"
                        value={scheduleData.interviewDate}
                        onChange={e => setScheduleData({ ...scheduleData, interviewDate: e.target.value })}
                    />

                    <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Ranking (1-10)"
                        className="border px-4 py-2 w-28 rounded focus:ring-2 focus:ring-red-500"
                        value={scheduleData.ranking}
                        onChange={e => setScheduleData({ ...scheduleData, ranking: e.target.value })}
                    />

                    <button
                        onClick={handleScheduleInterview}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
