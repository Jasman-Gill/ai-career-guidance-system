import { useState } from "react";
import Layout from "../../components/layout/Layout";
import IconBubble from "../components/IconBubble";
import { readPreferences, writePreferences } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";

function Settings() {
    const { dark, setDark } = useTheme();
    const [preferences, setPreferences] = useState(readPreferences());

    const handleToggle = (key) => {
        const next = {
            ...preferences,
            [key]: !preferences[key],
        };

        setPreferences(next);
        writePreferences(next);
    };

    return (
        <Layout
            title="Settings"
            description="Manage your app preferences and choose how the career guidance workspace behaves for you."
        >
            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <div className="flex items-center gap-3">
                        <IconBubble icon="moon" tone="orange" className="h-10 w-10 rounded-xl" />
                        <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                            Appearance
                        </h2>
                    </div>
                    <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Theme mode</p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                Switch between light and dark dashboard themes.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDark(!dark)}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-400 dark:text-slate-950"
                        >
                            {dark ? "Dark" : "Light"}
                        </button>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <div className="flex items-center gap-3">
                        <IconBubble icon="bell" tone="sky" className="h-10 w-10 rounded-xl" />
                        <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                            Preferences
                        </h2>
                    </div>

                    <div className="mt-6 space-y-4">
                        {[
                            {
                                key: "notifications",
                                title: "In-app notifications",
                                description: "Show important updates related to your analysis and workspace activity.",
                            },
                            {
                                key: "weeklySummary",
                                title: "Weekly summary",
                                description: "Keep reminders for your roadmap progress and career goals.",
                            },
                            {
                                key: "jobAlerts",
                                title: "Role alerts",
                                description: "Keep role-matching alerts available for future updates.",
                            },
                        ].map((item) => (
                            <div
                                key={item.key}
                                className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        {item.description}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleToggle(item.key)}
                                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                                        preferences[item.key]
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                                    }`}
                                >
                                    {preferences[item.key] ? "On" : "Off"}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-orange-200 bg-orange-50 p-4 text-sm leading-7 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200">
                        <div className="flex items-center gap-2 font-semibold">
                            <IconBubble icon="spark" tone="orange" className="h-7 w-7 rounded-xl bg-transparent" />
                            Personalization tip
                        </div>
                        Keep your profile interests and dream role updated to make recommendations more useful over time.
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default Settings;
