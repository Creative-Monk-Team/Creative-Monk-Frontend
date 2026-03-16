// ─── Company Info ───────────────────────────────────────────────────
export const companyInfo = {
  name: "Creative Monk",
  legalName: "The Creative Monk",
  tagline: "Helping Businesses Grow Digitally",
  phone: "+91 94634 45566",
  phoneRaw: "+919463445566",
  email: "info@thecreativemonk.in",
  address: {
    line1: "Office No.11-12, 9th floor",
    line2: "Sushma Infinium",
    city: "Zirakpur",
    state: "Punjab",
    pincode: "140603",
    country: "India",
    full: "Office No.11-12, 9th floor, Sushma Infinium, Zirakpur, Punjab, 140603",
    mapsUrl: "https://g.page/creativemonk?we",
  },
  workingHours: "Mon – Sat: 9AM – 6PM",
  website: "https://thecreativemonk.in",
  social: {
    facebook: "https://www.facebook.com/creativemonkindia",
    instagram: "https://www.instagram.com/creativemonkindia",
    youtube: "https://www.youtube.com/@creativemonkindia",
    linkedin: "https://www.linkedin.com/company/creativemonkindia",
    whatsapp: "https://wa.me/919463445566",
  },
  stats: {
    projects: "180+",
    clients: "250+",
    experience: "5+",
    teamSize: "30+",
  },
  yearFounded: 2019,
  description:
    "Creative Monk is a full-service Digital Marketing agency in Chandigarh, India helping clients grow their business online with Web Designing, Digital Marketing, Graphic Designing & Video Animation services.",
  aboutDescription:
    "At CREATIVE MONK, we are focused on enhancing the value of your brand with the latest tech and marketing skills. Being one of the best digital marketing company in Chandigarh, we deliver quality results in an ethical and affordable manner.",
};

// ─── Team Members ────────────────────────────────────────────────────
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
};

export const teamMembers: TeamMember[] = [
  {
    id: "sanad-tiwari",
    name: "Sanad Tiwari",
    role: "CEO & Founder",
    bio: "Visionary leader with 5+ years in digital marketing. Passionate about helping Indian businesses grow digitally.",
    social: {
      linkedin: "https://www.linkedin.com/in/sanad-tiwari",
      instagram: "https://www.instagram.com/sanad.tiwari",
    },
  },
  {
    id: "siddharth-tiwari",
    name: "Siddharth Tiwari",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in React, Next.js, and modern web technologies.",
    social: {
      linkedin: "https://www.linkedin.com/in/siddharth-tiwari",
    },
  },
  {
    id: "creative-team",
    name: "Creative Team",
    role: "Design & Marketing",
    bio: "A talented team of designers, marketers, and content creators delivering top-notch digital solutions.",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh Kumar",
    role: "CEO",
    company: "TechStart Solutions",
    text: "Creative Monk transformed our digital presence completely. Our website traffic increased by 300% and we saw a significant boost in lead generation. Highly recommended!",
    rating: 5,
  },
  {
    id: "t2",
    name: "Priya Sharma",
    role: "Marketing Director",
    company: "GreenLeaf Organics",
    text: "The team at Creative Monk is exceptional. They built us a stunning ecommerce website and their SEO strategies have been game-changing for our online sales.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Amit Verma",
    role: "Founder",
    company: "FitLife Gym",
    text: "We've been working with Creative Monk for our social media management and the results have been outstanding. Our follower count grew by 200% in just 3 months.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Neha Gupta",
    role: "Owner",
    company: "Luxe Cosmetics",
    text: "The packaging and branding work done by Creative Monk gave our products a premium look. Their attention to detail and creativity is unmatched.",
    rating: 5,
  },
  {
    id: "t5",
    name: "Vikram Singh",
    role: "Managing Director",
    company: "BuildRight Construction",
    text: "Creative Monk redesigned our corporate website and it looks incredible. Professional, modern, and perfectly represents our brand. Great work!",
    rating: 5,
  },
  {
    id: "t6",
    name: "Anjali Mehta",
    role: "CEO",
    company: "EduStart Academy",
    text: "Their PPC campaigns delivered 150% more leads while reducing our cost per lead. The ROI has been phenomenal. Truly the best digital marketing agency.",
    rating: 5,
  },
];

