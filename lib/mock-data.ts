import { Job, PendingApproval, UserProfile } from "./types";

export const INITIAL_USER_PROFILE: UserProfile = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  location: "Butuan City",
  headline: "",
  bio: "",
  skills: [],
  education: "",
  portfolioUrl: "",
  resumeFileName: "",
  resumeUpdated: "",
  expectedSalary: ""
};

export const DEMO_USER_PROFILE: UserProfile = {
  id: "user-maria-caraga",
  fullName: "Maria Santos",
  email: "maria.santos@caraga.tech",
  phone: "+63 917 842 9011",
  location: "Bancasi, Butuan City, Agusan del Norte",
  headline: "Frontend Developer & UI Specialist",
  bio: "Passionate digital product developer based in Butuan City. Graduate of Caraga State University (BS Information Technology). Crafting accessible web apps and responsive UI systems for regional startups and remote teams.",
  skills: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Figma", "Design Systems"],
  education: "B.S. Information Technology — Caraga State University (CSU Main Campus, Ampayon)",
  portfolioUrl: "https://mariasantos.dev",
  resumeFileName: "Maria_Santos_CV_2026_Caraga.pdf",
  resumeUpdated: "Updated 2 days ago",
  expectedSalary: "₱45,000 - ₱65,000 / month"
};

