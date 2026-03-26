"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { getTestimonials } from "@/lib/api";
import type { Testimonial } from "@/lib/types";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="section-label inline-block mb-4">Testimonials</span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            What Our <span className="text-[#FF6600]">Clients Say</span>
          </h2>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          className="testimonials-swiper"
        >
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-gray-50 h-[320px] animate-pulse rounded-2xl" />
                </SwiperSlide>
              ))
            : testimonials.map((t) => (
                <SwiperSlide key={t._id} className="!h-auto">
                  <div className="flex h-full flex-col group px-7 py-8 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-white hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                    <div className="flex gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-4 w-4 fill-orange-500 text-orange-500"
                        />
                      ))}
                    </div>

                    <blockquote
                      className="text-lg md:text-xl font-bold leading-relaxed mb-6 text-gray-900 tracking-tight flex-1 line-clamp-5"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto pt-5 border-t border-gray-100">
                      <div className="h-12 w-12 shrink-0 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-lg overflow-hidden">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          t.name?.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-black text-base text-gray-900 truncate"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {t.name}
                        </p>
                        <p className="text-gray-500 text-sm font-medium truncate">
                          {t.role}{t.company ? `, ${t.company}` : ""}
                        </p>
                      </div>
                      <div className="ml-auto shrink-0 opacity-[0.06] group-hover:opacity-100 group-hover:text-orange-500 transition-all">
                        <Quote className="h-8 w-8 rotate-180" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
}
