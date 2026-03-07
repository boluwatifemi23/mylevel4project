'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const photos = [
  'https://images.pexels.com/photos/6393318/pexels-photo-6393318.jpeg',
  'https://images.pexels.com/photos/4617294/pexels-photo-4617294.jpeg',
  'https://images.pexels.com/photos/7220529/pexels-photo-7220529.jpeg',
  'https://images.pexels.com/photos/64242/baby-hand-dad-64242.jpeg',
];

export default function MarqueePhotos() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            {photos.concat(photos).map((src, i) => (
              <div key={i} className="w-40 h-28 rounded-xl overflow-hidden shadow bg-gray-100 shrink-0">
                <Image src={src} alt="" width={320} height={220} className="object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
