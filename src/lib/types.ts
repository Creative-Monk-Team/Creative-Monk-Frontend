export type Seo = {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
};

export type SiteMetric = {
  label: string;
  value: string;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  whatsapp?: string;
  twitter?: string;
};

export type SiteLink = {
  label: string;
  href: string;
};

export type SiteSettings = {
  _id: string;
  companyName: string;
  legalName?: string;
  tagline?: string;
  description?: string;
  website?: string;
  phone?: string;
  phoneRaw?: string;
  email?: string;
  workingHours?: string;
  yearFounded?: number;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    full?: string;
    mapsUrl?: string;
  };
  social?: SocialLinks;
  hero?: {
    eyebrow?: string;
    title?: string;
    highlight?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    trustPoints?: string[];
  };
  stats?: SiteMetric[];
  aboutHeadline?: string;
  aboutDescription?: string;
  aboutStory?: string[];
  whyChooseUs?: string[];
  values?: { title: string; description: string }[];
  footerLinks?: {
    company?: SiteLink[];
    services?: SiteLink[];
    legal?: SiteLink[];
  };
  seoDefaults?: Seo;
  sectionToggles?: {
    showClients?: boolean;
    showServices?: boolean;
    showCaseStudies?: boolean;
    showTestimonials?: boolean;
    showBlogs?: boolean;
    showFaqs?: boolean;
  };
};

export type ServiceCategory = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
};

export type ProcessStep = {
  step: string;
  desc: string;
};

export type FAQ = {
  _id?: string;
  question: string;
  answer: string;
  page?: "home" | "services" | "contact" | "about" | "general";
  order?: number;
  isActive?: boolean;
};

export type Service = {
  _id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  tagline?: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  icon: string;
  image: string;
  features: string[];
  process: ProcessStep[];
  outcomes: string[];
  faqs: FAQ[];
  detailContent?: {
    heroEyebrow?: string;
    overviewTitle?: string;
    partnerTitle?: string;
    partnerDescription?: string;
    bestFitTitle?: string;
    bestFitDescription?: string;
    capabilitiesTitle?: string;
    processTitle?: string;
    faqTitle?: string;
    deliveryLabel?: string;
    deliveryDescription?: string;
  };
  seo?: Seo;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
};

export type CaseStudy = {
  _id: string;
  id: string;
  title: string;
  client?: string;
  category: string;
  description: string;
  content?: string;
  services?: string[];
  challenges?: string[];
  solutions?: string[];
  results?: string[];
  metrics?: SiteMetric[];
  gallery?: string[];
  testimonial?: {
    text?: string;
    author?: string;
    role?: string;
  };
  link?: string;
  duration?: string;
  image?: string;
  portfolioImage?: string;
  seo?: Seo;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
};

export type Client = {
  _id: string;
  name: string;
  website?: string;
  logo?: string;
  status: "active" | "inactive";
  order: number;
  isFeatured: boolean;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  text: string;
  rating: number;
  avatar?: string;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
};

export type BlogPost = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  readTime?: string;
  featured: boolean;
  isPublished: boolean;
  seo?: Seo;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  social?: SocialLinks;
  order: number;
  isActive: boolean;
};

export type CareerOpening = {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  skills?: string[];
  applyEmail?: string;
  isActive: boolean;
  order: number;
};

export type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  sourcePage?: string;
  status: "new" | "in-progress" | "responded" | "archived";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  stage?: PipelineStage;
  assignedTo?: string;
  priority?: LeadPriority;
  estimatedValue?: number;
  convertedClientId?: string;
};

export type DashboardStats = {
  services: number;
  caseStudies: number;
  blogs: number;
  enquiries: number;
  newEnquiries: number;
  clients: number;
  testimonials: number;
  careers: number;
};

export type AdminRole = "seo_admin" | "super_admin";

export type AdminUser = {
  email: string;
  role: AdminRole;
  name: string;
};

export type FinanceRecord = {
  _id: string;
  label: string;
  periodKey: string;
  currency?: string;
  revenue: number;
  expenses: number;
  adSpend?: number;
  payroll?: number;
  toolsCost?: number;
  outstandingInvoices?: number;
  cashInHand?: number;
  profit?: number;
  marginPct?: number;
  status?: "forecast" | "actual" | "closed";
  notes?: string;
  isActive?: boolean;
};

export type Employee = {
  _id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: "active" | "on-leave" | "probation" | "freelance" | "inactive";
  employmentType?: "full-time" | "part-time" | "contract" | "intern";
  monthlySalary?: number;
  utilizationPct?: number;
  ownerLevel?: "lead" | "member" | "executive";
  joinedAt?: string;
  assignedClients?: string[];
  primarySkills?: string[];
  goals?: string[];
  notes?: string;
  order?: number;
  isActive?: boolean;
};

export type AgencyClient = {
  _id: string;
  name: string;
  website?: string;
  primaryContact?: string;
  contactEmail?: string;
  contactPhone?: string;
  owner?: string;
  status?: "onboarding" | "active" | "retainer" | "paused" | "offboarded";
  monthlyRetainer?: number;
  projectHealth?: "green" | "amber" | "red";
  seoScore?: number;
  socialScore?: number;
  websiteScore?: number;
  nextReviewDate?: string;
  services?: string[];
  websitesManaged?: string[];
  priorityGoals?: string[];
  notes?: string;
  hasCmsAccess?: boolean;
  order?: number;
  isActive?: boolean;
};

