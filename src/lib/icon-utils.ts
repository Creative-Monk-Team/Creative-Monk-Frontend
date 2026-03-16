import * as LucideIcons from "lucide-react";

export function getIcon(iconName: string): any {
  if (!iconName) return LucideIcons.Code;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || LucideIcons.Code;
}
