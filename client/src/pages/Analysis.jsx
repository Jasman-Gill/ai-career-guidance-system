import Layout from "../../components/layout/Layout";
import SkillChart from "../../components/layout/SkillCharts";

function Analysis() {
    let result = null;

    try {
        const stored = localStorage.getItem("analysis");
        result = stored ? JSON.parse(stored) : null;
    } catch {
        result = null;
    }

    const skills = Array.isArray(result?.skills) ? result.skills : [];
    const missingSkills = Array.isArray(result?.missingSkills)
        ? result.missingSkills
        : [];
    const hasData = skills.length > 0 || missingSkills.length > 0;

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                AI Analysis Result 🚀
            </h1>

            {!hasData ? (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl text-gray-900 dark:text-white mb-2">No Analysis Data Yet</h2>
                    <p className="text-gray-700 dark:text-gray-200">
                        Upload your resume and run analysis first. Your results
                        will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <SkillChart skills={skills} missing={missingSkills} />

                    <div className="mt-6">
                        <h2 className="text-gray-900 dark:text-white mb-2">Career Match</h2>

                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                                style={{ width: "80%" }}
                            ></div>
                        </div>
                    </div>

                    {/* Lists */}
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl text-gray-900 dark:text-white mb-3">Skills</h2>
                            {skills.map((s, i) => (
                                <p key={i} className="text-gray-700 dark:text-gray-200">{s}</p>
                            ))}
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                            <h2 className="text-xl text-gray-900 dark:text-white mb-3">Missing Skills</h2>
                            {missingSkills.map((m, i) => (
                                <p key={i} className="text-gray-700 dark:text-gray-200">{m}</p>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
}

export default Analysis;