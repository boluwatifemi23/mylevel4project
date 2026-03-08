"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { text: "Emma took her first steps today! Can't believe she's growing so fast.", name: "Sarah M.", handle: "@sarahmom" },
  { text: "Liam said Mama for the first time 💕 I cried happy tears!", name: "Daniel K.", handle: "@danieldad" },
  { text: "This app helped me find my village. Every parent needs this.", name: "Jessica L.", handle: "@jessicaL" },
  { text: "Daily tips made such a huge difference in our routine.", name: "Priya R.", handle: "@priyar" },
  { text: "Finally a place where I feel understood as a new parent.", name: "Amara O.", handle: "@amaramom" },
  { text: "The milestone tracker is absolutely amazing. Love this app!", name: "Tom B.", handle: "@tombdad" },
];

export default function MarqueeTestimonials() {
  return (
    <section className="py-16 sm:py-20 bg-linear-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            What Parents Are Saying
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-pink-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-purple-50 to-transparent z-10" />

        <motion.div
          className="flex gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {testimonials.concat(testimonials).map((t, i) => (
            <div
              key={i}
              className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <Quote className="w-5 h-5 text-pink-400 mb-3" />
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                `{t.text}`
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}