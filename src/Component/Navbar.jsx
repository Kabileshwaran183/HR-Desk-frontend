import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center py-3 px-6 shadow-md bg-white">
          
            <div className="flex items-center space-x-1 text-xl font-bold">
                <span className="ml-2 tracking-widest">Logo</span>
            </div>

            
            <div className="hidden md:flex space-x-6 text-lg">
                <Link to="/" className="hover:text-gray-600">Home</Link>
                <Link to="/jobs" className="hover:text-gray-600">Jobs</Link>
                <Link to="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            </div>

           
            <div className="md:hidden flex items-center space-x-4">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-gray-600 focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

           
            <div className="flex items-center space-x-4">
                <a href="#" className="text-red-500 hover:underline">Log in</a>
                <span className="text-gray-400">|</span>
                <a href="#" className="text-red-500 hover:underline">Register</a>

                
                <FaFacebookF className="text-blue-600 text-xl cursor-pointer" />
                <FaInstagram className="text-pink-500 text-xl cursor-pointer" />
            </div>

            
            {menuOpen && (
                <div className="md:hidden absolute top-16 right-0 bg-white shadow-lg w-40 py-2 rounded-md">
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Home</Link>
                    <Link to="/jobs" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Jobs</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">Dashboard</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
