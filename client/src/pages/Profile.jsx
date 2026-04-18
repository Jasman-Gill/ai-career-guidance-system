import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import API from "../services/api";

function Profile() {
    const location = useLocation();

    const user = useMemo(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    }, []);

    const params = new URLSearchParams(location.search);
    const activeTab = params.get("tab") === "settings" ? "settings" : "profile";

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [interests, setInterests] = useState((user?.interests || []).join(", "));
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            if (!user?._id) {
                setError("User not found. Please log in again.");
                setSaving(false);
                return;
            }

            const interestsList = interests
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            const { data } = await API.put("/auth/profile", {
                userId: user._id,
                name,
                email,
                interests: interestsList,
            });

            const updatedUser = {
                ...user,
                ...data,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("userUpdated"));
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg md:col-span-1">
                    <div className="w-16 h-16 rounded-full bg-blue-500 text-white text-xl font-semibold flex items-center justify-center mb-4">
                        {(user?.name || user?.email || "U")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user?.name || "Guest User"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                        {user?.email || "No email available"}
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg md:col-span-2">
                    {activeTab === "settings" ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Profile Settings
                            </h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        Interests
                                    </label>
                                    <input
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white"
                                        placeholder="AI, Web Development, Data Science"
                                    />
                                </div>

                                {message ? (
                                    <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                                ) : null}
                                {error ? (
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-70"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                My Profile
                            </h2>
                            <p className="text-gray-700 dark:text-gray-200 mb-2">
                                Name: {user?.name || "Not provided"}
                            </p>
                            <p className="text-gray-700 dark:text-gray-200">
                                Email: {user?.email || "Not provided"}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
