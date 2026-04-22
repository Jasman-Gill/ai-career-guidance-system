import { NavLink, useNavigate } from "react-router-dom";
import IconBubble from "../../src/components/IconBubble";
import { clearSession, readStoredUser } from "../../src/utils/storage";

const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
    { label: "Analytics", path: "/analytics", icon: "analytics" },
    { label: "Career", path: "/career", icon: "career" },
    { label: "Roadmap", path: "/roadmap", icon: "roadmap" },
    { label: "Settings", path: "/settings", icon: "settings" },
    { label: "Profile", path: "/profile", icon: "profile" },
];

function Sidebar() {
    const navigate = useNavigate();
    const user = readStoredUser();

    const logout = () => {
        clearSession();
        navigate("/login");
    };

    return (
        <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-r border-slate-200/70 bg-white/65 p-6 backdrop-blur xl:flex dark:border-white/10 dark:bg-slate-950/45">
            <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-500">
                    AI Career Guidance
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-white">
                    Track your career preparation in one place.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Review skill gaps, target roles, and roadmap phases from a single workspace.
                </p>
            </div>

            <nav className="mt-6 flex-1 space-y-2">
                {navigation.map(({ label, path, icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-300/40 dark:bg-orange-500 dark:text-slate-950 dark:shadow-orange-500/20"
                                    : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                            }`
                        }
                    >
                        <IconBubble icon={icon} tone="slate" className="h-8 w-8 rounded-xl" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Signed in as
                </p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                    {user?.name || "User"}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {user?.email || "Update your profile to personalize recommendations."}
                </p>
                <button
                    type="button"
                    onClick={logout}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:border-white/10 dark:text-slate-200 dark:hover:border-orange-400/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-200"
                >
                    <IconBubble icon="logout" tone="slate" className="h-7 w-7 rounded-xl bg-transparent" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
