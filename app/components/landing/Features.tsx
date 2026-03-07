'use client';

import { TrendingUp, Star, Users, Heart, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Users, title: 'Connect with Parents', description: 'Join groups, follow parents, and build your support network', color: 'from-pink-500 to-pink-600' },
  { icon: Star, title: 'Share Milestones', description: 'Celebrate every milestone with photos & videos', color: 'from-purple-500 to-purple-600' },
  { icon: TrendingUp, title: 'Track Growth', description: "A private dashboard for your baby's development", color: 'from-blue-500 to-blue-600' },
  { icon: Heart, title: 'Get Support', description: 'Ask questions & share experiences', color: 'from-red-500 to-red-600' },
  { icon: Calendar, title: 'Daily Insights', description: 'Age-specific tips delivered every day', color: 'from-green-500 to-green-600' },
  { icon: BookOpen, title: 'Learn Together', description: 'Expert articles, videos & resources', color: 'from-yellow-500 to-yellow-600' },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Everything You Need</h2>
          <p className="text-gray-600 text-lg mt-2">Social connection meets smart tracking</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="p-6 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl hover:shadow-xl transition"
            >
              <div className={`w-12 h-12 bg-linear-to-r ${f.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-700">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