export type SuperAdminOverview = {
  overview: DashboardStats & {
    trackedRevenue: number;
    trackedExpenses: number;
    trackedProfit: number;
    outstandingInvoices: number;
    avgTeamUtilization: number;
    totalPayroll: number;
    totalRetainers: number;
    liveWebsites: number;
    managedWebsites: number;
    activeServiceLines: number;
  };
  financeTrend: Array<{
    label: string;
    periodKey?: string;
    revenue: number;
    expenses: number;
    adSpend?: number;
    payroll?: number;
    toolsCost?: number;
    profit: number;
    marginPct: number;
    cashInHand?: number;
    outstandingInvoices?: number;
    status?: string;
  }>;
  dailyEnquiries: Array<{
    key: string;
    label: string;
    total: number;
  }>;
  teamSnapshot: Array<{
    _id: string;
    name: string;
    role: string;
    department: string;
    status: string;
    ownerLevel?: string;
    utilizationPct: number;
    monthlySalary?: number;
    assignedClients: string[];
  }>;
  clientSnapshot: Array<{
    _id: string;
    name: string;
    website?: string;
    owner?: string;
    status?: string;
    projectHealth?: string;
    monthlyRetainer: number;
    seoScore: number;
    socialScore: number;
    websiteScore: number;
    nextReviewDate?: string;
    services: string[];
    websitesManaged?: string[];
    priorityGoals?: string[];
    hasCmsAccess?: boolean;
  }>;
  clientRetainers: Array<{
    _id: string;
    name: string;
    monthlyRetainer: number;
    owner?: string;
    projectHealth?: string;
  }>;
  enquiryPipeline: Array<{
    status: string;
    total: number;
  }>;
  recentEnquiries: Array<{
    _id: string;
    name: string;
    service?: string;
    status: string;
    sourcePage?: string;
    createdAt: string;
  }>;
  reviewQueue: Array<{
    _id: string;
    name: string;
    owner?: string;
    projectHealth?: string;
    reviewDueInDays: number | null;
    nextReviewDate?: string;
  }>;
  actionItems: Array<{
    title: string;
    detail: string;
    href: string;
    priority: "high" | "medium" | "low";
  }>;
  activityFeed: Array<{
    type: string;
    title: string;
    meta: string;
    date: string;
  }>;
  sourceBreakdown: Array<{
    source: string;
    total: number;
  }>;
  alertsSnapshot: Array<{
    id: string;
    label: string;
    total: number;
    value: number;
    tone: "high" | "medium" | "low";
    href: string;
  }>;
  contentSnapshot: {
    totalPublishedBlogs: number;
    featuredBlogs: number;
    latestTitles: Array<{
      title: string;
      slug: string;
      category: string;
    }>;
  };
};

export type PipelineStage = "new" | "qualified" | "proposal_sent" | "negotiation" | "won" | "lost";
export type LeadPriority = "hot" | "warm" | "cold";

export type Activity = {
  _id: string;
  leadId?: string;
  clientId?: string;
  type: "note" | "call" | "email" | "meeting" | "stage_change" | "system";
  content: string;
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
};

export type FollowUp = {
  _id: string;
  leadId?: string;
  clientId?: string;
  title: string;
  notes?: string;
  dueDate: string;
  status: "pending" | "done";
  completedAt?: string;
  isOverdue?: boolean;
  createdBy: string;
  createdAt: string;
};

export type ClientReview = {
  _id: string;
  clientId: string;
  reviewDate: string;
  seoScore: number;
  socialScore: number;
  websiteScore: number;
  overallHealth: "green" | "amber" | "red";
  notes?: string;
  reviewedBy: string;
  createdAt: string;
};

export type PipelineColumn = {
  stage: PipelineStage;
  leads: Enquiry[];
  count: number;
};

export type FinanceSummary = {
  revenue: number;
  expenses: number;
  profit: number;
  adSpend: number;
  payroll: number;
  toolsCost: number;
  outstandingInvoices: number;
  cashInHand: number;
  marginPct: number;
  records: Array<{
    _id: string;
    label: string;
    periodKey: string;
    revenue: number;
    expenses: number;
    adSpend: number;
    payroll: number;
    toolsCost: number;
    profit: number;
    marginPct: number;
    outstandingInvoices: number;
    cashInHand: number;
    status: string;
    notes?: string;
  }>;
};

export type ExpenseBreakdown = {
  payroll: number;
  adSpend: number;
  toolsCost: number;
  other: number;
};

export type PnlRow = {
  label: string;
  periodKey: string;
  revenue: number;
  expenses: number;
  payroll: number;
  adSpend: number;
  toolsCost: number;
  otherExpenses: number;
  profit: number;
  marginPct: number;
  status: string;
};

export type EmployeeSummary = {
  totalActive: number;
  totalPayroll: number;
  avgUtilization: number;
  departments: Array<{ name: string; count: number }>;
  overloaded: number;
};

export type EmployeeUtilization = {
  _id: string;
  name: string;
  role: string;
  department: string;
  utilizationPct: number;
  monthlySalary: number;
  assignedClients: string[];
  status: string;
};

export type DepartmentStat = {
  name: string;
  count: number;
  totalSalary: number;
  avgUtilization: number;
};

export type MediaUploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number;
  originalFilename?: string;
};
