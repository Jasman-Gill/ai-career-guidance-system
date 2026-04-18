import { useState } from "react";
import API from "../../src/services/api";
import { useNavigate } from "react-router-dom";

function UploadForm() {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [skills, setSkills] = useState("");
    const [interests, setInterests] = useState("");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleSubmit = async () => {
        try {
            if (!file) return alert("Please upload resume");

            setLoading(true);

            const formData = new FormData();
            formData.append("resume", file);
            formData.append("userId", user._id);

            // Step 1: Upload Resume
            await API.post("/resume/upload", formData);

            // Step 2: AI Analysis
            const { data } = await API.post("/analysis/analyze", {
                userId: user._id,
                manualSkills: skills.split(","),
                interests: [interests],
            });

            localStorage.setItem("analysis", JSON.stringify(data.result));

            setLoading(false);

            navigate("/analysis");
        } catch (err) {
            console.log(err);
            setLoading(false);
            alert("Something went wrong");
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl text-gray-900 dark:text-white mb-4">Start Analysis 🚀</h2>

            {/* Resume Upload */}
            <input
                type="file"
                className="mb-4 text-gray-800 dark:text-white"
                onChange={(e) => setFile(e.target.files[0])}
            />

            {/* Skills */}
            <input
                className="w-full p-3 mb-3 bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white rounded"
                placeholder="Enter skills (HTML, CSS, JS)"
                onChange={(e) => setSkills(e.target.value)}
            />

            {/* Interests */}
            <input
                className="w-full p-3 mb-4 bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white rounded"
                placeholder="Interest (Web Dev)"
                onChange={(e) => setInterests(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="w-full py-3 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
            >
                {loading ? "Analyzing..." : "Analyze Career 🚀"}
            </button>
        </div>
    );
}

export default UploadForm;