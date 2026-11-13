"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { applyToAJob } from "@/lib/actions/applications";
import { authClient } from "@/lib/auth-client";

export default function ApplyButton({ job }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const jobId = job?._id || job?.id;

  const handleApply = async () => {
    if (isApplying || applied || !jobId) return;

    // Not signed in yet -> send them to sign in and come back afterwards
    if (!session) {
      router.push(
        `/signIn?callbackURL=${encodeURIComponent(`/browse-Jobs/${jobId}`)}`
      );
      return;
    }

    // Only job seeker accounts can apply for jobs
    if (session.user.role !== "seeker") {
      toast.error("Only job seeker accounts can apply for jobs.");
      return;
    }

    setIsApplying(true);
    const toastId = toast.loading("Submitting your application...");

    try {
      // Full application object — every field the My Applications page shows
      const application = {
        jobId,
        jobTitle: job.title || "Untitled",
        company: job.company || "—",
        jobType: job.type || "Full-time",
        location: job.location || "",
        isRemote: job.isRemote ?? false,
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        status: "Applied",
        appliedAt: new Date().toISOString(),
      };

      await applyToAJob(application);

      setApplied(true);
      toast.success("Application submitted successfully!", { id: toastId });
      router.push("/dashboard/seeker/applications");
    } catch (error) {
      toast.error(error.message || "Failed to submit application.", {
        id: toastId,
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={isPending || isApplying || applied}
      className="rounded-xl bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending
        ? "Checking..."
        : isApplying
          ? "Submitting..."
          : applied
            ? "Applied ✓"
            : "Apply Now"}
    </button>
  );
}
