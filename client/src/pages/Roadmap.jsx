import Layout from "../../components/layout/Layout";
import IconBubble from "../components/IconBubble";
import { readStoredAnalysis } from "../utils/storage";

function splitPhaseIntoCheckpoints(description = "") {
    const cleaned = String(description || "").trim();
    if (!cleaned) {
        return [];
    }

    const sentenceParts = cleaned
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.replace(/^\d+[\).\s-]*/, "").trim())
        .filter(Boolean);

    if (sentenceParts.length > 1) {
        return sentenceParts.slice(0, 3);
    }

    const clauseParts = cleaned
        .split(/,| and | then /i)
        .map((item) => item.replace(/^\d+[\).\s-]*/, "").trim())
        .filter(Boolean);

    return clauseParts.slice(0, 3);
}

function getWeekLabel(phaseNumber, totalPhases) {
    if (!totalPhases) {
        return `Phase ${phaseNumber}`;
    }

    const totalWeeks = 12;
    const startWeek = Math.floor(((phaseNumber - 1) * totalWeeks) / totalPhases) + 1;
    const endWeek = Math.floor((phaseNumber * totalWeeks) / totalPhases);

    if (startWeek >= endWeek) {
        return `Week ${startWeek}`;
    }

    return `Weeks ${startWeek}-${endWeek}`;
}

function getPhaseEmphasis(phaseNumber, totalPhases) {
    if (totalPhases <= 1) {
        return "Build steady momentum";
    }

    if (phaseNumber === 1) {
        return "Build the base";
    }

    if (phaseNumber === totalPhases) {
        return "Convert effort into opportunity";
    }

    return "Strengthen and apply";
}

