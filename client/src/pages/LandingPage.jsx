import { Link } from "react-router-dom";
import IconBubble from "../components/IconBubble";

const features = [
    {
        title: "Resume Analysis",
        description: "Upload your resume and let the system extract current skills, strengths, and missing areas.",
        icon: "AI",
    },
    {
        title: "Role Targeting",
        description: "Match your target role and company against the skills expected in the market.",
        icon: "TG",
    },
    {
        title: "Learning Roadmaps",
        description: "Get clear analytics, career suggestions, and a structured roadmap for improvement.",
        icon: "AN",
    },
];

const highlights = [
    "Dream role and company targeting",
    "CV upload and AI skill extraction",
    "Current market alignment scoring",
    "Roadmaps for upskilling and career growth",
];

function LandingPage() {
    return (
        <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_25%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.20),_transparent_20%),linear-gradient(180deg,_#fff8ef_0%,_#fffdf8_34%,_#f4fbff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.20),_transparent_22%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.18),_transparent_22%),linear-gradient(180deg,_#0f172a_0%,_#111827_42%,_#020617_100%)] dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/55 dark:shadow-none">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-500">
                            AI Career Guidance
                        </p>
                        <p className="font-display text-lg font-semibold">Plan your next career move with clarity.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
                        >
                            Sign up
                        </Link>
                    </div>
                </header>

                <section className="grid gap-10 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200">
                            <IconBubble icon="spark" tone="orange" className="h-7 w-7 rounded-full bg-transparent" />
                            Career guidance for students and job seekers
                        </div>

                        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                            Turn your resume into a structured path toward your target role.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Use AI to analyze your resume, identify skill gaps, explore matching roles, and follow a learning plan built around your career goal.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:translate-y-[-1px]"
                            >
                                Start for free
                                <span aria-hidden="true">-&gt;</span>
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                            >
                                Open workspace
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-3 sm:grid-cols-2">
                            {highlights.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
                                >
                                    <IconBubble icon="check" tone="emerald" className="h-7 w-7 rounded-full bg-transparent" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[2.5rem] bg-gradient-to-br from-orange-200 to-sky-200 opacity-70 blur-3xl dark:from-orange-500/20 dark:to-sky-500/20" />
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/75 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_32px_90px_rgba(2,6,23,0.45)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28em] text-orange-500">
                                        Career workspace
                                    </p>
                                    <h2 className="mt-2 font-display text-2xl font-semibold">Career progress at a glance</h2>
                                </div>
                                <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-orange-400 dark:text-slate-950">
                                    92% focus
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[1.75rem] bg-slate-900 p-5 text-white dark:bg-slate-950">
                                    <p className="text-sm text-slate-300">Dream role</p>
                                    <p className="mt-2 text-2xl font-semibold">Frontend Engineer</p>
                                    <p className="mt-4 text-xs text-slate-400">Target company: Microsoft</p>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/50">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Skill alignment</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">81%</p>
                                    <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-white/10">
                                        <div className="h-3 w-[81%] rounded-full bg-gradient-to-r from-orange-500 to-sky-500" />
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/50">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Top missing skills</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {["System Design", "TypeScript", "Testing", "CI/CD"].map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-950/50">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">90-day roadmap</p>
                                    <ol className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                        <li>Create one strong portfolio project.</li>
                                        <li>Strengthen advanced React and testing.</li>
                                        <li>Practice company-specific interview loops.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-20">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
                            Platform Highlights
                        </p>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
                            Core features for guided career preparation.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {features.map(({ title, description, icon }) => (
                            <article
                                key={title}
                                className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/55 dark:shadow-none"
                            >
                                <IconBubble
                                    icon={
                                        icon === "AI"
                                            ? "spark"
                                            : icon === "TG"
                                              ? "target"
                                              : "analytics"
                                    }
                                    tone="slate"
                                    filled
                                />
                                <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-20 rounded-[2.5rem] border border-slate-200/70 bg-slate-900 px-6 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10 dark:border-white/10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
                                Ready to get started?
                            </p>
                            <h2 className="mt-3 font-display text-4xl font-semibold">
                                Create your account and start your career analysis.
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                Start with your resume, define your target role, and get a clear plan for what to learn next.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/signup"
                                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-orange-100"
                            >
                                Create account
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-300 hover:text-orange-200"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default LandingPage;
