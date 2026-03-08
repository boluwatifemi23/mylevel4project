"use client";

import { TrendingUp, Star, Users, Heart, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Connect with Parents",
    description: "Join groups, follow parents, and build your support network",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    icon: Star,
    title: "Share Milestones",
    description: "Celebrate every milestone with photos & videos",
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Track Growth",
    description: "A private dashboard for your baby's development",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
  },
  {
    icon: Heart,
    title: "Get Support",
    description: "Ask questions & share experiences with a caring community",
    color: "from-red-500 to-pink-500",
    bg: "bg-red-50",
  },
  {
    icon: Calendar,
    title: "Daily Insights",
    description: "Age-specific tips and reminders delivered every day",
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
  },
  {
    icon: BookOpen,
    title: "Learn Together",
    description: "Expert articles, videos & curated resources",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-gray-500 text-lg mt-3 max-w-xl mx-auto">
            Social connection meets smart tracking — built for modern parents.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group p-6 ${f.bg} rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300`}
            >
              <div
                className={`w-12 h-12 bg-linear-to-r ${f.color} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}