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
