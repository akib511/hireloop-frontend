import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { 
  Banknote, 
  MapPin, 
  Bookmark, 
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  MonitorSmartphone,
  CheckCircle2
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const formatSalary = (job) => {
  const currency = job.currency || "€";
  if (job.minSalary && job.maxSalary)
    return `${currency}${job.minSalary}k - ${currency}${job.maxSalary}k`;
  if (job.minSalary) return `${currency}${job.minSalary}k`;
  if (job.maxSalary) return `${currency}${job.maxSalary}k`;
  return "";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

// লিস্ট ডিজাইন আরও সুন্দর করা হয়েছে
const Description = ({ items }) =>
  items.length > 1 ? (
    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
      {items.map((line, index) => (
        <li key={index} className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-400/80" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-4 text-sm leading-relaxed text-zinc-300">{items[0]}</p>
  );

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

async function JobDetailsContent({ params }) {
  const { id } = await params;

  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    notFound();
  }

  const job = await res.json();

  const salary = formatSalary(job);
  const salaryText = salary
    ? `${salary}${job.frequency ? ` / ${job.frequency}` : ""}`
    : "—";
  const responsibilities = toList(job.responsibilities);
  const requirements = toList(job.requirements);

  const details = [
    { label: "Job Type", value: job.type || "—", icon: BriefcaseBusiness },
    { label: "Category", value: job.category || "—", icon: MonitorSmartphone },
    { label: "Location", value: job.location || "—", icon: MapPin },
    { label: "Salary", value: salaryText, icon: Banknote },
    { label: "Deadline", value: formatDate(job.deadline), icon: CalendarClock },
    { label: "Remote", value: job.isRemote ? "Yes" : "No", icon: MonitorSmartphone },
  ];

  return (
    <>
      {/* Job Header */}
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8">
        {/* Subtle top gradient glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight break-words text-white sm:text-3xl lg:text-4xl">
              {job.title || "Untitled"}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-base font-medium text-zinc-300">
                {job.company || "—"}
              </p>

              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
                {job.type}
              </span>

              {job.isRemote && (
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                  Remote
                </span>
              )}
            </div>

            {/* Quick facts */}
            <div className="mt-6 flex flex-wrap gap-3">
              {salary && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-300">
                  <Banknote className="size-4 text-zinc-500" />
                  {salary}
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-300">
                <MapPin className="size-4 text-zinc-500" />
                {job.location || "—"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/[0.05] hover:border-white/20">
              <Bookmark className="size-4" />
              Bookmark
            </button>

            <button className="rounded-xl bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Content — description + sticky details sidebar */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {responsibilities.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-4">
                Responsibilities
              </h2>
              <Description items={responsibilities} />
            </section>
          )}

          {requirements.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-4">
                Requirements
              </h2>
              <Description items={requirements} />
            </section>
          )}

          {responsibilities.length === 0 && requirements.length === 0 && (
            <section className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8">
              <p className="text-sm text-zinc-400">
                No description provided for this job.
              </p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="rounded-3xl border border-white/10 bg-[#121214] p-6 sm:p-8 lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-4">
            Job Details
          </h2>

          <div className="mt-2 divide-y divide-white/5">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-4 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-md bg-white/5 p-1.5">
                    <Icon className="size-4 text-zinc-400" />
                  </div>
                  <span className="text-zinc-400">{label}</span>
                </div>
                <span className="text-right font-medium text-zinc-200">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

// loading placeholder
const JobDetailsSkeleton = () => (
  <div aria-hidden="true" className="mt-4">
    <span className="sr-only">Loading job...</span>
    <div className="h-56 animate-pulse rounded-3xl bg-white/5" />
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
    </div>
  </div>
);

export default function JobDetailsPage({ params }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/browse-Jobs"
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Back to jobs
      </Link>

      <Suspense fallback={<JobDetailsSkeleton />}>
        <JobDetailsContent params={params} />
      </Suspense>
    </div>
  );
}