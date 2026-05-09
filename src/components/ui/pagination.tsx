"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all ${
            currentPage === page
              ? "border-[#FF6600] bg-[#FF6600] text-white"
              : "border-gray-100 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-slate-600 transition-all hover:border-orange-200 hover:bg-orange-50 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
