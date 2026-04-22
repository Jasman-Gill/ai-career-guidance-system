import { useCallback, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ title, description, actions, children }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const handleOpenSidebar = useCallback(() => setIsMobileSidebarOpen(true), []);
    const handleCloseSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(234,88,12,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),_transparent_32%),linear-gradient(180deg,_#fffaf3_0%,_#fffdf8_32%,_#f7fbff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#0f172a_0%,_#111827_48%,_#020617_100%)] dark:text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-[1600px]">
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    onClose={handleCloseSidebar}
                />

                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <Navbar onOpenSidebar={handleOpenSidebar} />

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            {(title || description || actions) ? (
                                <section className="motion-card motion-fade-up mb-6 rounded-[1.6rem] border border-white/70 bg-white/75 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:mb-8 sm:rounded-[2rem] sm:p-6 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_28px_80px_rgba(2,6,23,0.45)]">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                        <div className="max-w-3xl">
                                            {title ? (
                                                <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                                                    {title}
                                                </h1>
                                            ) : null}
                                            {description ? (
                                                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                                                    {description}
                                                </p>
                                            ) : null}
                                        </div>

                                        {actions ? (
                                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
                                        ) : null}
                                    </div>
                                </section>
                            ) : null}

                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;
