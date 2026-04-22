import { useState } from "react";
import Layout from "../../components/layout/Layout";
import API from "../services/api";
import IconBubble from "../components/IconBubble";
import { readStoredAnalysis, readStoredUser, writeStoredUser } from "../utils/storage";

function Profile() {
    const user = readStoredUser();
    const analysis = readStoredAnalysis();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [interests, setInterests] = useState((user?.interests || []).join(", "));
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const { data } = await API.put("/auth/profile", {
                userId: user?._id,
                name,
                email,
                interests: interests
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
            });

            writeStoredUser({
                ...user,
                ...data,
            });
            setMessage("Profile updated successfully.");
        } catch (requestError) {
            setError(requestError?.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const stats = [
        { label: "Dream Role", value: analysis?.dreamRole || "Not set yet" },
        { label: "Dream Company", value: analysis?.dreamCompany || "Not set yet" },
        { label: "Alignment Score", value: analysis ? `${analysis.alignmentScore}%` : "No analysis" },
    ];

    return (
        <Layout
            title="Profile"
            description="Update your personal details and interests so your career recommendations stay relevant and useful."
        >
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <section className="space-y-6">
                    <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-xl font-semibold text-white dark:bg-orange-400 dark:text-slate-950">
                            {(user?.name || user?.email || "U")
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>
                        <h2 className="mt-4 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                            {user?.name || "User"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {user?.email || "No email available"}
                        </p>

                        <div className="mt-6 space-y-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40"
                                >
                                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                        Edit profile information
                    </h2>

                    <form className="mt-6 space-y-5" onSubmit={handleSave}>
                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Full Name
                            </span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-slate-950/50">
                                <IconBubble icon="user" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white"
                                />
                            </div>
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Email
                            </span>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10 dark:bg-slate-950/50">
                                <IconBubble icon="mail" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white"
                                />
                            </div>
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Interests
                            </span>
                            <textarea
                                rows={4}
                                value={interests}
                                onChange={(event) => setInterests(event.target.value)}
                                placeholder="AI, frontend engineering, data analysis, startups"
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950/50 dark:text-white"
                            />
                        </label>

                        {message ? (
                            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                                {message}
                            </p>
                        ) : null}

                        {error ? (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-orange-400 dark:text-slate-950 dark:hover:bg-orange-300"
                        >
                            {saving ? "Saving..." : "Save changes"}
                            <IconBubble icon="spark" tone="slate" className="h-7 w-7 rounded-xl bg-transparent text-white dark:text-slate-950" />
                        </button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}

export default Profile;
