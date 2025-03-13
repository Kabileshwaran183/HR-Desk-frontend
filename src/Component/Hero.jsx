import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="text-center py-16 px-4 bg-white">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug mb-4">
                We're more than just a workplace. <br className="hidden md:block" />
                <span className="text-black">We're a family.</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 max-w-3xl mx-auto mb-6 px-2 md:px-4">
                We know that finding a meaningful and rewarding career can be a long journey.
                Our goal is to make that process easy for you and to create a work environment
                that’s enriching—one that you'll look forward to every day.
            </p>

            {/* View Open Roles Button */}
            <Link
                to="/"
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-red-600 transition"
            >
                VIEW OPEN ROLES &rarr;
            </Link>

            {/* Hero Image */}
            <div className="mt-10 flex justify-center">
                <img
                    src="/asset/teamwork-concept-landing-page_52683-20165-removebg-preview.png"
                    alt="Team Collaboration"
                    className="w-full max-w-3xl"
                />
            </div>
        </section>
    );
};

export default Hero;
