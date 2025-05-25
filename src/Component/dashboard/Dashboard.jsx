import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectCard from "./ProjectCard";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalApplicants: 0,
        scheduled: 0,
        offers: 0,
        pending: 0,
    });
    const [jobStats, setJobStats] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(true);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", email: "" };

    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("https://hr-desk-backend.onrender.com/api/dashboard/stats");
                if (!res.ok) throw new Error("Failed to fetch dashboard stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch job applications grouped by jobTitle
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications");
                if (res.ok) {
                    const data = await res.json();
                    const grouped = data.reduce((acc, app) => {
                        const title = app.jobTitle || "Untitled Job";
                        acc[title] = (acc[title] || 0) + 1;
                        return acc;
                    }, {});
                    const statsArray = Object.entries(grouped).map(([title, count]) => ({ title, count }));
                    setJobStats(statsArray);
                } else {
                    setJobStats([]);
                }
            } catch (error) {
                console.error("Error fetching job applications:", error);
                setJobStats([]);
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchApplications();
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-neutral-100 to-white p-4 gap-6">
            <Sidebar />
            <main className="flex-1 p-6 bg-white rounded-3xl shadow-md flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Hello, {user.name}</h1>
                        <p className="text-sm text-gray-500">Today is {formattedDate}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Dashboard Stats */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Dashboard Stats</h2>
                    {loadingStats ? (
                        <p>Loading stats...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Total Applicants" value={stats.totalApplicants} color="bg-indigo-500" />
                            <StatCard title="Scheduled Interviews" value={stats.scheduled} color="bg-yellow-500" />
                            <StatCard title="Offers Sent" value={stats.offers} color="bg-green-500" />
                            <StatCard title="Pending Applications" value={stats.pending} color="bg-gray-500" />
                        </div>
                    )}
                </section>

                {/* Job Applications */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Job Applications</h2>
                    {loadingJobs ? (
                        <p>Loading job applications...</p>
                    ) : jobStats.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {jobStats.map(({ title, count }, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/job/${encodeURIComponent(title)}`)}
                                >
                                    <ProjectCard
                                        color="bg-indigo-500"
                                        title={title}
                                        tasks={`${count} applicants`}
                                        progress={Math.min(100, count * 10)}
                                        avatars={count}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No submitted job applications found.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

function StatCard({ title, value, color }) {
    return (
        <div className={`${color} text-white p-4 rounded-xl`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-3xl">{value}</p>
        </div>
    );
}

export default Dashboard;
