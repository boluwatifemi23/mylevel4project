"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target: number, trigger: boolean, ms = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / ms, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, trigger, ms]);
  return value;
}

const stats = [
  { label: "Active Parents", value: 50000, format: (n: number) => `${Math.round(n / 1000)}K+` },
  { label: "Milestones Shared", value: 1000000, format: (n: number) => `${Math.round(n / 1_000_000)}M+` },
  { label: "App Rating", value: 49, format: (n: number) => `${(n / 10).toFixed(1)}★` },
  { label: "Countries", value: 42, format: (n: number) => `${n}+` },
];

export default function Stats() {
  const s0 = useCountUp(stats[0].value, true);
  const s1 = useCountUp(stats[1].value, true);
  const s2 = useCountUp(stats[2].value, true);
  const s3 = useCountUp(stats[3].value, true);
  const values = [s0, s1, s2, s3];

  return (
    <section className="py-16 sm:py-20 bg-linear-to-r from-pink-500 via-rose-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {s.format(values[i])}
              </p>
              <p className="text-white/80 mt-2 text-sm sm:text-base font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}