import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectCard from "./ProjectCard";
import Userlist from "./TaskList";

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", email: "" };
    const [jobStats, setJobStats] = useState([]);

    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`https://hr-desk-backend.onrender.com/api/jobapplications`);
                if (res.ok) {
                    const data = await res.json();

                    // Group applications by job title and count
                    const grouped = data.reduce((acc, app) => {
                        const title = app.jobTitle || "Untitled Job";
                        if (!acc[title]) {
                            acc[title] = 0;
                        }
                        acc[title]++;
                        return acc;
                    }, {});

                    // Convert object to array for rendering
                    const statsArray = Object.entries(grouped).map(([title, count]) => ({
                        title,
                        count,
                    }));

                    setJobStats(statsArray);
                } else {
                    console.log("No job applications found.");
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-neutral-100 to-white p-4 gap-6">
            <Sidebar />
            <main className="flex-1 p-6 bg-white rounded-3xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Hello, {user.name}</h1>
                        <p className="text-sm text-gray-500">Today is {formattedDate}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-black text-white px-4 py-2 rounded-xl">
                            Add New Project
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {jobStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {jobStats.map((job, index) => (
                            <div
                                key={index}
                                className="cursor-pointer"
                                onClick={() => navigate(`/job/${encodeURIComponent(job.title)}`)}
                            >
                                <ProjectCard
                                    color="bg-indigo-500"
                                    title={job.title}
                                    tasks={`${job.count} applicants`}
                                    progress={Math.min(100, job.count * 10)}
                                    avatars={job.count}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mb-8">No submitted job applications found.</p>
                )}


                <Userlist />
            </main>
        </div>
    );
};

export default Dashboard;
