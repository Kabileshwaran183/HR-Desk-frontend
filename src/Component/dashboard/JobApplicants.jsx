import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JobApplicants = () => {
    const { jobTitle } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications");
                const data = await res.json();
                const filtered = data.filter(
                    (app) =>
                        (app.jobTitle || "").toLowerCase() === decodeURIComponent(jobTitle).toLowerCase()
                );
                setApplicants(filtered);
            } catch (error) {
                console.error("Error fetching applicants:", error);
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobTitle]);

    const handleScheduleInterview = async (applicant, index) => {
        const date = prompt("Enter interview date and time (e.g., 2025-06-01T10:00):");
        const ranking = prompt("Enter applicant ranking (e.g., A, B, C):");

        if (!date || !ranking) return alert("Interview date and ranking are required.");

        try {
            const response = await fetch("https://hr-desk-backend.onrender.com/api/schedule-interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    applicantId: applicant._id,
                    email: applicant.email,
                    name: `${applicant.firstName} ${applicant.lastName}`,
                    jobTitle: applicant.jobTitle,
                    interviewDate: date,
                    ranking: ranking,
                }),
            });

            if (!response.ok) throw new Error("Failed to schedule interview");
            alert("Interview scheduled successfully!");
        } catch (error) {
            console.error("Error scheduling interview:", error);
            alert("Failed to schedule interview");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-6">Applicants for "{decodeURIComponent(jobTitle)}"</h2>

            {loading ? (
                <p>Loading applicants...</p>
            ) : applicants.length > 0 ? (
                <ul className="space-y-4">
                    {applicants.map((applicant, index) => (
                        <li key={applicant._id} className="p-4 border rounded shadow-sm bg-white">
                            <p><strong>Name:</strong> {applicant.firstName} {applicant.lastName}</p>
                            <p><strong>Email:</strong> {applicant.email}</p>
                            <p><strong>Phone:</strong> {applicant.phoneNumber}</p>
                            <p><strong>Skills:</strong> {applicant.skills}</p>
                            <p><strong>Experience:</strong> {applicant.experience}</p>
                            <p><strong>Status:</strong> {applicant.status || "Pending"}</p>
                            <button
                                onClick={() => handleScheduleInterview(applicant, index)}
                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Schedule Interview
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No applicants found for this job.</p>
            )}
        </div>
    );
};

export default JobApplicants;