// ─── Blog Posts ────────────────────────────────────────────────────
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  author?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "top-seo-strategies-2024",
    title: "Top 10 SEO Strategies That Actually Work in 2024",
    excerpt:
      "Search engine optimization has evolved dramatically. Here are the strategies that are delivering real results for our clients right now.",
    category: "SEO",
    date: "March 5, 2024",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    featured: true,
    author: "Sanad Tiwari",
  },
  {
    slug: "website-speed-matters",
    title: "Why Website Speed is Your #1 Conversion Factor",
    excerpt:
      "A 1-second delay in page load can cause a 7% drop in conversions. Here's how to make your site blazing fast.",
    category: "Web Development",
    date: "February 20, 2024",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Siddharth Tiwari",
  },
  {
    slug: "social-media-trends-2024",
    title: "Social Media Trends Every Brand Needs to Know in 2024",
    excerpt:
      "From short-form video to AI-generated content, these trends are reshaping how brands connect with audiences.",
    category: "Social Media",
    date: "February 10, 2024",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
  },
  {
    slug: "brand-identity-guide",
    title: "The Complete Guide to Building a Powerful Brand Identity",
    excerpt:
      "Your brand is more than your logo. Learn how to build a brand that resonates with your audience and stands the test of time.",
    category: "Branding",
    date: "January 28, 2024",
    readTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Sanad Tiwari",
  },
  {
    slug: "local-seo-for-businesses",
    title: "Local SEO: How to Dominate Google in Your City",
    excerpt:
      "If you run a local business, local SEO can be the difference between getting customers or losing them to competitors.",
    category: "SEO",
    date: "January 15, 2024",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
  },
  {
    slug: "next-js-vs-wordpress",
    title: "Next.js vs WordPress: Which is Right for Your Business?",
    excerpt:
      "Both are powerful platforms but serve very different needs. Here's how to choose the right one for your project.",
    category: "Web Development",
    date: "January 5, 2024",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Siddharth Tiwari",
  },
];

// ─── Blog Category Colors ────────────────────────────────────────────
export const blogCategoryColors: Record<string, string> = {
  SEO: "#FF6600",
  "Web Development": "#FF6600",
  "Social Media": "#8b5cf6",
  Branding: "#FF6600",
};

// ─── FAQs ───────────────────────────────────────────────────────────
export type FAQ = {
  question: string;
  answer: string;
};

export const homeFaqs: FAQ[] = [
  {
    question: "What services does Creative Monk offer?",
    answer:
      "Creative Monk offers a comprehensive range of digital services including Web Designing & Development (WordPress, Ecommerce, Static & Dynamic Websites), Digital Marketing (SEO, PPC, Social Media Marketing, Lead Generation), and Graphic Designing (Logo Design, Packaging, Social Media Posters, Banners).",
  },
  {
    question: "Where is Creative Monk located?",
    answer:
      "We are based in Zirakpur, Punjab (near Chandigarh), India. Our office is at Sushma Infinium, 9th Floor, Office No.11-12, Zirakpur, Punjab – 140603. We work with clients across India and globally.",
  },
  {
    question: "How long has Creative Monk been in business?",
    answer:
      "Creative Monk has been helping businesses grow digitally since 2019. With over 5 years of experience, we have completed 180+ projects for 250+ clients across various industries.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Website costs vary based on the type and complexity. A basic static website starts from ₹10,000, while custom WordPress or ecommerce websites can range from ₹25,000 to ₹1,00,000+. Contact us for a free quote tailored to your needs.",
  },
  {
    question: "Do you provide SEO services?",
    answer:
      "Yes! SEO is one of our core offerings. We provide comprehensive SEO services including Technical SEO, On-Page SEO, Off-Page SEO (Link Building), Local SEO, and Content Strategy to help your business rank on page 1 of Google.",
  },
  {
    question: "How can I get started with Creative Monk?",
    answer:
      "Getting started is easy! Simply call us at +91 94634 45566, email us at info@thecreativemonk.in, or fill out the contact form on our website. We'll schedule a free consultation to understand your needs and provide a customized proposal.",
  },
];

// ─── Why Choose Us ──────────────────────────────────────────────────
export const whyChooseUs = [
  "Innovative and Economic",
  "Business First Approach",
  "Dedicated Team",
  "Result Oriented Approach",
  "Best in Industry Reporting",
  "Free Website Audit",
  "Transparent Pricing",
  "24/7 Support",
  "100% Client Satisfaction",
];

// ─── Career Openings ────────────────────────────────────────────────
export type JobOpening = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  active: boolean;
};

export const jobOpenings: JobOpening[] = [
  {
    id: "seo-exec",
    title: "SEO Executive",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "We're looking for an SEO Executive to manage on-page/off-page optimization, keyword research, and analytics for our clients.",
    active: true,
  },
  {
    id: "smm",
    title: "Social Media Manager",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-2 years",
    description:
      "Create and manage social media strategies, content calendars, and campaigns for our diverse client portfolio.",
    active: true,
  },
  {
    id: "wp-dev",
    title: "WordPress Developer",
    department: "Web Development",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Build custom WordPress themes, plugins, and responsive websites for clients across various industries.",
    active: true,
  },
  {
    id: "designer",
    title: "Graphic Designer",
    department: "Design",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "0-2 years",
    description:
      "Design logos, social media creatives, banners, packaging, and brand identity materials for our clients.",
    active: true,
  },
  {
    id: "writer",
    title: "Content Writer",
    department: "Content",
    type: "Full-Time / Intern",
    location: "Zirakpur, Punjab (Remote OK)",
    experience: "0-1 years",
    description:
      "Write SEO-friendly blog posts, website copy, and social media content that engages and converts.",
    active: true,
  },
  {
    id: "bde",
    title: "Business Development Executive",
    department: "Sales",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Identify new business opportunities, manage client relationships, and help grow our client base.",
    active: true,
  },
];

// ─── Helper Functions ──────────────────────────────────────────────
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getActiveJobOpenings(): JobOpening[] {
  return jobOpenings.filter((j) => j.active);
}
