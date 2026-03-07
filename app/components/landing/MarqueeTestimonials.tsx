'use client';

import { motion } from 'framer-motion';

const items = [
  '"Emma took her first steps today!" — Sarah',
  '"Liam said Mama today 💕" — Daniel',
  '"This app helped me find my village." — Jessica',
  '"Daily tips made a huge difference." — Priya',
];

export default function MarqueeTestimonials() {
  return (
    <section className="py-8 bg-pink-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          >
            {items.concat(items).map((t, i) => (
              <div key={i} className="px-6 py-3 bg-white rounded-full shadow text-gray-700 text-sm">
                {t}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
