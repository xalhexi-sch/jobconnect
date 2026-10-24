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
  id: "demo-user",
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
    id: "job-1",
    title: "Lead UI/UX Designer",
    company: "TechVenture Caraga",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    location: "Montilla Blvd, Butuan City",
    barangay: "Bancasi",
    city: "Butuan City",
    salary: "₱65,000/mo",
    salaryPhp: 65000,
    type: "Remote (Caraga)",
    category: "Design",
    status: "Active",
    postedDate: "Today 09:30 AM",
    appliedCount: 24,
    featured: true,
    description: "Lead user experience and design systems for Caraga's fastest growing tech consultancy. You will work with local government units and regional enterprises building modern cloud portals.",
    requirements: [
      "3+ years in product design, web apps, and design systems",
      "Figma proficiency and component architecture experience",
      "Based in Butuan City or nearby Caraga provinces"
    ]
  },
  {
    id: "job-2",
    title: "Full-Stack Web Developer",
    company: "CSU Innovation Hub",
    companyLogo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80",
    location: "Ampayon, Butuan City",
    barangay: "Ampayon",
    city: "Butuan City",
    salary: "₱50,000/mo",
    salaryPhp: 50000,
    type: "Hybrid",
    category: "Developer",
    status: "Active",
    postedDate: "Yesterday 02:15 PM",
    appliedCount: 38,
    featured: true,
    description: "Build Next.js web applications and research data management systems at Caraga State University's research and startup incubator park.",
    requirements: [
      "TypeScript, Next.js / React, Node.js",
      "Experience with PostgreSQL or Supabase",
      "Strong problem-solving and mentoring mindset"
    ]
  },
  {
    id: "job-3",
    title: "IT Systems Administrator",
    company: "Father Saturnino Urios University",
    companyLogo: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=120&auto=format&fit=crop&q=80",
    location: "J.C. Aquino Ave, Butuan City",
    barangay: "Poblacion",
    city: "Butuan City",
    salary: "₱35,000/mo",
    salaryPhp: 35000,
    type: "On-site",
    category: "Security",
    status: "Active",
    postedDate: "Jun 14 11:20 AM",
    appliedCount: 19,
    description: "Manage campus network infrastructure, cloud backups, student portal security, and firewall compliance across FSUU's academic buildings.",
    requirements: [
      "Bachelor's in IT, Computer Science or related degree",
      "Cisco CCNA or equivalent network administration background",
      "Linux server and Active Directory experience"
    ]
  },
  {
    id: "job-4",
    title: "Health Informatics Specialist",
    company: "Butuan Medical Center",
    companyLogo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80",
    location: "T. Sanchez St, Butuan City",
    barangay: "Libertad",
    city: "Butuan City",
    salary: "₱30,000/mo",
    salaryPhp: 30000,
    type: "On-site",
    category: "Healthcare",
    status: "Pending",
    postedDate: "Jun 13 04:30 PM",
    appliedCount: 14,
    description: "Coordinate electronic health record (EHR) systems, patient data compliance, and digital hospital reporting pipelines.",
    requirements: [
      "Degree in Nursing, Health Info, or Computer Science",
      "Familiarity with DOH PhilHealth claims systems",
      "High attention to medical confidentiality and HIPAA/DPA"
    ]
  },
  {
    id: "job-5",
    title: "Digital Marketing Associate",
    company: "Robinsons Retail Group Butuan",
    companyLogo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=80",
    location: "J.C. Aquino Ave, Butuan City",
    barangay: "Bayanihan",
    city: "Butuan City",
    salary: "₱26,000/mo",
    salaryPhp: 26000,
    type: "On-site",
    category: "Marketing",
    status: "Active",
    postedDate: "Jun 11 08:45 AM",
    appliedCount: 45,
    description: "Manage social campaigns, mall promotions, merchant spotlight reels, and influencer partnerships across Caraga.",
    requirements: [
      "Experience running Meta Ads and TikTok Creator content",
      "Basic Canva / Adobe Photoshop skills",
      "Knowledge of local Butuan shopping trends"
    ]
  },
  {
    id: "job-6",
    title: "Environmental GIS Specialist",
    company: "Agusan Agro-Forestry & Mineral Corp",
    companyLogo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&auto=format&fit=crop&q=80",
    location: "Tubay, Agusan del Norte",
    city: "Caraga Region",
    salary: "₱42,000/mo",
    salaryPhp: 42000,
    type: "Hybrid",
    category: "Admin & Support",
    status: "Active",
    postedDate: "Jun 09 03:00 PM",
    appliedCount: 11,
    description: "Map watershed areas, conduct drone aerial surveys, and monitor reforestation boundaries across Agusan del Norte valleys.",
    requirements: [
      "ArcGIS / QGIS spatial mapping experience",
      "Degree in Forestry, Environmental Science, or Geodetic Eng",
      "Comfortable with field surveys and LGU compliance reporting"
    ]
  },
  {
    id: "job-7",
    title: "Customer Support Team Lead",
    company: "Surigao Coastal Digital Services",
    companyLogo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    location: "Surigao City, Surigao del Norte",
    city: "Surigao City",
    salary: "₱32,000/mo",
    salaryPhp: 32000,
    type: "Remote (Caraga)",
    category: "Admin & Support",
    status: "Active",
    postedDate: "Jun 08 10:15 AM",
    appliedCount: 52,
    description: "Supervise a 15-person customer satisfaction desk supporting international e-commerce clients. Flexible night/day shifts.",
    requirements: [
      "2+ years BPO or remote support leadership experience",
      "Excellent conversational English fluency",
      "Reliable home internet connection (fiber)"
    ]
  },
  {
    id: "job-8",
    title: "Mobile App Developer (Flutter / React Native)",
    company: "Agusan Tech Innovations",
    companyLogo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=120&auto=format&fit=crop&q=80",
    location: "Cabadbaran City, Agusan del Norte",
    city: "Cabadbaran City",
    salary: "₱48,000/mo",
    salaryPhp: 48000,
    type: "Remote (Caraga)",
    category: "Developer",
    status: "Active",
    postedDate: "Jun 05 01:20 PM",
    appliedCount: 29,
    description: "Build cross-platform mobile apps for regional logistics, agricultural supply chains, and local merchant payments.",
    requirements: [
      "Flutter or React Native portfolio apps",
      "State management (Riverpod, Bloc, or Redux/Zustand)",
      "RESTful API integration and offline caching"
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
    category: "Jobseekers in Caraga",
    questions: [
      { q: "Is JobConnect free for applicants in Butuan & Caraga?", a: "Yes, 100% free! Jobseekers can browse, search, build their interactive portfolio, and apply to unlimited local and remote listings at no charge." },
      { q: "Are the companies and jobs verified?", a: "Yes, every job listing is reviewed so applicants know they are applying to real local businesses with clear salaries." },
      { q: "Can fresh graduates from CSU, FSUU, and SJIT apply?", a: "Definitely. We have a dedicated 'Entry Level / Fresh Grad' filter specifically welcoming graduates from Caraga universities and vocational centers." },
      { q: "Can I apply using my mobile phone browser?", a: "Yes, JobConnect is engineered as a responsive web app. You don't need to download anything from app stores; just open the browser and tap Direct Apply." }
    ]
  },
  {
    category: "Employers & HR in Caraga",
    questions: [
      { q: "How do we post jobs for our Butuan or Caraga business?", a: "Switch to Employer Mode in the top navigation, click 'Post Vacancy', set your salary range in ₱ PHP and location, and publish instantly." },
      { q: "Can we review candidate resumes and schedule interviews?", a: "Yes! The candidate pipeline in your Overview hub lets you view resumes, move candidates through recruitment stages, and send interview notices." },
      { q: "Does JobConnect support hybrid and remote roles in the region?", a: "Yes. Many Caraga IT, BPO, and design teams hire for 100% remote or hybrid setups across Agusan and Surigao." }
    ]
  },
  {
    category: "Locations Covered",
    questions: [
      { q: "Which areas in Caraga Region (Region XIII) are supported?", a: "We actively cover Butuan City, Cabadbaran City, Surigao City, Bayugan City, Bislig City, and all 5 provinces: Agusan del Norte, Agusan del Sur, Surigao del Norte, Surigao del Sur, and Dinagat Islands." },
      { q: "Where is the JobConnect Caraga coordination center?", a: "Our regional tech hub coordinates from J.C. Aquino Avenue, Butuan City, Agusan del Norte." }
    ]
  }
];
