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
                if (res.ok) {
                    const data = await res.json();
                    // Filter applicants by jobTitle (case insensitive)
                    const filtered = data.filter(
                        (app) =>
                            (app.jobTitle || "").toLowerCase() === decodeURIComponent(jobTitle).toLowerCase()
                    );
                    setApplicants(filtered);
                } else {
                    setApplicants([]);
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobTitle]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-6">Applicants for "{decodeURIComponent(jobTitle)}"</h2>

            {loading ? (
                <p>Loading applicants...</p>
            ) : applicants.length > 0 ? (
                <ul className="space-y-6">
                    {applicants.map((app, idx) => (
                        <li
                            key={idx}
                            className="p-6 border rounded shadow-sm bg-white"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {app.firstName || app.name || app.fullName || "Unnamed Applicant"}
                            </h3>
                            <p><strong>Email:</strong> {app.email || "N/A"}</p>
                            <p><strong>Phone:</strong> {app.phoneNumber || "N/A"}</p>
                            <p><strong>Job Title:</strong> {app.jobTitle || "N/A"}</p>
                            <p><strong>Experience:</strong> {app.experience || "N/A"}</p>
                            <p><strong>Skills:</strong> {app.skills || "N/A"}</p>
                            <p><strong>Location:</strong> {app.location || "N/A"}</p>
                            <p><strong>Gender:</strong> {app.gender || "N/A"}</p>
                            <p><strong>Year of Graduation:</strong> {app.yearOfGraduation || "N/A"}</p>
                            <p><strong>Status:</strong> {app.status || "Pending"}</p>
                            <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleString()}</p>
                            {app.resume && (
                                <p>
                                    <strong>Resume:</strong>{" "}
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View Resume
                                    </a>
                                </p>
                            )}
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
