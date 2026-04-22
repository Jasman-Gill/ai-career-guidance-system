import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import IconBubble from "../components/IconBubble";
import { restoreStoredAnalysisForUser, writeStoredUser } from "../utils/storage";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await API.post("/auth/register", form);
            writeStoredUser(data);
            await restoreStoredAnalysisForUser(API, data);
            navigate("/dashboard");
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    "We could not create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_24%),linear-gradient(180deg,_#fff8ef_0%,_#fffdf7_40%,_#f4fbff_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.14),_transparent_24%),linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#020617_100%)]">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.95fr]">
                <div className="motion-card motion-fade-up rounded-[2.5rem] border border-slate-200/70 bg-white p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-950/55 dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                    <Link to="/" className="text-sm font-semibold text-orange-500">
                        Back to landing page
                    </Link>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                        Create account
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Create your career guidance account.
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Sign up to upload your resume, analyze skill gaps, explore matching careers, and follow a structured learning roadmap.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={handleRegister}>
                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Full Name
                            </span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50">
                                <IconBubble icon="user" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                                />
                            </div>
                        </label>

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
                                    placeholder="Create a strong password"
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
                            className="motion-button motion-glow inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                            <span aria-hidden="true">-&gt;</span>
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-orange-500">
                            Login
                        </Link>
                    </p>
                </div>

                <div className="motion-card motion-fade-up-delay-1 rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                        What you unlock
                    </p>
                    <div className="mt-6 space-y-4">
                        {[
                            {
                                title: "Personalized dashboard",
                                description: "View your target role, target company, uploaded resume, and alignment score in one place.",
                            },
                            {
                                title: "Career analytics",
                                description: "Review current strengths, missing skills, and role-fit insights after each analysis.",
                            },
                            {
                                title: "Structured roadmap",
                                description: "Turn AI recommendations into a clear phase-wise plan for focused learning.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="motion-card rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/40"
                            >
                                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                    {item.title}
                                </h2>
                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
