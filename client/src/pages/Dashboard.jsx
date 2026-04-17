import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [file, setFile] = useState(null);
    const [skills, setSkills] = useState("");
    const [interests, setInterests] = useState("");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("resume", file);
            formData.append("userId", user._id);

            // Upload resume
            await API.post("/resume/upload", formData);

            // AI Analysis
            const { data } = await API.post("/analysis/analyze", {
                userId: user._id,
                manualSkills: skills.split(","),
                interests: [interests],
            });

            localStorage.setItem("analysis", JSON.stringify(data.result));
            navigate("/analysis");
        } catch (err) {
            console.log(err);
            alert("Error processing");
        }
    };

    return (
        <div className="p-10 bg-black text-white min-h-screen">
            <h1 className="text-3xl mb-6">Dashboard</h1>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />

            <input
                className="block w-full p-2 mb-3 bg-gray-800"
                placeholder="Skills (comma separated)"
                onChange={(e) => setSkills(e.target.value)}
            />

            <input
                className="block w-full p-2 mb-3 bg-gray-800"
                placeholder="Interest (e.g. Web Dev)"
                onChange={(e) => setInterests(e.target.value)}
            />

            <button onClick={handleSubmit} className="bg-blue-500 px-4 py-2 rounded">
                Analyze Career 🚀
            </button>
        </div>
    );
}

export default Dashboard;