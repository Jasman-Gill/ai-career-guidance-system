import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function SkillChart({ skills = [], missing = [] }) {
    const data = [
        { name: "Your Skills", value: skills.length },
        { name: "Missing Skills", value: missing.length },
    ];

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Skill Analysis
            </h2>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SkillChart;