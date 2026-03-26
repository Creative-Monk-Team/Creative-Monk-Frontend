import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career | Join The Creative Monk Team",
  description:
    "Join The Creative Monk team! We're hiring talented digital marketers, web developers, and graphic designers in Chandigarh. Explore open positions and grow your career.",
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
