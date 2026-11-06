import Image from "next/image";
import { BarChart3, Briefcase, MapPin, Search, Star, UserSearch } from "lucide-react";

const trendingPositions = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

const stats = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: BarChart3, value: "12K", label: "Companies" },
  { icon: UserSearch, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Soft light behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(55%_65%_at_50%_0%,rgba(255,255,255,0.09),transparent_72%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 text-center sm:px-8 sm:pt-24">
        {/* Badge */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/30 sm:block"
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] tracking-widest">
            <Briefcase aria-hidden="true" className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-orange-400">50,000+</span>
            <span className="text-zinc-400">NEW JOBS THIS MONTH</span>
          </span>
          <span
            aria-hidden="true"
            className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/30 sm:block"
          />
        </div>

        {/* Headline */}
        <h1 className="mt-7 text-4xl font-bold tracking-tight lg:text-5xl">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400 lg:text-base">
          HireLoop connects top talent with world-class companies. Browse thousands of
          curated opportunities and land your next role — faster.
        </p>

        {/* Job search */}
        <form className="mx-auto mt-6 flex max-w-lg items-center gap-1.5 rounded-xl border border-white/10 bg-[#111111] p-1 pl-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] focus-within:ring-2 focus-within:ring-indigo-500/50 sm:gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2.5">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
            <input
              type="text"
              name="q"
              placeholder="Job title, skill or company"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            />
          </div>

          <span aria-hidden="true" className="h-7 w-px bg-white/10" />

          <div className="flex h-9 min-w-0 flex-1 items-center gap-2.5 pl-3">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
            <input
              type="text"
              name="location"
              placeholder="Location or Remote"
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            />
          </div>

          <button
            type="submit"
            aria-label="Search jobs"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white transition-colors hover:bg-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>

        {/* Trending positions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-[11px] text-zinc-500 lg:text-xs">Trending Position</span>
          {trendingPositions.map((position) => (
            <span
              key={position}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 lg:text-xs"
            >
              {position}
            </span>
          ))}
        </div>
      </div>

      {/* Globe + stats */}
      <div className="relative pb-16 sm:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/assets/globe.png"
            alt=""
            width={1440}
            height={1882}
            className="absolute left-1/2 top-[calc(5rem_-_54vw)] w-[92vw] max-w-none -translate-x-1/2"
          />
        </div>

        <p className="relative mx-auto max-w-md px-5 pt-44 text-center text-2xl font-medium leading-snug text-zinc-100 sm:max-w-lg sm:text-3xl lg:text-4xl">
          Assisting over 15,000 job seekers{" "}
          <span className="text-zinc-300">find their dream positions.</span>
        </p>

        <div className="relative mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 sm:px-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 transition-colors hover:border-white/20 sm:p-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Icon aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              </span>
              <p className="mt-5 text-4xl font-bold tracking-tight lg:text-5xl">{value}</p>
              <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
