const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// The status flow every application moves through:
// Applied -> Under Review -> Shortlisted -> Offered / Rejected
export const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Offered",
];

/**
 * Save a new job application to the database.
 *
 * Payload (everything the My Applications page displays):
 * {
 *   jobId, jobTitle, company, jobType, location, isRemote,
 *   userId, name, email, status, appliedAt
 * }
 */
export const applyToAJob = async (data) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to submit application");
  }

  return result;
};

/**
 * Fetch every application submitted by a job seeker (for the
 * "My Applications" page of the seeker dashboard).
 */
export const getMyApplications = async (userId) => {
  const res = await fetch(
    `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to load applications");
  }

  return Array.isArray(result) ? result : [];
};
