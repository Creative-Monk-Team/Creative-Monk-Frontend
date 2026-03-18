import type {
  BlogPost,
  CareerOpening,
  CaseStudy,
  Client,
  DashboardStats,
  Enquiry,
  FAQ,
  MediaUploadResult,
  Service,
  ServiceCategory,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api";

type FetchOptions = RequestInit & {
  token?: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]) {
  const normalizedBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;
  const url = new URL(path, normalizedBase);

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path, options.searchParams), {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(payload || `Request failed with ${response.status}`);
  }

  return response.json();
}

export async function getSiteSettings() {
  try {
    return await request<SiteSettings>("site-settings");
  } catch {
    return null;
  }
}

export async function getServiceCategories() {
  try {
    return await request<ServiceCategory[]>("service-categories");
  } catch {
    return [];
  }
}

export async function getServices(searchParams?: FetchOptions["searchParams"]) {
  try {
    return await request<Service[]>("services", { searchParams });
  } catch {
    return [];
  }
}

export async function getService(slug: string) {
  try {
    return await request<Service>(`services/${slug}`);
  } catch {
    return null;
  }
}

export async function getCaseStudies(searchParams?: FetchOptions["searchParams"]) {
  try {
    return await request<CaseStudy[]>("case-studies", { searchParams });
  } catch {
    return [];
  }
}

export async function getCaseStudy(id: string) {
  try {
    return await request<CaseStudy>(`case-studies/${id}`);
  } catch {
    return null;
  }
}

export async function getClients(searchParams?: FetchOptions["searchParams"]) {
  try {
    return await request<Client[]>("clients", { searchParams });
  } catch {
    return [];
  }
}

export async function getTestimonials(searchParams?: FetchOptions["searchParams"]) {
  try {
    return await request<Testimonial[]>("testimonials", { searchParams });
  } catch {
    return [];
  }
}

export async function getBlogs(searchParams?: FetchOptions["searchParams"]) {
  try {
    return await request<BlogPost[]>("blogs", { searchParams });
  } catch {
    return [];
  }
}

export async function getBlog(slug: string) {
  try {
    return await request<BlogPost>(`blogs/${slug}`);
  } catch {
    return null;
  }
}

export async function getFaqs(page?: string) {
  try {
    return await request<FAQ[]>("faqs", {
      searchParams: page ? { page } : undefined,
    });
  } catch {
    return [];
  }
}

export async function getTeam() {
  try {
    return await request<TeamMember[]>("team");
  } catch {
    return [];
  }
}

export async function getCareers() {
  try {
    return await request<CareerOpening[]>("careers");
  } catch {
    return [];
  }
}

export async function submitEnquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  sourcePage?: string;
}) {
  return request<{ success: boolean; message: string }>("contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const adminApi = {
  login(email: string, password: string) {
    return request<{ token: string; user: { email: string; role: string; name: string } }>(
      "auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
  },
  me(token: string) {
    return request<{ user: { email: string; role: string; name: string } }>("auth/me", {
      token,
    });
  },
  getStats(token: string) {
    return request<DashboardStats>("stats", { token });
  },
  list<T>(path: string, token: string) {
    return request<T>(path, { token });
  },
  create<T>(path: string, token: string, body: unknown) {
    return request<T>(path, {
      token,
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  update<T>(path: string, token: string, body: unknown, method: "PUT" | "PATCH" = "PUT") {
    return request<T>(path, {
      token,
      method,
      body: JSON.stringify(body),
    });
  },
  remove(path: string, token: string) {
    return request<{ success: boolean }>(path, {
      token,
      method: "DELETE",
    });
  },
  uploadMedia(token: string, file: File, options?: { folder?: string; publicId?: string }) {
    const formData = new FormData();
    formData.append("file", file);

    if (options?.folder) {
      formData.append("folder", options.folder);
    }

    if (options?.publicId) {
      formData.append("publicId", options.publicId);
    }

    return request<MediaUploadResult>("uploads/media", {
      token,
      method: "POST",
      body: formData,
    });
  },
};

export const apiService = {
  getServices: (): Promise<any> => getServices() as Promise<any>,
  getServiceBySlug: (slug: string): Promise<any> => getService(slug) as Promise<any>,
  getClients: (): Promise<any> => getClients() as Promise<any>,
  getPortfolio: (): Promise<any> => getCaseStudies() as Promise<any>,
  getCaseStudyById: (id: string): Promise<any> => getCaseStudy(id) as Promise<any>,
  getBlogs: (): Promise<any> => getBlogs() as Promise<any>,
};

export type AdminCollectionMap = {
  services: Service[];
  caseStudies: CaseStudy[];
  blogs: BlogPost[];
  clients: Client[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  team: TeamMember[];
  careers: CareerOpening[];
  enquiries: Enquiry[];
};
