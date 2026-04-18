import Layout from "../../components/layout/Layout";
import UploadForm from "../../components/layout/UploadForm";

function Dashboard() {
    return (
        <Layout>
            {/* HERO SECTION */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Welcome Back 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Analyze your career path using AI
                </p>
            </div>

            <UploadForm />

            {/* CARDS */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Resume Analysis
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Upload and analyze your resume
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Skill Gap
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Identify missing skills
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Career Paths
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        AI-based recommendations
                    </p>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;