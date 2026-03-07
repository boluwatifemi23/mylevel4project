"use client";

import HeroVideo from "./HeroVideo";
import HeroCards from "./HeroCards";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden pt-20 pb-16">
      <HeroVideo />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20 overflow-hidden mb-10 lg:mb-0"
        >
  
          <div className="absolute inset-0 -z-10 animate-gradient bg-linear-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 opacity-60 blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>50K+ Parents Trust Us</span>
          </motion.div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Connect, Share, and Grow
            <span className="block mt-2 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Together
            </span>
          </h1>

          <p className="text-lg mt-6 text-gray-700 leading-relaxed">
            Join thousands of parents sharing milestones, finding support, and celebrating every precious moment of parenthood.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all group"
            >
              Start Free Today 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#features"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-pink-500 text-pink-600 font-semibold hover:bg-pink-50 transition-all"
            >
              Learn More
            </motion.a>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-700 font-medium">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow"
            >
              <Check className="w-4 h-4 text-green-600" /> Free forever
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow"
            >
              <Check className="w-4 h-4 text-green-600" /> No credit card
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow"
            >
              <Check className="w-4 h-4 text-green-600" /> Safe & Private
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroCards />
        </motion.div>
      </div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  );
}