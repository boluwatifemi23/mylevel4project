"use client";

import HeroVideo from "./HeroVideo";
import HeroCards from "./HeroCards";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-screen flex items-center">
      <HeroVideo />

    
      <div className="absolute inset-0 `z-1` bg-linear-to-r from-black/60 via-black/40 to-black/20" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

    
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>50K+ Parents Trust Us</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Connect, Share,
              <br />
              and Grow
              <span className="block mt-1 bg-linear-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
                Together
              </span>
            </h1>

            <p className="text-base sm:text-lg mt-5 text-white/80 leading-relaxed max-w-lg">
              Join thousands of parents sharing milestones, finding support, and
              celebrating every precious moment of parenthood.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="/signup"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-xl hover:shadow-pink-500/30 transition-all group text-base"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#features"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/25 transition-all text-base"
              >
                Learn More
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Free forever", "No credit card", "Safe & Private"].map(
                (text, i) => (
                  <motion.span
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-sm text-white/90"
                  >
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    {text}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>

          {/* Right: Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <HeroCards />
          </motion.div>
        </div>
      </div>
    </section>
  );
}