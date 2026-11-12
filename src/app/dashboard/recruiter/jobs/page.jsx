"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  BadgeCheck,
  Briefcase,
  Code2,
  Globe,
  MapPin,
  Megaphone,
  MoreVertical,
  PenTool,
  Pencil,
  Plus,
  Server,
  Trash2,
  Users,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const CATEGORY_STYLES = [
  {
    match: /engineer|tech|develop/i,
    dept: "Engineering",
    icon: Code2,
    box: "bg-indigo-500/10 text-indigo-400",
    text: "text-indigo-400",
  },
  {
    match: /design/i,
    dept: "Design",
    icon: PenTool,
    box: "bg-orange-500/10 text-orange-400",
    text: "text-orange-400",
  },
  {
    match: /infra|devops/i,
    dept: "Infrastructure",
    icon: Server,
    box: "bg-cyan-500/10 text-cyan-400",
    text: "text-cyan-400",
  },
  {
    match: /market|sales/i,
    dept: "Marketing",
    icon: Megaphone,
    box: "bg-purple-500/10 text-purple-400",
    text: "text-purple-400",
  },
  {
    match: /quality|qa|test/i,
    dept: "Quality",
    icon: BadgeCheck,
    box: "bg-sky-500/10 text-sky-400",
    text: "text-sky-400",
  },
];

const FALLBACK_STYLE = {
  dept: "General",
  icon: Briefcase,
  box: "bg-zinc-500/10 text-zinc-400",
  text: "text-zinc-400",
};

const getCategoryStyle = (category = "") => {
  const found = CATEGORY_STYLES.find((item) =>
    item.match.test(String(category)),
  );
  return found ? found : FALLBACK_STYLE;
};

const MOCK_DATA = [
  // ... your existing MOCK_DATA
];

/* -------------------------------------------------------------------------- */
/* Normalize API Data                                                         */
/* -------------------------------------------------------------------------- */

const getId = (job) => job._id || job.id;

const normalizeJob = (job) => ({
  ...job,
  id: getId(job),
  title: job.title || "Untitled",
  category: job.category || "General",
  company: job.company || "—",
  location: job.location || "",
  isRemote: job.isRemote || false,
  type: job.type || "Full-time",
  minSalary: job.minSalary ?? null,
  maxSalary: job.maxSalary ?? null,
  frequency: job.frequency || "year",
  currency: job.currency || "€",
  applicants: job.applicants ?? 0,
  deadline: job.deadline || null,
  createdAt: job.createdAt || null,
});

const formatCompensation = (job) => {
  if (job.minSalary == null && job.maxSalary == null) return "—";
  const freq = { hour: "hr", year: "yr" }[job.frequency] || job.frequency;
  if (job.minSalary != null && job.maxSalary != null) {
    return `${job.currency}${job.minSalary}k – ${job.currency}${job.maxSalary}k / ${freq}`;
  }
  return `${job.currency}${job.minSalary ?? job.maxSalary}k / ${freq}`;
};

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const timeAgo = (date) => {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  if (Number.isNaN(diff)) return "—";
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const isExpired = (deadline) =>
  deadline ? new Date(deadline).getTime() < Date.now() : false;

/* -------------------------------------------------------------------------- */
/* UI Components                                                              */
/* -------------------------------------------------------------------------- */

function StatusBadge({ expired }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium sm:text-[10px] ${
        expired
          ? "bg-zinc-500/10 text-zinc-400"
          : "bg-emerald-500/10 text-emerald-500"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          expired ? "bg-zinc-500" : "bg-emerald-500"
        }`}
      />
      {expired ? "Expired" : "Active"}
    </span>
  );
}

function JobInfo({ job }) {
  const style = getCategoryStyle(job.category);
  const Icon = style.icon;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-md sm:size-8 ${style.box}`}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-xs font-semibold text-white group-hover:text-indigo-300 sm:text-[11px]">
          {job.title}
        </h3>
        <p className={`mt-0.5 truncate text-[10px] sm:text-[9px] ${style.text}`}>
          {job.category}
        </p>
      </div>
    </div>
  );
}

function CompanyInfo({ job }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-medium text-zinc-200 sm:text-[11px]">
        {job.company}
      </p>
      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500 sm:text-[9px]">
        {job.isRemote ? (
          <Globe className="size-2.5 shrink-0" />
        ) : (
          <MapPin className="size-2.5 shrink-0" />
        )}
        <span className="truncate">
          {job.isRemote ? "Remote " : ""}
          {job.location ? `(${job.location})` : ""}
        </span>
      </p>
    </div>
  );
}

