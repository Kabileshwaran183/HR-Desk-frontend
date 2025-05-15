import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectCard from "./ProjectCard";
import Userlist from "./TaskList";

const Dashboard = () => {
    const navigate = useNavigate();

    // Get user info from localStorage or fallback to Guest
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

    // Format today's date as e.g. Monday, 20 October 2021
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString(undefined, options);

    // Sign out handler
    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // If you store a token for authentication
        navigate("/login"); // Redirect to login page
    };

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <ProjectCard
                        color="bg-purple-700"
                        title="Web Development"
                        tasks="10 tasks"
                        progress="96"
                        avatars={7}
                    />
                    <ProjectCard
                        color="bg-cyan-300"
                        title="Mobile App Design"
                        tasks="12 tasks"
                        progress="46"
                        avatars={9}
                    />
                    <ProjectCard
                        color="bg-orange-400"
                        title="Facebook Brand UI Kit"
                        tasks="22 tasks"
                        progress="73"
                        avatars={3}
                    />
                </div>

                <Userlist />
            </main>
        </div>
    );
};

export default Dashboard;
