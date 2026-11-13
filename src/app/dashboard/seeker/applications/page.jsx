"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  Bookmark,
  CalendarDays,
  Award,
  Mail,
  Bell,
  RotateCcw,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  APPLICATION_STATUSES,
  getMyApplications,
} from "@/lib/actions/applications";

/* -------------------------------------------------------------------------- */
/* Status styles                                                              */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES = {
  Applied: { pill: "bg-blue-500/10 text-blue-400", dot: "bg-blue-500" },
  "Under Review": { pill: "bg-amber-500/10 text-amber-400", dot: "bg-amber-500" },
  Shortlisted: { pill: "bg-purple-500/10 text-purple-400", dot: "bg-purple-500" },
  Rejected: { pill: "bg-red-500/10 text-red-400", dot: "bg-red-500" },
  Offered: { pill: "bg-emerald-500/10 text-emerald-400", dot: "bg-emerald-500" },
};

const FILTER_OPTIONS = ["All", ...APPLICATION_STATUSES];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeApplication = (app, index) => ({
  id: app._id || app.id || `${app.jobId}-${index}`,
  jobId: app.jobId,
  jobTitle: app.jobTitle || app.title || "Untitled",
  company: app.company || app.companyName || "—",
  jobType: app.jobType || app.type || "Full-time",
  location: app.location || "",
  isRemote: Boolean(app.isRemote),
  status: STATUS_STYLES[app.status] ? app.status : "Applied",
  appliedAt: app.appliedAt || app.createdAt || null,
});

const relativeDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return formatDistanceToNow(parsed, { addSuffix: true });
};

