
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||"http://localhost:5000"


 export const createjob = async (data)=>{
  const res = await fetch(`${BASE_URL}/jobs` , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  return res.json()
 }




 // searcharc kore job gula pabo 

 export const getJobs = async (query = "")=>{
  const res = await fetch(`${BASE_URL}/jobs?${query}`, {
    cache: "no-store",
  }).catch(() => {
    // Network failure = backend is not running / unreachable
    throw new Error(
      `Cannot reach the API at ${BASE_URL}. Please make sure the backend server is running.`
    );
  });

  if (!res.ok) {
    throw new Error(`Failed to load jobs (status ${res.status})`);
  }

  const result = await res.json().catch(() => null);

  return Array.isArray(result) ? result : [];
 }
  