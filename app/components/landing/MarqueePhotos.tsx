"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  "https://images.pexels.com/photos/6393318/pexels-photo-6393318.jpeg",
  "https://images.pexels.com/photos/4617294/pexels-photo-4617294.jpeg",
  "https://images.pexels.com/photos/7220529/pexels-photo-7220529.jpeg",
  "https://images.pexels.com/photos/64242/baby-hand-dad-64242.jpeg",
  "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg",
  "https://images.pexels.com/photos/302083/pexels-photo-302083.jpeg",
];

export default function MarqueePhotos() {
  return (
    <section className="py-14 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold text-sm uppercase tracking-widest mb-3">
            Community
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Moments That Matter
          </h2>
          <p className="text-gray-500 mt-2">Real families, real memories</p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-l from-white to-transparent z-10" />

        <motion.div
          className="flex gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {photos.concat(photos).map((src, i) => (
            <div
              key={i}
              className="w-48 h-36 sm:w-60 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0"
            >
              <Image
                src={src}
                alt=""
                width={400}
                height={300}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}