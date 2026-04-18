import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data } = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("user", JSON.stringify(data));
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed");
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();

        if (!isFirebaseConfigured || !auth) {
            alert("Google login is not configured. Add VITE_FIREBASE_* in client/.env");
            return;
        }

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            // Send user to backend (IMPORTANT)
            const { data } = await API.post("/auth/google", {
                name: user.displayName,
                email: user.email,
            });

            localStorage.setItem("user", JSON.stringify(data));
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Google login failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            <form className="form" onSubmit={handleLogin}>
                <div className="flex-column">
                    <label>Email</label>
                </div>

                <div className="inputForm">
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex-column">
                    <label>Password</label>
                </div>

                <div className="inputForm">
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex-row">
                    <div>
                        <input type="checkbox" />
                        <label>Remember me</label>
                    </div>
                    <span className="span">Forgot password?</span>
                </div>

                <button className="button-submit" type="submit">
                    Sign In
                </button>

                <button
                    className="btn"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={!isFirebaseConfigured}
                    title={
                        isFirebaseConfigured
                            ? "Continue with Google"
                            : "Set VITE_FIREBASE_* in client/.env to enable Google login"
                    }
                >
                    <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 48 48"
                        focusable="false"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.391 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.322 6.053 29.445 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.322 6.053 29.445 4 24 4c-7.38 0-13.734 4.168-16.694 10.691z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24 44c5.328 0 10.09-2.036 13.734-5.338l-6.335-5.346C29.327 34.69 26.83 36 24 36c-5.369 0-9.621-3.317-11.282-7.962l-6.522 5.025C8.95 39.556 15.967 44 24 44z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303a12.017 12.017 0 0 1-4.904 6.316l.004-.003 6.335 5.346C36.582 39.318 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                        />
                    </svg>
                    Google
                </button>

                <p className="p">
                    Don't have an account?{" "}
                    <span className="span" onClick={() => navigate("/register")}>
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;