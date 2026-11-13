"use client";

import { useState, useMemo , useEffect} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Banknote,
  BadgeCheck,
  Bookmark,
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Megaphone,
  PenTool,
  Search,
  Server,
  Star,
  AlertCircle,
} from "lucide-react";

const PAGE_SIZE = 6;

const JOB_TYPES = [
  "Full-time",
  "Contract",
  "Part-time",
  "Internship",
  "Freelance",
  "Other",
];

const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Infrastructure",
  "Quality Assurance",
  "General",
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "title", label: "Title A-Z" },
  { value: "salary", label: "Salary: High to Low" },
];

const CATEGORY_STYLES = [
  {
    match: /engineer|tech|develop/i,
    icon: Code2,
    box: "bg-indigo-500/10 text-indigo-400",
  },
  { match: /design/i, icon: PenTool, box: "bg-orange-500/10 text-orange-400" },
  { match: /infra|devops/i, icon: Server, box: "bg-cyan-500/10 text-cyan-400" },
  {
    match: /market|sales/i,
    icon: Megaphone,
    box: "bg-purple-500/10 text-purple-400",
  },
  {
    match: /quality|qa|test/i,
    icon: BadgeCheck,
    box: "bg-sky-500/10 text-sky-400",
  },
];

const FALLBACK_STYLE = {
  icon: Briefcase,
  box: "bg-zinc-500/10 text-zinc-400",
};

const getCategoryStyle = (category) =>
  CATEGORY_STYLES.find((style) => style.match.test(category || "")) ||
  FALLBACK_STYLE;

const formatSalary = (job) => {
  const currency = job.currency || "€";

  if (job.minSalary && job.maxSalary)
    return `${currency}${job.minSalary}k - ${currency}${job.maxSalary}k`;

  if (job.minSalary) return `${currency}${job.minSalary}k`;
  if (job.maxSalary) return `${currency}${job.maxSalary}k`;

  return "";
};

const isSenior = (title) => /senior|lead|principal|staff/i.test(title || "");

const getPageItems = (page, totalPages) => {
  const items = [];

  for (let p = 1; p <= totalPages; p += 1) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      items.push(p);
    } else if (items[items.length - 1] !== "…") {
      items.push("…");
    }
  }

  return items;
};

export default function BrowseJobsClient({ jobs, loadError }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  
const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || ""
  );

    const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(value) ||
          job.company?.toLowerCase().includes(value) ||
          job.category?.toLowerCase().includes(value) ||
          job.location?.toLowerCase().includes(value),
      );
    }

    if (selectedType) {
      result = result.filter((job) => job.type === selectedType);
    }

    if (selectedCategory) {
      result = result.filter(
        (job) => (job.category || "General") === selectedCategory,
      );
    }

    if (sort === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sort === "salary") {
      result.sort(
        (a, b) => Number(b.minSalary || 0) - Number(a.minSalary || 0),
      );
    } else {
      result.sort((a, b) => String(b._id).localeCompare(String(a._id)));
    }

    return result;
  }, [jobs, search, selectedType, selectedCategory, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const pageJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );


const updateURL = (key, value) => {
  const params = new URLSearchParams(searchParams.toString());

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  router.push(`${pathname}?${params.toString()}`, {
    scroll: false,
  });
};


 const handleTypeChange = (type) => {
  const newType = selectedType === type ? "" : type;

  setSelectedType(newType);
  updateURL("type", newType);
  setPage(1);
};