/* -------------------------------------------------------------------------- */
/* UI pieces                                                                  */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Applied;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium ${style.pill}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function ApplicationJobInfo({ application }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
        <Briefcase className="size-3.5 sm:size-4" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-[13px] sm:text-sm font-semibold text-white">
          {application.jobTitle}
        </h3>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] sm:text-xs text-zinc-400">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {application.isRemote
              ? `Remote${application.location ? ` (${application.location})` : ""}`
              : application.location || "—"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function MyApplicationsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const userId = session?.user?.id;

  const fetchApplications = useCallback(() => {
    if (!userId) return;

    getMyApplications(userId)
      .then((result) => {
        setApplications(result.map(normalizeApplication));
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load your applications.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (userId) fetchApplications();
  }, [userId, fetchApplications]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        `/signIn?callbackURL=${encodeURIComponent(
          "/dashboard/seeker/applications"
        )}`
      );
    }
  }, [isPending, session, router]);

  const counts = useMemo(() => {
    const map = { All: applications.length };
    APPLICATION_STATUSES.forEach((status) => {
      map[status] = applications.filter((app) => app.status === status).length;
    });
    return map;
  }, [applications]);

  const visibleApplications = useMemo(() => {
    let result = applications;

    if (filter !== "All") {
      result = result.filter((app) => app.status === filter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.jobTitle.toLowerCase().includes(query) ||
          app.company.toLowerCase().includes(query) ||
          (app.location && app.location.toLowerCase().includes(query))
      );
    }

    return result;
  }, [applications, filter, searchQuery]);

  const startRefresh = () => {
    setLoading(true);
    setError("");
    fetchApplications();
  };

  const handleRetry = () => {
    toast.dismiss();
    startRefresh();
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#0a0a0a]">
        <RefreshCw className="size-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Saved Jobs",
      count: 0,
      icon: Bookmark,
      iconColor: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Applications Submitted",
      count: counts.All || 0,
      icon: FileText,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Interviews Scheduled",
      count: counts["Shortlisted"] || 0,
      icon: CalendarDays,
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Offers Received",
      count: counts["Offered"] || 0,
      icon: Award,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 font-sans p-3 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company or location..."
              className="w-full bg-[#141414] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-all"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-5">
              <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                <Mail className="size-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
                <Bell className="size-5" />
              </button>
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

              <div className="size-9 rounded-full bg-zinc-800 border border-white/10 overflow-hidden cursor-pointer hover:border-white/30 transition-colors">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <Button
              onClick={startRefresh}
              disabled={loading}
              className="flex h-9 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 sm:px-4 text-xs font-medium text-zinc-300 transition-all hover:bg-[#1f1f1f] hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-10">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group bg-[#121212] border border-white/5 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[110px] sm:min-h-[130px] transition-all hover:bg-[#161616] hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] sm:text-[13px] text-zinc-400 font-medium tracking-wide mt-1 leading-tight">
                    {card.title}
                  </span>
                  <div
                    className={`flex items-center justify-center size-8 sm:size-9 shrink-0 rounded-full ${card.bgColor} ${card.iconColor}`}
                  >
                    <Icon className="size-4 sm:size-4.5" strokeWidth={2} />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-white mt-3 sm:mt-4 tracking-tight">
                  {card.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status filter pills - horizontal scroll on mobile */}
        {!loading && !error && applications.length > 0 && (
          <div className="mb-5 sm:mb-6 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap sm:flex-wrap gap-2 w-max sm:w-auto">
              {FILTER_OPTIONS.map((option) => {
                const active = filter === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`shrink-0 rounded-full border px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
                      active
                        ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300"
                        : "border-white/5 bg-[#141414] text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    {option}
                    <span
                      className={`ml-1.5 sm:ml-2 text-[10px] ${
                        active ? "text-indigo-300/70" : "text-zinc-600"
                      }`}
                    >
                      {counts[option] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              Recent Activity
            </h2>
            <button className="hidden sm:block text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              View All Activity
            </button>
          </div>

          <div className="w-full rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <RefreshCw className="size-6 animate-spin text-indigo-400" />
                <p className="mt-3 text-sm text-zinc-400">
                  Loading your applications...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center px-4 py-20 text-center">
                <AlertCircle className="mb-3 size-8 text-red-500" />
                <p className="text-sm text-zinc-400">{error}</p>
                <Button
                  onClick={handleRetry}
                  className="mt-5 h-9 rounded-lg bg-indigo-600 px-5 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  Try Again
                </Button>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-24 text-center">
                <FileText className="mb-4 size-10 text-zinc-600" />
                <p className="text-base font-medium text-zinc-300">
                  No applications yet
                </p>
                <p className="mt-1 max-w-xs text-sm text-zinc-500">
                  Jobs you apply to will show up here so you can track their
                  status.
                </p>
                <Button
                  render={<Link href="/browse-Jobs" />}
                  nativeButton={false}
                  className="mt-6 h-9 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Browse Jobs
                </Button>
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-20 text-center">
                <Briefcase className="mb-3 size-8 text-zinc-600" />
                <p className="text-sm font-medium text-zinc-300">
                  No results found
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {searchQuery
                    ? `No applications matching "${searchQuery}"`
                    : `No "${filter}" applications`}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block lg:hidden">
                  {visibleApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col gap-2.5 border-b border-white/5 p-3.5 sm:p-4 transition-colors last:border-0 hover:bg-white/[0.02]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <ApplicationJobInfo application={application} />
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2.5 mt-0.5">
                        <p className="text-[11px] sm:text-xs text-zinc-500">
                          {relativeDate(application.appliedAt)}
                        </p>
                        <Link
                          href={`/browse-Jobs/${application.jobId}`}
                          className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          View <ArrowUpRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden w-full lg:block">
                  <div className="flex flex-col">
                    {visibleApplications.map((application) => (
                      <div
                        key={application.id}
                        className="group flex items-center justify-between gap-4 border-b border-white/5 p-5 transition-colors last:border-0 hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-5 min-w-0 flex-1">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] border border-white/5 shadow-sm">
                            {application.status === "Offered" ? (
                              <Award className="size-5 text-emerald-500" />
                            ) : application.status === "Under Review" ? (
                              <RotateCcw className="size-5 text-indigo-400" />
                            ) : application.jobTitle
                                .toLowerCase()
                                .includes("job alert") ? (
                              <Briefcase className="size-5 text-emerald-500" />
                            ) : (
                              <Mail className="size-5 text-zinc-400" />
                            )}
                          </div>

                          <div className="min-w-0 text-[13px] sm:text-sm text-zinc-400">
                            {application.jobType === "Job Alert" ? (
                              <>
                                <span className="font-medium text-white">
                                  New Job Alert:{" "}
                                </span>
                                <span className="text-zinc-200">
                                  {application.jobTitle}
                                </span>
                                <span className="text-zinc-500">
                                  {" "}
                                  at {application.company} matches your
                                  profile.
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-zinc-400">
                                  Application for{" "}
                                </span>
                                <span className="font-medium text-zinc-200">
                                  {application.jobTitle}
                                </span>
                                <span className="text-zinc-500"> at </span>
                                <span className="font-medium text-zinc-200">
                                  {application.company}
                                </span>
                                <span className="text-zinc-500">
                                  {" "}
                                  updated to{" "}
                                </span>
                                <span
                                  className={`font-semibold ${
                                    application.status === "Under Review"
                                      ? "text-amber-400"
                                      : application.status === "Offered"
                                      ? "text-emerald-400"
                                      : "text-indigo-400"
                                  }`}
                                >
                                  &quot;{application.status}&quot;
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-6">
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            {relativeDate(application.appliedAt)}
                          </span>
                          <Link
                            href={`/browse-Jobs/${application.jobId}`}
                            className="flex items-center justify-center size-8 rounded-lg bg-white/5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:text-white"
                          >
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 flex size-12 sm:size-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all">
          <Plus className="size-5 sm:size-6" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}