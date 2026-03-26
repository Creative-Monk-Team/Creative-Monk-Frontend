import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Creative Monk – Digital Marketing Agency Chandigarh",
  description:
    "At CREATIVE MONK, we are focused on enhancing the value of your business through our innovative Web Development, Social Media Promotions, Graphic Designing, Video Edit and Animations.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
