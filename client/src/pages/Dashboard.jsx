import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import UploadForm from "../../components/layout/UploadForm";
import IconBubble from "../components/IconBubble";
import { readStoredAnalysis, readStoredUser } from "../utils/storage";

function Dashboard() {
    const user = readStoredUser();
    const analysis = readStoredAnalysis();

    const heroCards = [
        {
            label: "Dream Role",
            value: analysis?.dreamRole || "Set your next target role",
            icon: "target",
        },
        {
            label: "Dream Company",
            value: analysis?.dreamCompany || "Choose your ideal employer",
            icon: "company",
        },
        {
            label: "Resume Status",
            value: analysis?.resumeFileName || "Upload a fresh CV to begin",
            icon: "file",
        },
    ];

    const spotlightSkills = (analysis?.missingSkills || []).slice(0, 4);
    const topCareers = (analysis?.careers || []).slice(0, 3);

    return (
        <Layout
            title={`Welcome${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
            description="Upload your resume, set your target role, and review the latest AI analysis of your skills, gaps, and career direction."
            actions={
                <>
                    <Link
                        to="/analytics"
                        className="motion-button inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
                    >
                        View analytics
                    </Link>
                    <Link
                        to="/roadmap"
                        className="motion-button motion-glow inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
                    >
                        Open roadmap
                        <span aria-hidden="true">-&gt;</span>
                    </Link>
                </>
            }
        >
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {heroCards.map(({ label, value, icon }) => (
                    <article
                        key={label}
                        className="motion-card motion-fade-up rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65"
                    >
                        <IconBubble icon={icon} tone="orange" />
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                        <h2 className="mt-2 break-words font-display text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
                            {value}
                        </h2>
                    </article>
                ))}
            </section>

            <div className="mt-6">
                <UploadForm />
            </div>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <article className="motion-card motion-fade-up-delay-1 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <div className="flex items-center gap-3">
                        <IconBubble icon="analytics" tone="slate" filled />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                                AI Summary
                            </p>
                            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                Current alignment overview
                            </h2>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {analysis?.summary ||
                            "Upload your CV and choose your target role to generate a personalized analysis of skills, gaps, and next steps."}
                    </p>

                    <div className="mt-6 h-4 rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                            className="h-4 rounded-full bg-gradient-to-r from-orange-500 to-sky-500"
                            style={{ width: `${analysis?.alignmentScore || 0}%` }}
                        />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Market alignment score</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {analysis?.alignmentScore || 0}%
                        </span>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Recommended career directions
                            </p>
                            <div className="mt-4 space-y-3">
                                {topCareers.length ? (
                                    topCareers.map((career) => (
                                        <div
                                            key={career}
                                            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200"
                                        >
                                            <span aria-hidden="true" className="text-orange-500">CR</span>
                                            {career}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Career suggestions will appear after your first analysis.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                Priority skill gaps
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {spotlightSkills.length ? (
                                    spotlightSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-200"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Missing skills will appear once the AI reviews your resume.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                <article className="motion-card motion-fade-up-delay-2 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                        What to do next
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                        Recommended next steps
                    </h2>

                    <div className="mt-6 space-y-4">
                        {[
                            "Upload your latest CV or resume in PDF format.",
                            "Add the dream role and dream company you want to target.",
                            "Review analytics to understand your strongest skills and biggest gaps.",
                            "Open the roadmap page and start following the AI action plan.",
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-orange-400 dark:text-slate-950">
                                    {index + 1}
                                </div>
                                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{step}</p>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </Layout>
    );
}

export default Dashboard;
