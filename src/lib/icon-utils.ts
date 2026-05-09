import { LucideIcon, Code } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function getIcon(iconName: string): LucideIcon {
  if (!iconName) return Code;
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];
  return IconComponent || Code;
}
