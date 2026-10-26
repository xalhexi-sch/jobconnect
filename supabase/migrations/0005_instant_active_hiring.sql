-- Enable instant hiring and active postings without verification blocks
update public.jobs set status = 'Active' where status = 'Pending';
update public.profiles set company_verified = true, onboarded = true;
