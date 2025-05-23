import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobList = () => {
    const jobs = [
        { id: 1, title: "SOFTWARE DEVELOPER", description: "Design and develop high-volume, low-latency applications for mission-critical systems, ensuring top-tier availability and performance.", type: "Full time" },
        { id: 2, title: "QA ENGINEER", description: "Experience in manual and automation testing. Knowledge of Java Programming.", type: "Full time" },
        { id: 3, title: "SALES EXECUTIVE", description: "Build rapport with contacts and understand where the prospect is in the buying process.", type: "Full time" },
        { id: 4, title: "APP DEVELOPMENT", description: "Build rapport with contacts and understand where the prospect is in the buying process.", type: "Full time" },
        { id: 5, title: "WEB DEVELOPMENT", description: "Build rapport with contacts and understand where the prospect is in the buying process.", type: "Full time" }
    ];

    return (
        <section className="py-16 px-6 bg-gray-100">
            <h2 className="text-center text-3xl md:text-4xl font-semibold mb-10 text-gray-800">
                Some opportunities for you to explore
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:-translate-y-2 hover:shadow-xl group">
                        <h3 className="text-pink-600 font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600 mt-3 text-sm leading-relaxed">{job.description}</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-green-600 font-medium">{job.type}</span>
                            <Link to={`/apply/${job.id}`} state={{ jobTitle: job.title }} className="text-gray-400 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JobList;
