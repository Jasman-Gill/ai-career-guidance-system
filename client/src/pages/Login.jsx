import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { auth, isFirebaseConfigured } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import IconBubble from "../components/IconBubble";
import { restoreStoredAnalysisForUser, writeStoredUser } from "../utils/storage";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await API.post("/auth/login", form);
            writeStoredUser(data);
            await restoreStoredAnalysisForUser(API, data);
            navigate("/dashboard");
        } catch (requestError) {
            setError(requestError?.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isFirebaseConfigured || !auth) {
            setError("Google login is not configured yet. Add your VITE_FIREBASE_* values.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const { data } = await API.post("/auth/google", {
                name: result.user.displayName,
                email: result.user.email,
            });

            writeStoredUser(data);
            await restoreStoredAnalysisForUser(API, data);
            navigate("/dashboard");
        } catch (requestError) {
            setError(requestError?.response?.data?.message || "Google login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_25%),linear-gradient(180deg,_#fff8ef_0%,_#fffdf7_38%,_#f4fbff_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_22%),linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#020617_100%)]">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="motion-card motion-fade-up rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                    <Link to="/" className="text-sm font-semibold text-orange-500">
                        Back to landing page
                    </Link>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                        Welcome back
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Log in to continue your career analysis.
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Access your workspace to review resume insights, skill gaps, career matches, and roadmap progress.
                    </p>

                    <div className="mt-10 space-y-4">
                        {[
                            "Review your latest resume analysis.",
                            "Track missing skills and roadmap phases.",
                            "Keep your target role and company details in one place.",
                        ].map((item) => (
                            <div
                                key={item}
                                className="motion-card flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                            >
                                <IconBubble icon="spark" tone="orange" className="h-8 w-8 rounded-xl bg-transparent" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="motion-card motion-fade-up-delay-1 rounded-[2.5rem] border border-slate-200/70 bg-white p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/55 dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        Sign in
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                        Access your workspace
                    </h2>

                    <form className="mt-8 space-y-5" onSubmit={handleLogin}>
                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Email
                            </span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50">
                                <IconBubble icon="mail" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                                />
                            </div>
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Password
                            </span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50">
                                <IconBubble icon="lock" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                                />
                            </div>
                        </label>

                        {error ? (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="motion-button inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
                        >
                            {loading ? "Signing in..." : "Login"}
                            <span aria-hidden="true">-&gt;</span>
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="motion-button mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
                    >
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.659 29.391 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.322 6.053 29.445 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.962 3.038l5.657-5.657C34.322 6.053 29.445 4 24 4c-7.38 0-13.734 4.168-16.694 10.691z" />
                            <path fill="#4CAF50" d="M24 44c5.328 0 10.09-2.036 13.734-5.338l-6.335-5.346C29.327 34.69 26.83 36 24 36c-5.369 0-9.621-3.317-11.282-7.962l-6.522 5.025C8.95 39.556 15.967 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.017 12.017 0 0 1-4.904 6.316l.004-.003 6.335 5.346C36.582 39.318 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        New here?{" "}
                        <Link to="/signup" className="font-semibold text-orange-500">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
