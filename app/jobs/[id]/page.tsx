import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck, Tag, Wifi } from "lucide-react";
import { getJobById } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import type { Job } from "@/lib/types";
import JobgioLogo from "@/components/JobgioLogo";
import CompanyLogo from "@/components/CompanyLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import JobPageActions from "./JobPageActions";

async function getPublicJob(id: string): Promise<Job | null> {
  "use cache";
  cacheLife("minutes");
  const job = await getJobById(id);
  return job && job.status === "Active" ? job : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublicJob(id);
  if (!job) return { title: "Job not found", robots: { index: false } };
  const title = `${job.title} at ${job.company}`;
  const description = `${job.type} ${job.category} job in ${job.location}. ${job.salary}. ${job.description.slice(0, 120)}…`;
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: { title, description, type: "article" },
  };
}

function jobPostingJsonLd(job: Job) {
  const posted = job.createdAt ? new Date(job.createdAt) : new Date();
  const validThrough = new Date(posted.getTime() + 60 * 24 * 3600 * 1000);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: posted.toISOString(),
    validThrough: validThrough.toISOString(),
    employmentType: "FULL_TIME",
    directApply: true,
    hiringOrganization: { "@type": "Organization", name: job.company, ...(job.companyLogo?.startsWith("http") ? { logo: job.companyLogo } : {}) },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.city, addressRegion: "Caraga", addressCountry: "PH", streetAddress: job.location },
    },
    ...(job.type.startsWith("Remote") ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "PH" } } : {}),
    baseSalary: { "@type": "MonetaryAmount", currency: "PHP", value: { "@type": "QuantitativeValue", minValue: job.salaryPhp, unitText: "MONTH" } },
  };
}

async function JobContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getPublicJob(id);
  if (!job) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
      {/* JSON-LD for Google for Jobs; "<" escaped so content can never close the script tag */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c") }} />

      <div className="flex items-start gap-4">
        <CompanyLogo name={job.company} src={job.companyLogo} size={64} />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{job.title}</h1>
          <p className="text-lg text-fg-muted mt-1">{job.company}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-fg-muted">
        <li className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</li>
        <li className="flex items-center gap-1.5"><Wifi className="w-4 h-4" /> {job.type}</li>
        <li className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {job.category}</li>
        {job.createdAt && <li className="flex items-center gap-1.5"><Clock3 className="w-4 h-4" /> Posted {timeAgo(job.createdAt)}</li>}
      </ul>

      <p className="mt-6 inline-block px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-lg font-bold">{job.salary}</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold mb-3">About the role</h2>
        <p className="text-base leading-8 text-fg/85 whitespace-pre-line">{job.description}</p>
      </section>

      {job.requirements.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-3">Requirements</h2>
          <ul className="space-y-2.5">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-base leading-7 text-fg/85">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-1" aria-hidden /> {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-sm text-fg-muted flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" /> Direct hiring. You apply straight to the employer, no agency fees.</p>

      <JobPageActions job={job} />
    </article>
  );
}

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-line h-16 px-4 sm:px-6 flex items-center">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/overview" className="flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg">
            <ArrowLeft className="w-4 h-4" /> All jobs
          </Link>
          <Link href="/" aria-label="JobConnect home"><JobgioLogo variant="dark" size="sm" /></Link>
          <ThemeToggle />
        </div>
      </header>
      <main id="main">
        <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-16"><div className="skeleton h-10 w-2/3 mb-4" /><div className="skeleton h-5 w-1/3 mb-8" /><div className="skeleton h-40 w-full" /></div>}>
          <JobContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
