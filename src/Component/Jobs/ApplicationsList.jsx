import React, { useEffect, useState } from "react";
import API_URL from "../../config";  


const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);



    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_URL}/api/applications`);
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Submitted Applications</h2>
            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Experience</th>
                            <th className="border p-2">Skills</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Pincode</th>
                            <th className="border p-2">Resume </th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{app.firstName} {app.lastName}</td>
                                <td className="border p-2">{app.email}</td>
                                <td className="border p-2">{app.phoneNumber}</td>
                                <td className="border p-2">{app.experience}</td>
                                <td className="border p-2">{app.skills}</td>
                                <td className="border p-2">{app.location}</td>
                                <td className="border p-2">{app.pincode}</td>
                                <td className="border p-2">
                                    {app.resumeName ? (
                                        <a
                                            href={`https://your-backend.com/uploads/${app.resumeName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            Download Resume
                                        </a>
                                    ) : "No Resume"}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ApplicationsList;
