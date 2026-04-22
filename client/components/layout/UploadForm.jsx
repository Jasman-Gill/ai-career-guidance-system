import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconBubble from "../../src/components/IconBubble";
import API from "../../src/services/api";
import {
    normalizeAnalysisResult,
    readStoredUser,
    writeStoredAnalysis,
} from "../../src/utils/storage";

function splitCommaValues(value) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function UploadForm() {
    const navigate = useNavigate();
    const user = readStoredUser();
    const [form, setForm] = useState({
        dreamRole: "",
        dreamCompany: "",
        skills: "",
        interests: "",
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user?._id) {
            setError("Please log in again before starting the analysis.");
            return;
        }

        if (!file) {
            setError("Upload your CV or resume first so the AI can analyze it.");
            return;
        }

        const isPdf =
            file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            setError("Only PDF resumes are supported right now. Please upload a .pdf file.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const uploadPayload = new FormData();
            uploadPayload.append("resume", file);
            uploadPayload.append("userId", user._id);

            await API.post("/resume/upload", uploadPayload);

            const manualSkills = splitCommaValues(form.skills);
            const focusArea = [form.dreamRole, form.dreamCompany].filter(Boolean).join(" at ");
            const interests = splitCommaValues(form.interests);

            if (focusArea) {
                interests.push(`Target role focus: ${focusArea}`);
            }

            const { data } = await API.post("/analysis/analyze", {
                userId: user._id,
                manualSkills,
                interests,
                dreamRole: form.dreamRole,
                dreamCompany: form.dreamCompany,
            });

            const normalized = normalizeAnalysisResult(data?.result, {
                dreamRole: form.dreamRole,
                dreamCompany: form.dreamCompany,
                manualSkills,
                interests,
                resumeFileName: file.name,
            });

            writeStoredAnalysis(normalized);
            setSuccess("Analysis complete. Your dashboard has been updated with AI recommendations.");
            navigate("/dashboard");
        } catch (requestError) {
            setError(
                requestError?.response?.data?.message ||
                    "The analysis could not be completed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65 dark:shadow-[0_24px_80px_rgba(2,6,23,0.4)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                        Resume Analysis
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                        Add your target role, target company, and resume to generate a focused career plan.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        The system compares your resume, current skills, and interests with your chosen role, then highlights strengths, missing skills, and the next phases to work on.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-400/20 dark:bg-orange-500/10">
                        <IconBubble icon="target" tone="orange" className="h-10 w-10 rounded-xl" />
                        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Role match</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Define the role you want to prepare for.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-400/20 dark:bg-sky-500/10">
                        <IconBubble icon="company" tone="sky" className="h-10 w-10 rounded-xl" />
                        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Company lens</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Keep the analysis aligned with your target employer.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                        <IconBubble icon="roadmap" tone="emerald" className="h-10 w-10 rounded-xl" />
                        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">AI roadmap</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Receive skill-gap insights and phase-wise next steps.
                        </p>
                    </div>
                </div>
            </div>

            <form className="mt-8 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
                <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Dream Role
                    </span>
                    <input
                        name="dreamRole"
                        value={form.dreamRole}
                        onChange={handleChange}
                        placeholder="Frontend Developer, Data Analyst, Product Designer"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/10"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Dream Company
                    </span>
                    <input
                        name="dreamCompany"
                        value={form.dreamCompany}
                        onChange={handleChange}
                        placeholder="Google, TCS, Infosys, Microsoft"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/10"
                    />
                </label>

                <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Current Skills
                    </span>
                    <input
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="React, JavaScript, Tailwind, Figma, SQL"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/10"
                    />
                </label>

                <label className="space-y-2 lg:col-span-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Interests and Focus Areas
                    </span>
                    <textarea
                        name="interests"
                        value={form.interests}
                        onChange={handleChange}
                        rows={4}
                        placeholder="AI products, frontend architecture, interview prep, accessibility"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 dark:border-white/10 dark:bg-slate-950/50 dark:text-white dark:focus:border-orange-400 dark:focus:ring-orange-500/10"
                    />
                </label>

                <label className="lg:col-span-2">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Upload CV / Resume
                    </span>
                    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-5 dark:border-white/15 dark:bg-slate-950/35">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                                    <IconBubble
                                        icon="file"
                                        tone="slate"
                                        className="h-8 w-8 rounded-xl bg-transparent"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {file ? file.name : "Choose your latest resume"}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        PDF works best for the current parser.
                                    </p>
                                </div>
                            </div>

                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300">
                                <span aria-hidden="true">+</span>
                                Select file
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    className="hidden"
                                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                                />
                            </label>
                        </div>
                    </div>
                </label>

                {error ? (
                    <p className="lg:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                        {error}
                    </p>
                ) : null}

                {success ? (
                    <p className="lg:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                        {success}
                    </p>
                ) : null}

                <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Analyzing your profile..." : "Analyze Resume"}
                        <span aria-hidden="true">-&gt;</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/analytics")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                    >
                        View analytics
                    </button>
                </div>
            </form>
        </section>
    );
}

export default UploadForm;