export const INITIAL_JOBS: Job[] = [
  {
    id: "job-bxu-ck-1",
    employerId: "emp-chowking-bxu",
    title: "Service Crew & Dining Associate",
    company: "Chowking Butuan",
    companyLogo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80",
    location: "J.C. Aquino Ave cor. Montilla Blvd, Butuan City",
    barangay: "Bayanihan",
    city: "Butuan City",
    salary: "₱15,000/mo",
    salaryPhp: 15000,
    type: "On-site",
    category: "Hospitality",
    status: "Active",
    postedDate: "Today 08:30 AM",
    appliedCount: 18,
    featured: true,
    description: "Provide prompt and friendly customer dining service, manage cashiering/POS transactions, prepare beverage and dessert orders, and ensure strict food sanitation compliance according to Chowking corporate standards.",
    requirements: [
      "Senior High School graduate or College level",
      "Pleasant personality with excellent customer orientation",
      "Willing to work on shifting schedules, weekends, and holidays",
      "Food handling or cashier experience is an advantage"
    ]
  },
  {
    id: "job-bxu-sm-1",
    employerId: "emp-sm-butuan",
    title: "Retail Sales & Customer Associate",
    company: "The SM Store Butuan",
    companyLogo: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=120&auto=format&fit=crop&q=80",
    location: "SM City Butuan, J.C. Aquino Ave, Butuan City",
    barangay: "Lapu-Lapu",
    city: "Butuan City",
    salary: "₱16,500/mo",
    salaryPhp: 16500,
    type: "On-site",
    category: "Marketing",
    status: "Active",
    postedDate: "Today 09:15 AM",
    appliedCount: 32,
    featured: true,
    description: "Assist shoppers within designated department sections (Fashion, Home, Shoes, or Electronics), manage merchandise display merchandising, process POS sales transactions, and maintain visual retail standards.",
    requirements: [
      "College graduate or at least 2 years in College",
      "Strong interpersonal and English/Tagalog/Cebuano communication skills",
      "Neat and professional presentation with enthusiastic customer service demeanor",
      "Fresh graduates are welcome to apply"
    ]
  },
  {
    id: "job-bxu-wat-1",
    employerId: "emp-watsons-bxu",
    title: "Registered Pharmacist",
    company: "Watsons SM City Butuan",
    companyLogo: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=120&auto=format&fit=crop&q=80",
    location: "Ground Floor Health & Beauty Section, SM City Butuan",
    barangay: "Lapu-Lapu",
    city: "Butuan City",
    salary: "₱32,000/mo",
    salaryPhp: 32000,
    type: "On-site",
    category: "Healthcare",
    status: "Active",
    postedDate: "Today 10:00 AM",
    appliedCount: 9,
    featured: true,
    description: "Review and dispense prescription medications, conduct patient counseling on dosage and drug interactions, manage FDA compliance and dangerous drugs record keeping, and supervise pharmacy assistants.",
    requirements: [
      "Bachelor of Science in Pharmacy with active PRC License",
      "Comprehensive understanding of Philippine FDA regulations and Pharmacy Law",
      "Strong patient care ethics and communication skills",
      "Competitive license allowance and comprehensive health coverage included"
    ]
  },
  {
    id: "job-bxu-sev-1",
    employerId: "emp-seven-eleven-bxu",
    title: "Store Crew & Cashier (24/7 Shifting)",
    company: "7-Eleven Libertad Branch",
    companyLogo: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=120&auto=format&fit=crop&q=80",
    location: "National Highway cor. Libertad Bus Terminal Road, Butuan City",
    barangay: "Libertad",
    city: "Butuan City",
    salary: "₱14,800/mo",
    salaryPhp: 14800,
    type: "On-site",
    category: "Marketing",
    status: "Active",
    postedDate: "Yesterday 04:30 PM",
    appliedCount: 28,
    featured: false,
    description: "Handle 24-hour retail counter operations, operate Point of Sale and CLiQQ kiosks, receive daily food deliveries (Big Bite, City Blends, rice meals), replenish chillers, and keep the store clean and secure.",
    requirements: [
      "High School / Senior High School graduate",
      "Willing to rotate on day, evening, and graveyard shifts",
      "Honest, trustworthy, and able to work independently",
      "Complete government contributions (SSS, PhilHealth, Pag-IBIG) provided"
    ]
  },
  {
    id: "job-bxu-rob-1",
    employerId: "emp-robinsons-bxu",
    title: "Customer Service Supervisor",
    company: "Robinsons Place Butuan",
    companyLogo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    location: "Robinsons Place Butuan, J.C. Aquino Ave, Butuan City",
    barangay: "Bayanihan",
    city: "Butuan City",
    salary: "₱22,000/mo",
    salaryPhp: 22000,
    type: "On-site",
    category: "Admin & Support",
    status: "Active",
    postedDate: "Yesterday 02:00 PM",
    appliedCount: 27,
    featured: true,
    description: "Oversee mall information counter, customer inquiry desks, loyalty rewards program redemption, gift certificate issuance, and immediate resolution of shopper feedback across Robinsons Place Butuan.",
    requirements: [
      "Bachelor's Degree in Business Administration, Hospitality, or Communications",
      "At least 2 years customer service experience in retail or hospitality",
      "Strong supervisory, problem-resolution, and conflict-management skills"
    ]
  },
  {
    id: "job-bxu-gai-1",
    employerId: "emp-gaisano-bxu",
    title: "Department Sales Associate & Cashier",
    company: "Gaisano Mall of Butuan",
    companyLogo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80",
    location: "J.C. Aquino Ave cor. Montilla Blvd, Butuan City",
    barangay: "Poblacion",
    city: "Butuan City",
    salary: "₱15,000/mo",
    salaryPhp: 15000,
    type: "On-site",
    category: "Marketing",
    status: "Active",
    postedDate: "Yesterday 11:20 AM",
    appliedCount: 36,
    featured: false,
    description: "Provide sales assistance to local shoppers in apparel, cosmetics, or household items. Operate electronic cash registers, issue receipts, and balance end-of-shift sales remittances accurately.",
    requirements: [
      "Senior High School graduate or College level",
      "Trustworthy with high math proficiency and numerical aptitude",
      "Punctual and ready to begin immediate work in central Butuan City"
    ]
  },
  {
    id: "job-bxu-loc-1",
    employerId: "emp-butuan-specialty",
    title: "Head Barista & Cafe Shift Supervisor",
    company: "Narra Specialty Coffee & Bakery",
    companyLogo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&auto=format&fit=crop&q=80",
    location: "Villa Kananga Rd, Butuan City",
    barangay: "Villa Kananga",
    city: "Butuan City",
    salary: "₱17,000/mo",
    salaryPhp: 17000,
    type: "On-site",
    category: "Hospitality",
    status: "Active",
    postedDate: "Today 07:45 AM",
    appliedCount: 29,
    featured: true,
    description: "Craft specialty espresso, pour-overs, and cold brews utilizing locally sourced Bukidnon and Davao Arabica beans. Supervise junior baristas, maintain espresso machine calibration, and uphold cozy cafe ambiance.",
    requirements: [
      "At least 1 year specialty coffee barista experience",
      "Knowledge of espresso calibration, milk steaming, and latte art",
      "Passionate about Third Wave coffee culture and customer hospitality"
    ]
  },
  {
    id: "job-bxu-lib-1",
    employerId: "emp-libertad-merchants",
    title: "Wholesale Inventory & Logistics Coordinator",
    company: "Libertad Commercial Trading Corp",
    companyLogo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80",
    location: "Libertad Public Market Wholesale District, Butuan City",
    barangay: "Libertad",
    city: "Butuan City",
    salary: "₱17,500/mo",
    salaryPhp: 17500,
    type: "On-site",
    category: "Trades & Logistics",
    status: "Active",
    postedDate: "2 days ago",
    appliedCount: 17,
    featured: false,
    description: "Coordinate truck delivery dispatch and bulk grain, vegetable, and dry goods receiving in Butuan’s central trading district. Inspect waybills, supervise pallet unloading, and ensure stock accuracy.",
    requirements: [
      "High School graduate or Vocational certificate holder",
      "Experience in warehouse dispatch, logistics, or trading centers",
      "Familiarity with regional truck delivery routes in Agusan del Norte"
    ]
  },
  {
    id: "job-bxu-ck-2",
    employerId: "emp-chowking-bxu",
    title: "Kitchen Staff & Dimsum Specialist",
    company: "Chowking SM City Butuan",
    companyLogo: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=120&auto=format&fit=crop&q=80",
    location: "Ground Floor Food Strip, SM City Butuan, J.C. Aquino Ave",
    barangay: "Lapu-Lapu",
    city: "Butuan City",
    salary: "₱16,000/mo",
    salaryPhp: 16000,
    type: "On-site",
    category: "Hospitality",
    status: "Active",
    postedDate: "2 days ago",
    appliedCount: 14,
    featured: false,
    description: "Responsible for preparing authentic Chinese-style fast-food specialties including Chao Fan, Dimsum baskets, noodles, and fried chicken orders. Follows recipes, kitchen temperature guidelines, and food hygiene rules.",
    requirements: [
      "High School or Vocational graduate (NC II in Cookery or Commercial Cooking preferred)",
      "At least 6 months experience in fast-food back-of-house or kitchen operations",
      "Ability to work swiftly in a high-volume kitchen environment"
    ]
  },
  {
    id: "job-bxu-wat-2",
    employerId: "emp-watsons-bxu",
    title: "Pharmacy Assistant & Health Advisor",
    company: "Watsons Libertad Branch",
    companyLogo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&auto=format&fit=crop&q=80",
    location: "National Highway beside Libertad Public Market, Butuan City",
    barangay: "Libertad",
    city: "Butuan City",
    salary: "₱15,500/mo",
    salaryPhp: 15500,
    type: "On-site",
    category: "Healthcare",
    status: "Active",
    postedDate: "3 days ago",
    appliedCount: 22,
    featured: false,
    description: "Assist the licensed pharmacist in receiving and organizing over-the-counter and ethical medicines, shelf-labeling, inventory audits, and attending to customer inquiries on personal care products.",
    requirements: [
      "Graduate of Pharmacy Services NC II or Allied Health undergraduate",
      "Familiarity with medical brand and generic names",
      "Patient, detail-oriented, and service-minded"
    ]
  },
  {
    id: "job-bxu-loc-2",
    employerId: "emp-butuan-specialty",
    title: "Pastry Baker & Commis Cook",
    company: "Margie's Kitchen Butuan",
    companyLogo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80",
    location: "San Jose St, Butuan City",
    barangay: "Poblacion",
    city: "Butuan City",
    salary: "₱16,500/mo",
    salaryPhp: 16500,
    type: "On-site",
    category: "Hospitality",
    status: "Active",
    postedDate: "3 days ago",
    appliedCount: 16,
    featured: false,
    description: "Bake fresh cakes, breads, and desserts for Butuan City's beloved heritage dining destination. Follow traditional recipes, control baking times, and prepare culinary orders with passion.",
    requirements: [
      "Culinary or Baking Arts graduate (NC II in Bread & Pastry Production)",
      "Experience baking artisan cakes and pastries",
      "Keen eye for dessert plating and kitchen cleanliness"
    ]
  },
  {
    id: "job-bxu-sev-2",
    employerId: "emp-seven-eleven-bxu",
    title: "Assistant Store Manager & Shift In-Charge",
    company: "7-Eleven Montilla Blvd Branch",
    companyLogo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=120&auto=format&fit=crop&q=80",
    location: "Montilla Blvd near CSU Main Campus, Butuan City",
    barangay: "Poblacion",
    city: "Butuan City",
    salary: "₱20,000/mo",
    salaryPhp: 20000,
    type: "On-site",
    category: "Admin & Support",
    status: "Active",
    postedDate: "4 days ago",
    appliedCount: 15,
    featured: true,
    description: "Lead store team shifts, manage daily cash banking deposits, oversee inventory audits, review product shrinkage reports, and uphold Philippine Seven Corporation store compliance metrics.",
    requirements: [
      "College graduate in Business Administration, Management, or related field",
      "At least 1 year supervisory experience in convenience stores or retail",
      "Strong leadership and cash handling discipline"
    ]
  }
];

