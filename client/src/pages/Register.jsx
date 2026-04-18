import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", {
                name,
                email,
                password,
            });

            alert("Registered successfully");
            navigate("/");
        } catch {
            alert("Error");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <form className="form" onSubmit={handleRegister}>
                <h2 className="text-xl font-bold">Sign Up</h2>

                <div className="inputForm">
                    <input
                        className="input"
                        placeholder="Enter your Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="inputForm">
                    <input
                        className="input"
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="inputForm">
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="button-submit" type="submit">
                    Sign Up
                </button>

                <p className="p">
                    Already have an account?{" "}
                    <span className="span" onClick={() => navigate("/")}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Register;