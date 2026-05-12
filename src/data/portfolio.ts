// ─── Types ──────────────────────────────────────────────────────────
export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description?: string;
  client?: string;
  url?: string;
};

// ─── Portfolio Data ─────────────────────────────────────────────────
export const portfolioCategories = [
  "All",
  "Web Development",
  "Branding",
  "Printing",
  "Social Media",
  "Graphic Design",
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "techstart-brand",
    title: "TechStart Brand Identity",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=80&w=800",
    tags: ["Logo", "Brand Guidelines"],
    description: "Complete brand identity design for a tech startup.",
    client: "TechStart Solutions",
  },
  {
    id: "greenleaf-ecommerce",
    title: "GreenLeaf E-Commerce",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "Shopify"],
    description: "Full ecommerce platform for organic products.",
    client: "GreenLeaf Organics",
  },
  {
    id: "fashionforward-smm",
    title: "FashionForward SMM",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    tags: ["Instagram", "+200% Followers"],
    description: "Social media management and growth campaign.",
    client: "FashionForward",
  },
  {
    id: "healthfirst-seo",
    title: "HealthFirst SEO",
    category: "SEO",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Technical SEO", "+300% Traffic"],
    description: "Complete SEO overhaul for a healthcare provider.",
    client: "HealthFirst Clinic",
  },
  {
    id: "luxe-packaging",
    title: "Luxe Packaging Design",
    category: "Graphic Design",
    image:
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=800",
    tags: ["Packaging", "Print"],
    description: "Premium product packaging for a luxury brand.",
    client: "Luxe Cosmetics",
  },
  {
    id: "buildright-website",
    title: "BuildRight Website",
    category: "Web Development",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "CMS"],
    description: "Corporate website redesign with modern UI.",
    client: "BuildRight Construction",
  },
  {
    id: "monk-cafe",
    title: "Monk Cafe Brand",
    category: "Branding",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    tags: ["Logo", "Stationery"],
    description: "Brand identity for a premium cafe chain.",
    client: "Monk Cafe",
  },
  {
    id: "edustart-ppc",
    title: "EduStart PPC Campaigns",
    category: "SEO",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["Google Ads", "+150% Leads"],
    description: "PPC and lead generation campaign for education sector.",
    client: "EduStart Academy",
  },
  {
    id: "fitlife-social",
    title: "FitLife Social Campaign",
    category: "Social Media",
    image:
      "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?auto=format&fit=crop&q=80&w=800",
    tags: ["Facebook", "Influencer"],
    description: "Influencer-driven social media campaign.",
    client: "FitLife Gym",
  },
];

// ─── Helper Functions ──────────────────────────────────────────────
export function getProjectById(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.id === id);
}

export function getProjectsByCategory(category: string): PortfolioProject[] {
  if (category === "All") return portfolioProjects;
  return portfolioProjects.filter((p) => p.category === category);
}
