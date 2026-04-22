import { useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

function Sidebar({ isMobileOpen = false, onClose = () => {} }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = readStoredUser();
    const previousPathnameRef = useRef(location.pathname);

    const logout = () => {
        clearSession();
        navigate("/login");
    };

    useEffect(() => {
        if (previousPathnameRef.current !== location.pathname && isMobileOpen) {
            onClose();
        }
        previousPathnameRef.current = location.pathname;
    }, [location.pathname, isMobileOpen, onClose]);

    useEffect(() => {
        if (!isMobileOpen) {
            return undefined;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobileOpen]);

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition xl:hidden ${
                    isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-1.25rem))] shrink-0 flex-col overflow-hidden border-r border-slate-200/70 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur xl:sticky xl:top-0 xl:z-auto xl:h-screen xl:w-80 xl:translate-x-0 xl:bg-white/65 xl:p-6 xl:shadow-none dark:border-white/10 dark:bg-slate-950/95 xl:dark:bg-slate-950/45 ${
                    isMobileOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
                } transition-transform duration-300 ease-out`}
            >
            <div className="mb-3 flex items-center justify-between xl:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                    Navigation
                </p>
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                    aria-label="Close navigation"
                >
                    <span className="text-lg leading-none">x</span>
                </button>
            </div>

            <div className="motion-card motion-glow rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-500">
                    AI Career Guidance
                </p>
                <h2 className="mt-3 font-display text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
                    Track your career preparation in one place.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Review skill gaps, target roles, and roadmap phases from a single workspace.
                </p>
            </div>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
                <nav className="space-y-2 pb-6">
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
            </div>

            <div className="motion-card mt-4 flex-none rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Signed in as
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                    {user?.name || "User"}
                </p>
                <p className="mt-1 break-all text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {user?.email || "Update your profile to personalize recommendations."}
                </p>
                <button
                    type="button"
                    onClick={logout}
                    className="motion-button mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 dark:border-white/10 dark:text-slate-200 dark:hover:border-orange-400/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-200"
                >
                    <IconBubble icon="logout" tone="slate" className="h-7 w-7 shrink-0 rounded-xl bg-transparent" />
                    Logout
                </button>
            </div>
            </aside>
        </>
    );
}

export default Sidebar;