function JobActions({ job, onUpdate, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="outline"
        onClick={() => onUpdate?.(job)}
        className="h-7 rounded border-white/10 bg-white/5 px-2 text-[10px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white sm:h-6 sm:text-[9px]"
      >
        <Pencil className="mr-1 size-2.5" />
        Update
      </Button>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={() => onDelete?.(job)}
        className="size-7 rounded text-zinc-400 hover:bg-red-500/10 hover:text-red-400 sm:size-6"
      >
        <Trash2 className="size-3.5 sm:size-3" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7 rounded text-zinc-400 hover:bg-white/10 hover:text-white sm:size-6"
            />
          }
        >
          <MoreVertical className="size-3.5 sm:size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-white/10 bg-[#1b1b1f] text-zinc-200"
        >
          <DropdownMenuItem>View applicants</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Close listing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Card Row                                                            */
/* -------------------------------------------------------------------------- */

function JobCard({ job, onUpdate, onDelete }) {
  const expired = isExpired(job.deadline);

  return (
    <div className="group flex flex-col gap-3 border-b border-white/[0.05] p-3.5 transition-colors last:border-0 hover:bg-white/[0.02]">
      {/* Top: Job info + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <JobInfo job={job} />
        </div>
        <JobActions job={job} onUpdate={onUpdate} onDelete={onDelete} />
      </div>

      {/* Company + Location */}
      <CompanyInfo job={job} />

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-white/[0.03] px-2.5 py-1.5">
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">
            Type
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-zinc-200">
            {job.type}
          </p>
        </div>
        <div className="rounded-md bg-white/[0.03] px-2.5 py-1.5">
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">
            Applicants
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-zinc-200">
            <Users className="size-3 text-zinc-400" />
            {job.applicants}
          </p>
        </div>
        <div className="rounded-md bg-white/[0.03] px-2.5 py-1.5">
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">
            Compensation
          </p>
          <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-200">
            {formatCompensation(job)}
          </p>
        </div>
        <div className="rounded-md bg-white/[0.03] px-2.5 py-1.5">
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">
            Status
          </p>
          <div className="mt-0.5">
            <StatusBadge expired={expired} />
          </div>
        </div>
      </div>

      {/* Footer: Deadline */}
      <div className="flex items-center justify-between border-t border-white/[0.05] pt-2.5">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">
            Deadline
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-200">
            {formatDate(job.deadline)}
          </p>
        </div>
        <p className="text-[10px] text-zinc-500">
          {expired ? "Closed" : `Posted ${timeAgo(job.createdAt)}`}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function ManageJobs({
  onUpdate,
  newJobHref = "/add-job",
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      try {
        const response = await fetch("http://localhost:5000/jobs", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("API Error");
        const result = await response.json();
        const jobData = Array.isArray(result) ? result : result.jobs || [];
        setJobs(jobData.map(normalizeJob));
      } catch (err) {
        setJobs(MOCK_DATA.map(normalizeJob));
      }
    } catch (err) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting job...");

    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete job.");

      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobToDelete.id));

      toast.success("Job deleted successfully!", { id: toastId });
      setJobToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job. Please try again.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-full min-w-0 text-zinc-200">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
            <span>Manage Jobs</span>
            <span>&gt;</span>
            <span className="text-zinc-400">Job Listings & Postings</span>
          </nav>

          <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
            Manage Job Posts
          </h1>

          <p className="mt-1 max-w-xl text-[11px] text-zinc-400 sm:text-xs">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            render={<Link href={newJobHref} />}
            nativeButton={false}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-500 active:scale-[0.98] sm:w-auto"
          >
            <Plus className="size-4" />
            New Job Post
          </Button>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full rounded-xl border border-white/[0.07] bg-[#121214]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <RefreshCw className="size-5 animate-spin text-indigo-400" />
            <p className="mt-2 text-xs text-zinc-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <AlertCircle className="mb-2 size-6 text-red-500" />
            <p className="text-xs text-zinc-400">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <Briefcase className="mb-3 size-8 text-zinc-600" />
            <p className="text-sm font-medium text-zinc-300">No jobs found</p>
            <p className="mt-1 text-xs text-zinc-500">
              Create a new job post to get started.
            </p>
          </div>
        ) : (
          <>
            {/* ---------------- Mobile / Tablet Cards ---------------- */}
            <div className="block lg:hidden">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onUpdate={onUpdate}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {/* ---------------- Desktop Table ---------------- */}
            <div className="hidden w-full overflow-x-auto rounded-xl lg:block">
              <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
                <thead className="bg-[#0d0d0f]">
                  <tr className="border-b border-white/[0.07]">
                    <th className="w-[18%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Job Title & Dept
                    </th>
                    <th className="w-[18%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Company & Location
                    </th>
                    <th className="w-[10%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Type
                    </th>
                    <th className="w-[14%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Compensation
                    </th>
                    <th className="w-[9%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Applicants
                    </th>
                    <th className="w-[9%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>
                    <th className="w-[12%] px-3 py-3.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Deadline
                    </th>
                    <th className="w-[10%] px-3 py-3.5 text-right text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const expired = isExpired(job.deadline);
                    return (
                      <tr
                        key={job.id}
                        className="group border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-3 align-middle">
                          <JobInfo job={job} />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <CompanyInfo job={job} />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <span className="whitespace-nowrap rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-medium text-zinc-300">
                            {job.type}
                          </span>
                        </td>
                        <td className="truncate px-3 py-3 align-middle text-[10px] text-zinc-300">
                          {formatCompensation(job)}
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-300">
                            <Users className="size-3 text-zinc-400" />
                            {job.applicants}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <StatusBadge expired={expired} />
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <p className="whitespace-nowrap text-[10px] text-zinc-200">
                            {formatDate(job.deadline)}
                          </p>
                          <p className="mt-0.5 whitespace-nowrap text-[9px] text-zinc-500">
                            {expired
                              ? "Closed"
                              : `Posted ${timeAgo(job.createdAt)}`}
                          </p>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <JobActions
                            job={job}
                            onUpdate={onUpdate}
                            onDelete={handleDeleteClick}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Confirm Delete Modal                                            */}
      {/* ---------------------------------------------------------------- */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-white/10 bg-[#1b1b1f] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    Delete Job Post?
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-zinc-200">
                      "{jobToDelete.title}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse items-stretch gap-2 border-t border-white/[0.07] bg-[#121214] px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => setJobToDelete(null)}
                disabled={isDeleting}
                className="h-9 rounded-md px-3 text-xs font-medium text-zinc-400 hover:bg-white/10 hover:text-white sm:h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="h-9 rounded-md bg-red-600 px-4 text-xs font-medium text-white hover:bg-red-500 sm:h-8"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}