export const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "appr-1",
    company: "Caraga State University Technology Park",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
    location: "Ampayon, Butuan City",
    date: "Jun 16 08:30 AM",
    status: "Pending"
  },
  {
    id: "appr-2",
    company: "SM City Butuan Merchant Hub",
    logo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=80",
    location: "J.C. Aquino Ave, Butuan City",
    date: "Jun 15 11:45 AM",
    status: "Pending"
  },
  {
    id: "appr-3",
    company: "Surigao Del Norte Eco-Tourism Ventures",
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    location: "Surigao City",
    date: "Jun 14 02:20 PM",
    status: "Pending"
  }
];

export const FAQS = [
  {
    category: "Job seekers",
    questions: [
      { q: "Is JobConnect free?", a: "Yes. Job seekers can search and apply to as many jobs as they like. It never costs anything." },
      { q: "Are the jobs real?", a: "Yes. We check every job before it goes live, so you apply to real local businesses with clear pay." },
      { q: "Can fresh graduates apply?", a: "Yes. Many jobs here are open to fresh graduates and first-time workers." },
      { q: "Can I apply on my phone?", a: "Yes. Open JobConnect in your phone browser. You do not need to download an app." }
    ]
  },
  {
    category: "Employers",
    questions: [
      { q: "How do I post a job?", a: "Sign in and tap Post a Job. Enter the job details, the pay in pesos and the location, then submit. We check it, then it goes live." },
      { q: "Can I see applicants and set interviews?", a: "Yes. In your dashboard you can read resumes, move applicants to the next step, and message them." },
      { q: "Can I post remote or hybrid jobs?", a: "Yes. When you post a job, choose on-site, hybrid or remote." }
    ]
  },
  {
    category: "Areas we cover",
    questions: [
      { q: "Which areas do you cover?", a: "Butuan, Cabadbaran, Surigao, Bayugan and Bislig. We also cover the provinces of Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur and Dinagat Islands." },
      { q: "Where is your office?", a: "J.C. Aquino Avenue, Butuan City, Agusan del Norte." }
    ]
  }
];
