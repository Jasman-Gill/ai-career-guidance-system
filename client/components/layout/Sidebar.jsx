import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="w-64 h-screen bg-white/70 dark:bg-white/10 backdrop-blur-xl border-r border-gray-200 dark:border-white/20 p-5">
            <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
                Dashboard
            </h2>

            <ul className="space-y-4">
                <li>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-300">
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/analysis" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-300">
                        Analysis
                    </Link>
                </li>

                <li>
                    <Link to="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-300">
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;