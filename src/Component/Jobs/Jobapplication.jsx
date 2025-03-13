import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";
import { FaTimesCircle } from "react-icons/fa";

const JobApplication = () => {
    const { id } = useParams();
    const [resumeName, setResumeName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [yearOfGraduation, setYearOfGraduation] = useState("");
    const [gender, setGender] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [location, setLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Reset previous state before processing a new resume
        setResumeName("");
        setPhoneNumber("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setSkills("");
        setExperience("");
        setLoading(true);
        setParsed(false);

        setResumeName(file.name);

        if (file.type === "application/pdf") {
            await extractTextFromPDF(file); // Extract email & phone via regex
        }
        await parseResumeWithAI(file); // Extract other details via Affinda

        // Reset the input field to allow re-uploading the same file
        event.target.value = null;
    };
    const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
        firstName,
        lastName,
        email,
        resume: resumeName,  // ✅ Use resumeName instead of undefined resume
        status: "Pending" // Default status
    };

    try {
        const response = await fetch("https://hr-desk-backend.onrender.com/api/jobapplications", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(applicationData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Application Submitted!");
            setFirstName("");
            setLastName("");
            setResumeName(""); // Reset resume
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (error) {
        console.error("Error submitting application:", error);
    }
};

    



    // **📌 Function to Extract Text from PDF (for Regex Extraction of Email & Phone)**
    const extractTextFromPDF = async (file) => {
        try {
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.js",
                import.meta.url
            ).toString();

            const pdf = await pdfjs.getDocument(URL.createObjectURL(file)).promise;
            let text = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((item) => item.str).join(" ") + " ";
            }

            console.log("Extracted Resume Text:", text);
            extractDetails(text);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
        }
    };

    // **📌 Function to Extract Email & Phone via Regex**
    const extractDetails = (text) => {
        console.log("Analyzing Extracted Text...");

        // Regex for extracting phone number (+91, spaces, dashes supported)

        const phoneRegex = /\b(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}\b/;
        const foundPhone = text.match(phoneRegex)?.[0] || "";

        // Regex for extracting email
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
        const foundEmail = text.match(emailRegex)?.[0] || "";

        console.log("Detected Phone Number:", foundPhone);
        console.log("Detected Email:", foundEmail);

        // Update state
        setPhoneNumber(foundPhone);
        setEmail(foundEmail);
    };

    // **📌 Function to Use Affinda API for Name, Skills, Experience, etc.**
    const parseResumeWithAI = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://api.affinda.com/v2/resumes", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_AFFINDA_API_KEY}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log("📌 Affinda API Response:", result);

            if (result.data) {
                setFirstName(result.data.name?.first || "");
                setLastName(result.data.name?.last || "");
                setLocation(result.data.location?.text || "");
                setPincode(result.data.location?.postcode || "");
                setYearOfGraduation(result.data.education?.[0]?.completion_date || "");
                setGender(result.data.personal_info?.gender || "");

                // **📌 Extract and Filter Skills Dynamically**
                const unwantedSkills = [
                    "Marketing", "Marketing Materials", "Sensors", "Analytics",
                    "Intranet", "Digital Marketing", "Management"
                ];

                const extractedSkills = result.data.skills
                    ?.map(skill => skill.name.trim())
                    ?.filter(skill => skill.length > 0 && !unwantedSkills.includes(skill))
                    ?.join(", ") || "No relevant skills found";

                setSkills(extractedSkills);

                // **📌 Extract Experience Dynamically**
                const extractedExperience = result.data.work_experience
                    ?.map(exp => `${exp.job_title} at ${exp.organisation}, ${exp.dates?.start_date || ""} - ${exp.dates?.end_date || "Present"}`)
                    .join("\n") || "No work experience found";

                setExperience(extractedExperience);
            } else {
                console.error("❌ No data received from Affinda.");
            }
        } catch (error) {
            console.error("❌ Error parsing resume with AI:", error);
        }

        setLoading(false);
        setParsed(true);
    };


    const handleCancelResume = () => {
        setResumeName("");
        setPhoneNumber("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setSkills("");
        setExperience("");
        setLoading(false);
        setParsed(false);

        // Reset the file input manually
        document.getElementById("resumeUpload").value = "";
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Apply for Job ID: {id}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* 📌 Resume Upload */}
                <div className="p-4 border-2 border-dashed rounded-lg text-center relative">
                    <label className="cursor-pointer flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-600">
                            {resumeName ? resumeName : "Upload Your Resume (PDF, DOCX)"}
                        </span>
                
                        <input
                            type="file"
                            id="resumeUpload"  // Add this ID
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                            required
                        />

                    </label>

                    {resumeName && (
                        <button
                            type="button"
                            onClick={handleCancelResume}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                            <FaTimesCircle size={24} />
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}

                {parsed && !loading && (
                    <div className="text-green-600 mt-4 text-center">
                        <p>Resume parsed successfully. Carefully review your information before submitting the application.</p>
                    </div>
                )}

                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your first name"
                        required
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your last name"
                        required
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    />
                </div>

                {/* Year of Graduation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Year of Graduation</label>
                    <input
                        type="number"
                        value={yearOfGraduation}
                        onChange={(e) => setYearOfGraduation(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your year of graduation"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (in years)</label>
                    <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your experience in years"
                        required
                    />
                </div>

                {/* Skills */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your skills (comma separated)"
                        required
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your current location"
                        required
                    />
                </div>

                {/* Pincode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your pincode"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button onClick={handleSubmit}
                        type="submit"
                        className="w-48 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Submit Application
                    </button>
                    <button
                        type="button"
                        className="w-48 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500 transition duration-300"
                        onClick={handleCancelResume}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

};

export default JobApplication;
