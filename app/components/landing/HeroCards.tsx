"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const CARDS = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/6393318/pexels-photo-6393318.jpeg",
    name: "Sarah M.",
    time: "2 hours ago",
    text: "Emma took her first steps today! Can't believe she is growing so fast...",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/4617294/pexels-photo-4617294.jpeg",
    name: "Daniel",
    time: "1 day ago",
    text: "Liam said his first word today — 'Mama' 💕",
    likes: 410,
    comments: 88,
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/7220529/pexels-photo-7220529.jpeg",
    name: "Jessica",
    time: "3 hours ago",
    text: "Can't believe how fast this little angel is growing 😍",
    likes: 122,
    comments: 19,
  },
];

export default function HeroCards() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative h-[460px] flex justify-center items-center">
      {CARDS.map((card, idx) => {
        const right = (active + 1) % CARDS.length;
        const left = (active - 1 + CARDS.length) % CARDS.length;

        let style = {};
        if (idx === active)
          style = { x: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 30 };
        else if (idx === right)
          style = { x: 160, scale: 0.78, opacity: 0.75, rotate: 6, zIndex: 10 };
        else
          style = { x: -160, scale: 0.78, opacity: 0.75, rotate: -6, zIndex: 10 };

        return (
          <motion.div
            key={card.id}
            animate={style}
            onClick={() => setActive(idx)}
            transition={{ duration: 0.55 }}
            className="absolute cursor-pointer"
          >
            <div className="w-72 rounded-3xl overflow-hidden bg-white shadow-2xl">
              <div className="relative w-full h-44">
                <Image src={card.img} alt={card.name} fill className="object-cover" />
              </div>

              <div className="p-4">
                <p className="font-semibold">{card.name}</p>
                <p className="text-xs text-gray-500">{card.time}</p>
                <p className="text-sm mt-3">{card.text}</p>

                <div className="flex justify-between text-xs mt-3">
                  <span>❤️ {card.likes}</span>
                  <span>💬 {card.comments}</span>
                  <span className="text-pink-600 font-medium">Demo</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
