import { SectionHeading } from "./section-heading";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_top,_rgba(255,124,48,0.16),_transparent_40%),linear-gradient(180deg,#fff7f0_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
