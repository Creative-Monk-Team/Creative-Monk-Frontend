import type { AdminRole, AdminUser } from "./types";

const TOKEN_KEY = "creative-monk-admin-token";
const USER_KEY = "creative-monk-admin-user";

export function saveAdminSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAdminToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) || "" : "";
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getRoleHomePath(_role?: AdminRole) {
  return "/admin/dashboard";
}
