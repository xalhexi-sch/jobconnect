import { fetchJobsAction, createJobAction } from "../app/actions/jobs.ts";
import { submitApplicationAction, updateApplicationStatusAction } from "../app/actions/applications.ts";
import { fetchUserProfileAction, saveUserProfileAction } from "../app/actions/profile.ts";

async function run() {
  console.log("Verifying Server Actions...");
  const jobs = await fetchJobsAction();
  if (!Array.isArray(jobs) || jobs.length === 0) {
    throw new Error("fetchJobsAction failed to return jobs");
  }
  console.log(`fetchJobsAction returned ${jobs.length} jobs.`);

  const createRes = await createJobAction({
    title: "Community Manager",
    company: "Caraga Hub",
    location: "Ampayon, Butuan City",
    barangay: "Ampayon",
    category: "Marketing",
    salary: "₱24,000/mo"
  });
  if (!createRes.success || !createRes.job) {
    throw new Error("createJobAction failed");
  }
  console.log(`createJobAction created job: ${createRes.job.id}`);

  const appRes = await submitApplicationAction({
    jobId: createRes.job.id,
    applicantId: "user-test",
    applicantName: "Test Applicant",
    applicantEmail: "test@butuan.ph"
  });
  if (!appRes.success || !appRes.application) {
    throw new Error("submitApplicationAction failed");
  }
  console.log(`submitApplicationAction created app: ${appRes.application.id}`);

  const updateRes = await updateApplicationStatusAction(appRes.application.id, "Interview Scheduled", "Monday 10 AM");
  if (!updateRes.success) {
    throw new Error("updateApplicationStatusAction failed");
  }
  console.log("updateApplicationStatusAction succeeded.");

  const profile = await fetchUserProfileAction("user-maria");
  if (!profile || !profile.fullName) {
    throw new Error("fetchUserProfileAction failed");
  }
  console.log(`fetchUserProfileAction returned profile for: ${profile.fullName}`);

  const updateProfileRes = await saveUserProfileAction({ headline: "Updated Headline for Test" });
  if (!updateProfileRes.success) {
    throw new Error("saveUserProfileAction failed");
  }
  console.log("saveUserProfileAction verified successfully.");

  console.log("ACTIONS VERIFICATION PASSED!");
}

run().catch((err) => {
  console.error("ACTIONS VERIFICATION FAILED:", err);
  process.exit(1);
});
