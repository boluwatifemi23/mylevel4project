'use client';

import { useEffect, useState } from 'react';

function useCountUp(target: number, trigger: boolean, ms = 1200) {
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

export default function Stats() {
  const s1 = useCountUp(50000, true, 1400);
  const s2 = useCountUp(1000000, true, 1400);
  const s3 = useCountUp(49, true, 1400);

  return (
    <section className="py-16 bg-linear-to-r from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">

        <div>
          <p className="text-4xl font-bold text-gray-900">{`${Math.round(s1 / 1000)}K+`}</p>
          <p className="text-gray-600 mt-2">Active Parents</p>
        </div>

        <div>
          <p className="text-4xl font-bold text-gray-900">{`${Math.round(s2 / 1_000_000)}M+`}</p>
          <p className="text-gray-600 mt-2">Milestones Shared</p>
        </div>

        <div>
          <p className="text-4xl font-bold text-gray-900">{(s3 / 10).toFixed(1)}★</p>
          <p className="text-gray-600 mt-2">App Rating</p>
        </div>

      </div>
    </section>
  );
}
