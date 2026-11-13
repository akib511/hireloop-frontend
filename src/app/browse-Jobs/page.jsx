import { getJobs } from "@/lib/actions/jobs";
import { Suspense } from "react";
import BrowseJobsClient from "./BrowseJobsClient";

async function BrowseJobsContent() {
  const result = await getJobs("").catch(() => []);

  const jobs = Array.isArray(result) ? result : [];

  return <BrowseJobsClient  jobs={jobs} />;
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