import React, { useState, useEffect } from "react";
import { useParams, useLocation as useRouterLocation } from "react-router-dom";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";
import { FaTimesCircle } from "react-icons/fa";

const JobApplication = () => {
    const { id } = useParams();
    const routerLocation = useRouterLocation();
    const jobTitleFromState = routerLocation.state?.jobTitle || "";
    const jobDescriptionFromState = routerLocation.state?.jobDescription || ""; // Assuming job description is passed via state
    const [jobTitle, setJobTitle] = useState(jobTitleFromState || "");
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeName, setResumeName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [location, setLocation] = useState('');
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [yearOfGraduation, setYearOfGraduation] = useState("");
    const [gender, setGender] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [parsed, setParsed] = useState(false);
    const [parsedResumeData, setParsedResumeData] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

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
        setIsParsing(true);
        setParsed(false);
        setParsedResumeData(null);
        setResumeFile(file);
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
        setIsSubmitting(true); // Start submitting state

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobId", id);
        formData.append("jobDescription", jobDescriptionFromState);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("yearOfGraduation", yearOfGraduation);
        formData.append("gender", gender);
        formData.append("jobTitle", jobTitleFromState || jobTitle || "N/A");
        formData.append("experience", experience);
        formData.append("skills", skills);
        formData.append("location", location);
        formData.append("pincode", pincode);
        formData.append("parsedResume", JSON.stringify(parsedResumeData || {}));

        try {
            const response = await fetch("/api/jobapplications/apply", {
                method: "POST",
                body: formData,
            });

            let data = null;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            }

            if (response.ok) {
                setNotification({ show: true, message: 'Application Submitted Successfully!', type: 'success' });
                setFirstName("");
                setLastName("");
                setResumeName("");
                setResumeFile(null);
                setParsedResumeData(null);
                // Redirect to home after 2 seconds to allow notification to be seen
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                setNotification({ show: true, message: `Error: ${data?.error || 'Unknown error'}`, type: 'error' });
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            setNotification({ show: true, message: 'Error submitting application', type: 'error' });
        } finally {
            setIsSubmitting(false); // Reset submitting state after submission
        }
    };

    // Function to Extract Text from PDF (for Regex Extraction of Email & Phone)
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

            extractDetails(text);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
        }
    };

    // Function to Extract Email & Phone via Regex
    const extractDetails = (text) => {
        const phoneRegex = /\b(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}\b/;
        const foundPhone = text.match(phoneRegex)?.[0] || "";

        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
        const foundEmail = text.match(emailRegex)?.[0] || "";

        setPhoneNumber(foundPhone);
        setEmail(foundEmail);
    };

    // Function to Use Affinda API for Name, Skills, Experience, etc.
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

            if (result.data) {
                setFirstName(result.data.name?.first || "");
                setLastName(result.data.name?.last || "");
                setCurrentLocation(result.data.location?.text || "");
                setPincode(result.data.location?.postcode || "");
                setYearOfGraduation(result.data.education?.[0]?.completion_date || "");
                setGender(result.data.personal_info?.gender || "");

                const unwantedSkills = [
                    "Marketing", "Marketing Materials", "Sensors", "Analytics",
                    "Intranet", "Digital Marketing", "Management"
                ];

                const extractedSkills = result.data.skills
                    ?.map(skill => skill.name.trim())
                    ?.filter(skill => skill.length > 0 && !unwantedSkills.includes(skill))
                    ?.join(", ") || "";

                setSkills(extractedSkills);

              const extractedExperience = result.data.work_experience
  ?.map(exp => `${exp.job_title} at ${exp.organisation}, ${exp.dates?.start_date || ""} - ${exp.dates?.end_date || "Present"}`)
  .join("\n") || "No work experience found";

                setExperience(extractedExperience);

                setParsedResumeData(result.data);
            } else {
                console.error("No data received from Affinda.");
            }
        } catch (error) {
            console.error("Error parsing resume with AI:", error);
        }

        setIsParsing(false);
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
        setIsParsing(false);
        setParsed(false);
        setParsedResumeData(null);
        setResumeFile(null);

        // Reset the file input manually
        document.getElementById("resumeUpload").value = "";
    };

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="relative max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
            {notification.show && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-fade-in ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>

                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
            {isSubmitting && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200">
                        <div className="h-full bg-blue-500 animate-progress"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                        <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4 backdrop-blur-sm">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                <div className="absolute inset-2 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center px-6 py-3 bg-white shadow-md rounded-lg">
                                <h3 className="text-lg font-medium text-gray-800">Processing Submission</h3>
                                <p className="text-gray-600 mt-1">We're securely sending your application...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Apply for Job: {jobTitleFromState}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Resume Upload */}
                <div className="p-4 border-2 border-dashed rounded-lg text-center relative">
                    <label className="cursor-pointer flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-600">
                            {resumeName ? resumeName : "Upload Your Resume (PDF, DOCX)"}
                        </span>

                        <input
                            type="file"
                            id="resumeUpload"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
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

                {isParsing && (
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}
                {parsed && !isParsing && (
                    <div className="text-green-600 mt-4 text-center">
                        <p>Resume parsed successfully. Carefully review your information before submitting the application.</p>
                    </div>
                )}

                {/* Job title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Job Title"
                        required
                    />
                </div>

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
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-lg"
                        placeholder="Enter your location"
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
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={isSubmitting}
                    className={`w-48 text-white p-3 rounded-lg transition duration-300 flex items-center justify-center ${isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Application'
                        )}
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        className={`w-48 text-white p-3 rounded-lg transition duration-300 ${isSubmitting
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-400 hover:bg-gray-500'
                            }`}
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
