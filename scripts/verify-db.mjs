import { getJobsFromDb, insertJobToDb, getApplicationsFromDb, insertApplicationToDb } from "../lib/db.ts";

async function run() {
  console.log("Testing DB helper functions in fallback/mock mode...");
  const jobs = await getJobsFromDb();
  if (!Array.isArray(jobs) || jobs.length === 0) {
    throw new Error("Failed to load jobs");
  }
  console.log(`Loaded ${jobs.length} jobs successfully. First job: "${jobs[0].title}" in ${jobs[0].location}`);

  const testJob = await insertJobToDb({
    title: "Junior QA Tester",
    company: "Caraga Software Lab",
    location: "Libertad, Butuan City",
    barangay: "Libertad",
    salary: "₱22,000/mo",
    category: "Developer"
  });
  console.log(`Successfully created test job: ${testJob.id} - ${testJob.title}`);

  const apps = await getApplicationsFromDb("user-maria");
  console.log(`Loaded ${apps.length} applications for user-maria.`);

  const newApp = await insertApplicationToDb({
    jobId: testJob.id,
    applicantId: "user-maria",
    applicantName: "Maria Santos",
    applicantEmail: "maria.santos@caraga.tech"
  });
  console.log(`Successfully created application: ${newApp.id} for job ${newApp.jobTitle}`);

  console.log("DB VERIFICATION PASSED!");
}

run().catch((err) => {
  console.error("DB VERIFICATION FAILED:", err);
  process.exit(1);
});
