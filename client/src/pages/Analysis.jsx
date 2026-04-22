import Layout from "../../components/layout/Layout";
import IconBubble from "../components/IconBubble";
import SkillChart from "../../components/layout/SkillCharts";
import { readStoredAnalysis } from "../utils/storage";

function Analytics() {
    const analysis = readStoredAnalysis();
    const skills = analysis?.skills || [];
    const missingSkills = analysis?.missingSkills || [];

    return (
        <Layout
            title="Analytics"
            description="Review how your resume matches current role expectations and identify the strengths and gaps that need attention."
        >
            {!analysis ? (
                <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                        No analytics yet
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Run your first resume analysis from the dashboard to unlock the charts and skill breakdown.
                    </p>
                </section>
            ) : (
                <div className="space-y-6">
                    <section className="grid gap-4 lg:grid-cols-4">
                        {[
                            { label: "Alignment Score", value: `${analysis.alignmentScore}%`, icon: "target" },
                            { label: "Current Skills", value: skills.length, icon: "analytics" },
                            { label: "Missing Skills", value: missingSkills.length, icon: "trend" },
                            { label: "Recommended Careers", value: analysis.careers?.length || 0, icon: "career" },
                        ].map((card) => (
                            <article
                                key={card.label}
                                className="motion-card motion-fade-up rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65"
                            >
                                <IconBubble icon={card.icon} tone="slate" className="h-9 w-9 rounded-xl" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                                <p className="mt-3 font-display text-4xl font-semibold text-slate-900 dark:text-white">
                                    {card.value}
                                </p>
                            </article>
                        ))}
                    </section>

                    <SkillChart skills={skills} missing={missingSkills} />

                    <section className="grid gap-6 lg:grid-cols-2">
                        <article className="motion-card motion-fade-up-delay-1 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                            <div className="flex items-center gap-3">
                                <IconBubble icon="analytics" tone="emerald" className="h-10 w-10 rounded-xl" />
                                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                    Strengths already visible in your profile
                                </h2>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {skills.length ? (
                                    skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No extracted skills yet.
                                    </p>
                                )}
                            </div>
                        </article>

                        <article className="motion-card motion-fade-up-delay-2 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                            <div className="flex items-center gap-3">
                                <IconBubble icon="trend" tone="orange" className="h-10 w-10 rounded-xl" />
                                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                    Skills to prioritize next
                                </h2>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {missingSkills.length ? (
                                    missingSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-200"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Missing skill recommendations will appear here.
                                    </p>
                                )}
                            </div>
                        </article>
                    </section>
                </div>
            )}
        </Layout>
    );
}

export default Analytics;
