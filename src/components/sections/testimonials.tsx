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
    return null; // Hide if no testimonials
  }

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
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
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          className="testimonials-swiper pb-16"
        >
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <div className="bg-gray-50 h-[300px] animate-pulse rounded-3xl" />
                </SwiperSlide>
              ))
            : testimonials.map((t) => (
                <SwiperSlide key={t._id}>
                  <div className="h-full group px-8 py-10 rounded-[2.5rem] bg-gray-50 border border-gray-100/50 hover:bg-white hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-4 w-4 fill-orange-500 text-orange-500"
                        />
                      ))}
                    </div>

                    <blockquote
                      className="text-xl md:text-2xl font-bold leading-relaxed mb-8 text-gray-900 tracking-tight"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      "{t.text}"
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-xl overflow-hidden">
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
                      <div>
                        <p
                          className="font-black text-lg text-gray-900"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          {t.name}
                        </p>
                        <p className="text-gray-500 text-sm font-medium">
                          {t.role}
                        </p>
                      </div>
                      <div className="ml-auto opacity-10 group-hover:opacity-100 group-hover:text-orange-500 transition-all">
                        <Quote className="h-10 w-10 rotate-180" />
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
