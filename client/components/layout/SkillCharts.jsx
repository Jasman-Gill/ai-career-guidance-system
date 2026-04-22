import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function SkillChart({ skills = [], missing = [] }) {
    const data = [
        { name: "Current Skills", value: skills.length },
        { name: "Skill Gaps", value: missing.length },
    ];

    return (
        <section className="motion-card motion-fade-up rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65 dark:shadow-[0_24px_80px_rgba(2,6,23,0.4)]">
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                    Skill Snapshot
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Compare your current skills with your identified gaps.
                </h2>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.25} />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[16, 16, 0, 0]} fill="#f97316" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default SkillChart;