const handleCategoryChange = (category) => {
  const newCategory = selectedCategory === category ? "" : category;

  setSelectedCategory(newCategory);
  updateURL("category", newCategory);
  setPage(1);
};

  // API unreachable -> honest error state (not a fake "No jobs found")
  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-white/[0.07] bg-[#121214] px-4 py-16 text-center">
          <AlertCircle className="mx-auto size-8 text-red-500" />
          <p className="mt-3 text-sm font-medium text-zinc-300">
            Couldn&apos;t load jobs
          </p>
          <p className="mt-1 max-w-md text-xs text-zinc-500">{loadError}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
        }}
        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#121214] p-2 pl-4"
      >
        <Search className="size-4 shrink-0 text-zinc-500" />

        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by job title, keywords..."
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
        />

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
        >
          Search Jobs
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Filters */}
        <aside className="w-full shrink-0 lg:w-[220px]">
          <div className="rounded-xl border border-white/[0.07] bg-[#121214] p-4">
            <h2 className="text-sm font-semibold text-white">Filters</h2>

            <p className="mt-4 text-xs font-medium text-zinc-400">Job Type</p>

            <div className="mt-3 flex flex-col gap-2.5">
              {JOB_TYPES.map((type) => {
                const isActive = selectedType === type;

                const count = jobs.filter((job) => job.type === type).length;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className="group flex items-center gap-2.5 text-left text-xs"
                  >
                    <span
                      className={`flex size-3.5 shrink-0 items-center justify-center rounded border ${
                        isActive
                          ? "border-zinc-300 bg-zinc-200"
                          : "border-zinc-600 group-hover:border-zinc-400"
                      }`}
                    >
                      {isActive && (
                        <Check
                          className="size-2.5 text-zinc-900"
                          strokeWidth={3}
                        />
                      )}
                    </span>

                    <span
                      className={
                        isActive
                          ? "text-zinc-200"
                          : "text-zinc-400 group-hover:text-zinc-200"
                      }
                    >
                      {type}
                    </span>

                    <span className="ml-auto text-zinc-500">{count}</span>
                  </button>
                );
              })}

              <p className="mt-5 text-xs font-medium text-zinc-400">Category</p>

              <div className="mt-3 flex flex-col gap-2.5">
                {JOB_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;

                  const count = jobs.filter(
                    (job) => (job.category || "General") === category,
                  ).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className="group flex items-center gap-2.5 text-left text-xs"
                    >
                      <span
                        className={`flex size-3.5 shrink-0 items-center justify-center rounded border ${
                          isActive
                            ? "border-zinc-300 bg-zinc-200"
                            : "border-zinc-600 group-hover:border-zinc-400"
                        }`}
                      >
                        {isActive && (
                          <Check
                            className="size-2.5 text-zinc-900"
                            strokeWidth={3}
                          />
                        )}
                      </span>

                      <span
                        className={
                          isActive
                            ? "text-zinc-200"
                            : "text-zinc-400 group-hover:text-zinc-200"
                        }
                      >
                        {category}
                      </span>

                      <span className="ml-auto text-zinc-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-base font-semibold text-white">
              Found {filteredJobs.length} Professional{" "}
              {filteredJobs.length === 1 ? "Job" : "Jobs"}
            </h1>

            {/* Sort dropdown */}
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/[0.07] bg-[#121214] px-3 py-2 text-xs text-zinc-300 [&::-webkit-details-marker]:hidden">
                Sort by:{" "}
                {SORT_OPTIONS.find((item) => item.value === sort)?.label}
                <ChevronDown className="size-3.5 text-zinc-500" />
              </summary>

              <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1f] shadow-xl">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value);
                      setPage(1);
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs hover:bg-white/5 ${
                      option.value === sort ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </details>
          </div>

          {/* Job Cards */}
          {pageJobs.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#121214] px-4 py-16 text-center">
              <Briefcase className="mx-auto size-8 text-zinc-600" />

              <p className="mt-3 text-sm font-medium text-zinc-300">
                No jobs found
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Try a different search or remove some filters.
              </p>
            </div>
          ) : (
            <ul className="mt-6 flex flex-col gap-4">
              {pageJobs.map((job) => {
                const style = getCategoryStyle(job.category);
                const Icon = style.icon;
                const salary = formatSalary(job);

                return (
                  <li key={job._id}>
                    <Link
                      href={`/browse-Jobs/${job._id}`}
                      className="flex w-full gap-4 rounded-xl border border-white/[0.07] bg-[#121214] p-4 transition hover:border-white/20 hover:bg-[#18181b]"
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${style.box}`}
                      >
                        <Icon className="size-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-[15px] font-semibold text-white">
                          {job.title || "Untitled"}
                        </h2>

                        <p className="mt-1 truncate text-xs text-zinc-400">
                          {job.company || "—"} • {job.location || "—"}
                          {job.isRemote && job.location !== "Remote"
                            ? " (Remote)"
                            : ""}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {salary && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
                              <Banknote className="size-3 text-zinc-400" />
                              {salary}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
                            <Clock className="size-3 text-zinc-400" />
                            {job.type}
                          </span>

                          {isSenior(job.title) && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
                              <Star className="size-3 text-amber-400" />
                              Senior
                            </span>
                          )}
                        </div>
                      </div>

                      <Bookmark className="size-4 shrink-0 text-zinc-500" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex size-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>

              {getPageItems(currentPage, totalPages).map((item, index) =>
                item === "…" ? (
                  <span
                    key={`gap-${index}`}
                    className="px-1 text-xs text-zinc-500"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    className={`flex size-8 items-center justify-center rounded-md text-xs font-medium ${
                      item === currentPage
                        ? "bg-white text-zinc-900"
                        : "border border-white/10 text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex size-8 items-center justify-center rounded-md border border-white/10 text-zinc-400 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