function Roadmap() {
    const analysis = readStoredAnalysis();
    const steps = analysis?.roadmapSteps || [];
    const highlightedSkills = (analysis?.missingSkills || []).slice(0, 6);
    const dreamRole = analysis?.dreamRole || "your target role";
    const dreamCompany = analysis?.dreamCompany || "your dream company";

    const roadmapPhases = steps.length
        ? steps.map((step, index) => {
              const phaseNumber = index + 1;

              return {
                  ...step,
                  phaseNumber,
                  weekLabel: getWeekLabel(phaseNumber, steps.length),
                  emphasis: getPhaseEmphasis(phaseNumber, steps.length),
                  checkpoints: splitPhaseIntoCheckpoints(step.description),
              };
          })
        : [];

    const motivationPoints = [
        `This plan is aligned toward ${dreamRole}, so every milestone should support that direction.`,
        `Use ${dreamCompany} as your benchmark when deciding what to study, build, and practice.`,
        "Your goal is steady weekly progress, not trying to complete everything at once.",
    ];

    return (
        <Layout
            title="Roadmap"
            description="Follow a structured learning plan that breaks your target role preparation into smaller, manageable phases."
        >
            {!roadmapPhases.length ? (
                <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                        No roadmap yet
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Run an analysis first and your personalized roadmap will appear here.
                    </p>
                </section>
            ) : (
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(255,250,245,0.92))] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(17,24,39,0.88))]">
                        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
                            <div>
                                <div className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 dark:border-orange-400/20 dark:bg-white/5 dark:text-orange-200">
                                    <IconBubble icon="roadmap" tone="orange" className="h-8 w-8 rounded-full bg-transparent" />
                                    90-Day Learning Plan
                                </div>

                                <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[2.8rem]">
                                    A structured roadmap for steady role-focused preparation.
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
                                    Move toward{" "}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {dreamRole}
                                    </span>{" "}
                                    with smaller, more visible wins that stay relevant to{" "}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {dreamCompany}
                                    </span>
                                    .
                                </p>

                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    <article className="rounded-[1.5rem] border border-white/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                            Total phases
                                        </p>
                                        <p className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                                            {roadmapPhases.length}
                                        </p>
                                    </article>

                                    <article className="rounded-[1.5rem] border border-white/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                            Focus skills
                                        </p>
                                        <p className="mt-3 font-display text-3xl font-semibold text-slate-900 dark:text-white">
                                            {highlightedSkills.length || "0"}
                                        </p>
                                    </article>

                                    <article className="rounded-[1.5rem] border border-white/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                            Destination
                                        </p>
                                        <p className="mt-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                                            {dreamRole}
                                        </p>
                                    </article>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-950/45 dark:shadow-none">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                                    Motivation cues
                                </p>
                                <div className="mt-5 space-y-4">
                                    {motivationPoints.map((point) => (
                                        <div
                                            key={point}
                                            className="flex gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                        >
                                            <IconBubble icon="spark" tone="orange" className="mt-0.5 h-8 w-8 rounded-xl" />
                                            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                            <div className="flex items-center gap-3">
                                <IconBubble icon="roadmap" tone="slate" filled />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                                        Guided Timeline
                                    </p>
                                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                        Phase-wise learning plan
                                    </h2>
                                </div>
                            </div>

                            <div className="relative mt-8 space-y-5 pl-4 sm:pl-6">
                                <div className="absolute bottom-0 left-[1.45rem] top-0 w-[2px] bg-gradient-to-b from-orange-300 via-sky-300 to-emerald-300 dark:from-orange-400/35 dark:via-sky-400/30 dark:to-emerald-400/35" />

                                {roadmapPhases.map((phase) => (
                                    <div key={`${phase.title}-${phase.phaseNumber}`} className="relative">
                                        <div className="absolute left-[-0.15rem] top-6 z-10 flex h-12 w-12 items-center justify-center rounded-[1.2rem] border-4 border-white bg-slate-900 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:border-slate-900 dark:bg-orange-400 dark:text-slate-950">
                                            {phase.phaseNumber}
                                        </div>

                                        <div className="ml-14 rounded-[1.65rem] border border-slate-200/80 bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.9))] p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.78),_rgba(30,41,59,0.56))]">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                                                        {phase.weekLabel}
                                                    </p>
                                                    <h3 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
                                                        {phase.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-200">
                                                        {phase.emphasis}
                                                    </p>
                                                </div>

                                                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-200">
                                                    <IconBubble icon="clock" tone="orange" className="h-6 w-6 rounded-full bg-transparent" />
                                                    {phase.weekLabel}
                                                </div>
                                            </div>

                                            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                {phase.description}
                                            </p>

                                            {phase.checkpoints.length ? (
                                                <div className="mt-4 grid gap-3">
                                                    {phase.checkpoints.map((checkpoint, checkpointIndex) => (
                                                        <div
                                                            key={`${phase.title}-${checkpointIndex}`}
                                                            className="flex gap-3 rounded-[1.15rem] border border-slate-200 bg-white/85 px-3 py-3 dark:border-white/10 dark:bg-white/5"
                                                        >
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                                                <IconBubble icon="check" tone="emerald" className="h-6 w-6 rounded-full bg-transparent" />
                                                            </div>
                                                            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                                {checkpoint}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <div className="space-y-6">
                            <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                                <div className="flex items-center gap-3">
                                    <IconBubble icon="trend" tone="orange" className="h-10 w-10 rounded-xl" />
                                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                        Focus skills
                                    </h2>
                                </div>

                                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    Keep these skills in focus while moving through each phase so your effort stays aligned with your target role.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {highlightedSkills.length ? (
                                        highlightedSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-200"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Run analysis again to surface priority skills here.
                                        </p>
                                    )}
                                </div>
                            </article>

                            <article className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-900/65">
                                <div className="flex items-center gap-3">
                                    <IconBubble icon="clock" tone="sky" className="h-10 w-10 rounded-xl" />
                                    <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                                        Weekly rhythm
                                    </h2>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {[
                                        "Learn one focused concept each week instead of spreading effort too thin.",
                                        "Build proof with a project, case study, or portfolio update after every phase.",
                                        "Revisit your resume and interview story regularly so your growth stays visible.",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                        >
                                            <IconBubble icon="check" tone="emerald" className="mt-0.5 h-8 w-8 rounded-xl" />
                                            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)] dark:border-white/10 dark:from-orange-500 dark:to-amber-500 dark:text-slate-950">
                                <div className="flex items-center gap-3">
                                    <IconBubble icon="spark" tone="orange" className="h-10 w-10 rounded-xl bg-white/15 text-white dark:bg-black/10 dark:text-slate-950" />
                                    <h2 className="font-display text-2xl font-semibold">
                                        Stay consistent
                                    </h2>
                                </div>
                                <p className="mt-4 text-sm leading-8 text-slate-200 dark:text-slate-950/80">
                                    Focus on one checkpoint at a time and complete each phase steadily so your preparation remains realistic and measurable.
                                </p>
                            </article>
                        </div>
                    </section>
                </div>
            )}
        </Layout>
    );
}

export default Roadmap;
