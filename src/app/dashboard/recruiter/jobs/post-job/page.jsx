"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Globe,
  MapPin,
  Euro,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // <-- 1. Notun Import
import { createjob } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Customer Support",
  "Finance",
  "Human Resources",
];

const FREQUENCIES = [
  { value: "hour", label: "per hour" },
  { value: "day", label: "per day" },
  { value: "week", label: "per week" },
  { value: "month", label: "per month" },
  { value: "year", label: "per year" },
];

// shared input styling (dark filled field, no heavy border)
const fieldClass =
  "h-11 rounded-lg border-white/[0.04] bg-[#1b1b1f] text-sm text-zinc-200 placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-1 focus-visible:ring-indigo-500/40";

function SectionCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-white/[0.04] bg-[#121214] p-4 sm:p-7">
      <h2 className="mb-6 flex items-center gap-2.5 text-[15px] font-medium text-zinc-100">
        <span className="size-1.5 rounded-full bg-indigo-500" />
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, required, hint, htmlFor, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className="text-xs font-normal text-zinc-300">
          {label}
          {required && <span className="ml-0.5 text-indigo-400">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-zinc-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// input with an icon on the left
function IconInput({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
      <Input {...props} className={`${fieldClass} pl-9 ${className}`} />
    </div>
  );
}

export default function PostJobPage() {
  const router = useRouter();

  // <-- 2. Notun State loading er jonno
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    category: "",
    type: "Full-time",
    isRemote: false,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    frequency: "hour",
    responsibilities: "",
    requirements: "",
  });

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const onChange = (key) => (e) => set(key)(e.target.value);

  // <-- 3. handleSubmit update kora hoyeche Toast ar Redirect diye
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const toastId = toast.loading("Publishing job post...");

    try {
      const result = await createjob(form);

      console.log("Job Created:", result);

      // Success Toast
      toast.success("Job posted successfully!", { id: toastId });

      // Redirect to manage jobs page (apnar path onujayi change korte paren)
      router.push("/dashboard/recruiter/jobs/manage");
    } catch (error) {
      console.log(error);
      // Error Toast
      toast.error(error.message || "Failed to post job. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Left padding pushes the whole form away from the sidebar.
    // Adjust `pl-*` values if your sidebar width differs.
    <div className="w-full pl-6 pr-4 py-8 sm:pl-10 sm:pr-6 sm:py-12 lg:pl-16 lg:pr-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-4xl text-zinc-200"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 border-b border-white/[0.05] pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <nav className="mb-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span>Manage Jobs</span>
              <span>&gt;</span>
              <span className="text-indigo-300">Create New Listing</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Post a New Job
            </h1>
            <p className="mt-2 text-xs text-zinc-400">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Basic information */}
          <SectionCard title="1. Basic Information">
            <Field label="Job Title" required htmlFor="title">
              <Input
                id="title"
                value={form.title}
                onChange={onChange("title")}
                placeholder="Frontend Developer"
                className={fieldClass}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company Name" required htmlFor="company">
                <IconInput
                  icon={Building2}
                  id="company"
                  value={form.company}
                  onChange={onChange("company")}
                  placeholder="Your company"
                />
              </Field>

              <Field label="Job Category" required>
                <Select value={form.category} onValueChange={set("category")}>
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#1b1b1f] text-zinc-200">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Job Type" required>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {JOB_TYPES.map((t) => {
                  const active = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("type")(t)}
                      className={`h-10 rounded-lg border text-xs transition-colors ${
                        active
                          ? "border-indigo-500/60 bg-[#1f1f26] font-medium text-white"
                          : "border-white/[0.04] bg-[#1b1b1f] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </Field>
          </SectionCard>

          {/* 2. Location, compensation & timeline */}
          <SectionCard title="2. Location, Compensation & Timeline">
            {/* Remote toggle */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-[#1b1b1f] px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <Globe className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-medium text-zinc-100">
                    Remote Work Allowed (isRemote)
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Enable worldwide or distributed candidate applications
                  </p>
                </div>
              </div>
              <Switch
                checked={form.isRemote}
                onCheckedChange={set("isRemote")}
                className="data-[state=checked]:bg-indigo-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Job Location (location)"
                hint="Required"
                htmlFor="location"
              >
                <IconInput
                  icon={MapPin}
                  id="location"
                  value={form.location}
                  onChange={onChange("location")}
                  placeholder="New York, USA"
                />
              </Field>

              <Field label="Application Deadline (deadline)" htmlFor="deadline">
                <IconInput
                  icon={CalendarDays}
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={onChange("deadline")}
                  className="[color-scheme:dark]"
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              <Field label="Min Salary / Rate" htmlFor="minSalary">
                <IconInput
                  icon={Euro}
                  id="minSalary"
                  type="number"
                  min="0"
                  value={form.minSalary}
                  onChange={onChange("minSalary")}
                  placeholder="25"
                />
              </Field>

              <Field label="Max Salary / Rate" htmlFor="maxSalary">
                <IconInput
                  icon={Euro}
                  id="maxSalary"
                  type="number"
                  min="0"
                  value={form.maxSalary}
                  onChange={onChange("maxSalary")}
                  placeholder="40"
                />
              </Field>

              <Field label="Frequency">
                <Select value={form.frequency} onValueChange={set("frequency")}>
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#1b1b1f] text-zinc-200">
                    {FREQUENCIES.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </SectionCard>

          {/* 3. Responsibilities & requirements */}
          <SectionCard title="3. Responsibilities & Requirements">
            <Field
              label="Key Responsibilities"
              required
              htmlFor="responsibilities"
            >
              <Textarea
                id="responsibilities"
                rows={4}
                value={form.responsibilities}
                onChange={onChange("responsibilities")}
                placeholder="Describe what the person will do day to day…"
                className="min-h-[92px] resize-y rounded-lg border-white/[0.04] bg-[#1b1b1f] text-sm leading-relaxed text-zinc-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-1 focus-visible:ring-indigo-500/40"
              />
            </Field>

            <Field
              label="Qualifications & Requirements"
              required
              htmlFor="requirements"
            >
              <Textarea
                id="requirements"
                rows={5}
                value={form.requirements}
                onChange={onChange("requirements")}
                placeholder={
                  "• 3+ years of experience with React\n• Solid understanding of …"
                }
                className="min-h-[120px] resize-y rounded-lg border-white/[0.04] bg-[#1b1b1f] text-sm leading-relaxed text-zinc-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-1 focus-visible:ring-indigo-500/40"
              />
            </Field>
          </SectionCard>
        </div>
        <div className="mt-8 flex justify-start">
          {/* <-- 4. Button update kora hoyeche loading state er jonno */}
          <Button
            type="submit"
            render={<Link href="/dashboard/recruiter/jobs" />}
            disabled={isSubmitting}
            className="h-11 w-full shrink-0 rounded-xl bg-indigo-500 px-6 font-semibold text-white shadow-[0_8px_30px_-6px_rgba(99,102,241,0.6)] hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
          >
            {isSubmitting ? "Publishing..." : "Publish Job"}
            {!isSubmitting && <ArrowRight className="size-4 ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
