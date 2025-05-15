import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAviato } from "react-icons/fa";

export default function Sidebar() {
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        user = {};
    }

    const userImage = user.avatar || "https://i.pravatar.cc/150?img=1";

    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/Dashboard" },
        { name: "Analytics", path: "/Dashboard/analytics" },
        { name: "Task List", path: "/Dashboard/task-list" },
        { name: "Tracking", path: "/Dashboard/tracking" },
        { name: "Setting", path: "/Dashboard/setting" },
    ];

    return (
        <aside className="w-60 bg-white p-6 shadow-md rounded-3xl flex flex-col gap-6">
            <div className="flex items-center text-2xl font-bold text-purple-700 gap-2">
                <FaAviato />
                Chaart
            </div>

            <div className="flex flex-col items-center mt-4">
                <img
                    src={userImage}
                    alt="User"
                    className="rounded-full w-20 h-20 object-cover"
                />
                <h2 className="mt-2 font-semibold">{user.name || "Guest User"}</h2>
                <p className="text-sm text-gray-500">{user.email || "guest@example.com"}</p>
            </div>

            <nav className="mt-8 flex flex-col gap-4">
                {navItems.map(({ name, path }) => (
                    <Link
                        key={name}
                        to={path}
                        className={`block text-left px-3 py-2 rounded-md ${location.pathname === path
                                ? "bg-purple-100 text-purple-700 font-semibold"
                                : "text-gray-600 hover:text-purple-700"
                            }`}
                    >
                        {name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
