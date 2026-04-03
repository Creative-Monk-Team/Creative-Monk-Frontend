"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Minus,
  RotateCcw,
  X,
  Clock3,
  Layers3,
  Building2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/lib/types";

type PortfolioLightboxProps = {
  projects: CaseStudy[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function PortfolioLightbox({
  projects,
  index,
  onClose,
  onChange,
}: PortfolioLightboxProps) {
  const [zoom, setZoom] = useState(1);

  const project = index !== null ? projects[index] : null;

  useEffect(() => {
    setZoom(1);
  }, [index]);

  useEffect(() => {
    if (index === null || projects.length === 0) return undefined;
    const currentIndex = index;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((currentIndex + 1) % projects.length);
      if (event.key === "ArrowLeft") onChange((currentIndex - 1 + projects.length) % projects.length);
      if (event.key === "+") setZoom((value) => Math.min(value + 0.25, 2.5));
      if (event.key === "-") setZoom((value) => Math.max(value - 0.25, 1));
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, onChange, onClose, projects.length]);

  if (!project) return null;

  const canNavigate = projects.length > 1;
  const portfolioImage =
    project.portfolioImage || project.gallery?.[0] || project.image || "/placeholder.jpg";

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(1380px,calc(100vw-1rem))] max-w-[min(1380px,calc(100vw-1rem))] overflow-hidden rounded-[1.8rem] border-0 bg-[#111111] p-0 text-white shadow-2xl sm:max-w-[min(1380px,calc(100vw-1rem))]"
      >
        <DialogTitle className="sr-only">{project.title} preview</DialogTitle>

        <div className="grid max-h-[92vh] min-h-[75vh] grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_400px]">
          <div className="flex min-h-[340px] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,122,26,0.14),_transparent_34%),linear-gradient(180deg,_#151210_0%,_#0f0d0c_100%)]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                  onClick={() => setZoom((value) => Math.max(value - 0.25, 1))}
                >
                  <Minus />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                  onClick={() => setZoom((value) => Math.min(value + 0.25, 2.5))}
                >
                  <Plus />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                  onClick={() => setZoom(1)}
                >
                  <RotateCcw />
                </Button>
                <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Zoom {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                {canNavigate ? (
                  <>
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                      onClick={() => onChange((index! - 1 + projects.length) % projects.length)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                      onClick={() => onChange((index! + 1) % projects.length)}
                    >
                      <ChevronRight />
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-full border border-white/10 bg-black/45 text-white hover:bg-black/65"
                  onClick={onClose}
                >
                  <X />
                </Button>
              </div>
            </div>

            <div className="custom-scrollbar h-full min-h-[320px] w-full overflow-auto rounded-[1.4rem] border border-white/8 bg-white/4 p-3 md:min-h-[520px] md:p-6">
              <div className="flex min-h-full w-full items-start justify-center">
                <img
                  src={portfolioImage}
                  alt={project.title}
                  className="block h-auto max-w-none rounded-[1rem] object-top transition-[width] duration-200"
                  style={{ width: `${zoom * 100}%`, minWidth: "100%" }}
                />
              </div>
            </div>
          </div>

          <aside className="flex max-h-[40vh] flex-col border-t border-white/8 bg-[#181311] xl:max-h-[88vh] xl:border-t-0 xl:border-l">
            <div className="custom-scrollbar overflow-y-auto px-5 py-6 md:px-7 md:py-8">
              <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200">
                {project.category}
              </span>

              <h3 className="mt-4 text-3xl font-black leading-[1] tracking-[-0.04em] text-white md:text-4xl">
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/68 md:text-[15px]">
                {project.description}
              </p>

              <div className="mt-6 grid gap-3">
                {project.client ? (
                  <LightboxMeta
                    icon={<Building2 className="h-4 w-4" />}
                    label="Client"
                    value={project.client}
                  />
                ) : null}
                {project.duration ? (
                  <LightboxMeta
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Duration"
                    value={project.duration}
                  />
                ) : null}
                {project.services?.length ? (
                  <LightboxMeta
                    icon={<Layers3 className="h-4 w-4" />}
                    label="Services"
                    value={project.services.join(", ")}
                  />
                ) : null}
              </div>

              {project.results?.length ? (
                <div className="mt-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200">
                    Outcome Highlights
                  </p>
                  <div className="mt-4 space-y-3">
                    {project.results.slice(0, 3).map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6600]" />
                        <p className="text-sm leading-7 text-white/72">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/8 bg-white/[0.03] px-5 py-4 md:px-7">
              <div className="flex flex-col gap-3">
                <Link href={`/case-studies/${project.id}`} className="btn-primary justify-center">
                  Open Case Study
                  <ExternalLink className="h-4 w-4" />
                </Link>
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-orange justify-center"
                  >
                    Visit Live Project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LightboxMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.04] px-4 py-3.5">
      <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold leading-6 text-white/88">{value}</p>
    </div>
  );
}
