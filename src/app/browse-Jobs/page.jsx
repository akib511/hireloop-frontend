import { getJobs } from "@/lib/actions/jobs";
import { Suspense } from "react";
import BrowseJobsClient from "./BrowseJobsClient";

async function BrowseJobsContent() {
  let jobs = [];
  let loadError = "";

  try {
    jobs = await getJobs("");
  } catch (error) {
    // API unreachable -> show an error state instead of a fake "No jobs found"
    loadError = error.message || "Failed to load jobs.";
  }

  return <BrowseJobsClient jobs={jobs} loadError={loadError} />;
}

export default function BrowseJobsPage() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-8 text-sm text-zinc-400">
          Loading jobs...
        </p>
      }
    >
      <BrowseJobsContent />
    </Suspense>
  );
}