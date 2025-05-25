import React, { useState } from "react";
import axios from "axios";

export default function AddApplicant() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in form) {
            formData.append(key, form[key]);
        }

        try {
            await axios.post("/api/apply", formData);
            alert("Applicant added!");
        } catch (err) {
            console.error(err);
            alert("Error adding applicant.");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Applicant</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    className="w-full"
                    accept=".pdf,.doc,.docx"
                />
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}
