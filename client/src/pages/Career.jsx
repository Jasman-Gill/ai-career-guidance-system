import Layout from "../../components/layout/Layout";
import IconBubble from "../components/IconBubble";
import { readStoredAnalysis } from "../utils/storage";

function Career() {
    const analysis = readStoredAnalysis();
    const careers = analysis?.careers || [];

    return (
        <Layout
            title="Career"
            description="Review the career paths that best match your current profile and see how your target role and company shape the recommendations."
        >
            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <div className="flex items-center gap-3">
                        <IconBubble icon="career" tone="slate" filled />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                                Career Match
                            </p>
                            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                Best-fit roles for your current profile
                            </h2>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {careers.length ? (
                            careers.map((career, index) => (
                                <div
                                    key={career}
                                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/40"
                                >
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                        Option {index + 1}
                                    </p>
                                    <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                        {career}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                        This path appears to fit the strengths currently signaled by your resume and the focus areas you supplied during analysis.
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Run the resume analysis first to unlock AI career recommendations.
                            </p>
                        )}
                    </div>
                </article>

                <div className="space-y-6">
                    <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                        <div className="flex items-center gap-3">
                            <IconBubble icon="target" tone="orange" className="h-10 w-10 rounded-xl" />
                            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                Target role focus
                            </h2>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Dream role</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                            {analysis?.dreamRole || "Not selected yet"}
                        </p>
                    </article>

                    <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                        <div className="flex items-center gap-3">
                            <IconBubble icon="company" tone="sky" className="h-10 w-10 rounded-xl" />
                            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                Dream company
                            </h2>
                        </div>
                        <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
                            {analysis?.dreamCompany || "Not selected yet"}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Setting a target company helps the analysis stay aligned with the skills, projects, and preparation that matter most.
                        </p>
                    </article>

                    <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                        <div className="flex items-center gap-3">
                            <IconBubble icon="trend" tone="emerald" className="h-10 w-10 rounded-xl" />
                            <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                Strategic advice
                            </h2>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Focus on building evidence for your target role through projects, stronger resume keywords, and interview-ready proof of the top missing skills.
                        </p>
                    </article>
                </div>
            </section>
        </Layout>
    );
}

export default Career;
