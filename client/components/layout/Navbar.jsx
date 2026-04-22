import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import IconBubble from "../../src/components/IconBubble";
import { useTheme } from "../../src/context/ThemeContext";
import { readStoredAnalysis, readStoredUser } from "../../src/utils/storage";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/analytics": "Analytics",
    "/career": "Career Path",
    "/roadmap": "Roadmap",
    "/settings": "Settings",
    "/profile": "Profile",
};

function Navbar() {
    const location = useLocation();
    const { dark, setDark } = useTheme();
    const user = readStoredUser();
    const analysis = readStoredAnalysis();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);
    const displayName = user?.name || user?.email || "User";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const notifications = [
        analysis?.resumeFileName
            ? {
                  title: "Latest resume loaded",
                  detail: analysis.resumeFileName,
              }
            : {
                  title: "Add your latest resume",
                  detail: "Upload a PDF to unlock better recommendations.",
              },
        analysis?.dreamRole
            ? {
                  title: "Target role active",
                  detail: analysis.dreamRole,
              }
            : {
                  title: "Set a dream role",
                  detail: "Choose a role to make insights more specific.",
              },
        analysis?.missingSkills?.length
            ? {
                  title: "Priority skills updated",
                  detail: `${analysis.missingSkills.length} skills to focus on next.`,
              }
            : {
                  title: "No missing skills saved yet",
                  detail: "Run a fresh analysis after updating your CV.",
              },
    ];

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-slate-950/55">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 xl:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                        aria-label="Navigation menu"
                    >
                        <IconBubble icon="menu" tone="slate" className="h-7 w-7 rounded-xl bg-transparent" />
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                            {pageTitles[location.pathname] || "Workspace"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Welcome back, {user?.name?.split(" ")[0] || "there"}.
                        </p>
                    </div>
                </div>

                <div className="hidden min-w-[280px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex dark:border-white/10 dark:bg-slate-900">
                    <IconBubble icon="search" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                    <span className="text-sm text-slate-400">
                        Search roles, companies, skills, and learning plans
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setDark(!dark)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                        aria-label="Toggle theme"
                    >
                        <IconBubble
                            icon={dark ? "sun" : "moon"}
                            tone="slate"
                            className="h-7 w-7 rounded-xl bg-transparent"
                        />
                    </button>

                    <div className="relative" ref={notificationsRef}>
                        <button
                            type="button"
                            onClick={() => setIsNotificationsOpen((current) => !current)}
                            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:text-orange-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                            aria-label="Notifications"
                            aria-expanded={isNotificationsOpen}
                        >
                            <IconBubble
                                icon="bell"
                                tone="slate"
                                className="h-7 w-7 rounded-xl bg-transparent"
                            />
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
                        </button>

                        {isNotificationsOpen ? (
                            <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-slate-900">
                                <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Notifications
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Quick updates from your analysis workspace
                                    </p>
                                </div>
                                <div className="p-2">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.title}
                                            className="rounded-2xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-white/5"
                                        >
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                                                {notification.detail}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 pr-4 shadow-sm transition hover:border-orange-300 dark:border-white/10 dark:bg-slate-900"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-orange-400 dark:text-slate-950">
                            {initials}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {displayName}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                View profile
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
