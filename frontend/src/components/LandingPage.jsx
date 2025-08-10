import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Palette, Download, Users, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import AuthModal from './AuthModal';

// CDN video URL (royalty-free Pexels clip)
const BG_VIDEO = 'https://player.vimeo.com/external/371233612.sd.mp4?s=7980c8b6f1762d9c0d6c1c9dc2d9b8061577e9f8&profile_id=139';

const LandingPage = ({ onLogin, onSignup, isLoading }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    { icon: Sparkles, title: 'AI-Powered Generation', description: 'Create stunning banners with state-of-the-art AI' },
    { icon: Palette, title: 'Smart Color Palettes', description: 'Intelligent color suggestions for your brand' },
    { icon: Zap, title: 'Lightning Fast', description: 'Generate professional banners in seconds' },
    { icon: Download, title: 'High-Quality Export', description: 'Download in multiple formats and resolutions' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Marketing Director', avatar: 'https://i.pravatar.cc/100?img=32', content: 'BannerCraft AI has revolutionized our marketing workflow. We create professional banners in minutes!' },
    { name: 'Mike Rodriguez', role: 'E-commerce Owner', avatar: 'https://i.pravatar.cc/100?img=25', content: 'The AI understands exactly what I need. My conversion rates have increased by 40% since using this tool.' },
    { name: 'Emily Watson', role: 'Social Media Manager', avatar: 'https://i.pravatar.cc/100?img=12', content: 'Creating consistent, beautiful banners for all our campaigns has never been easier. Absolutely love it!' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover brightness-50 contrast-125">
        <source src={BG_VIDEO} type="video/mp4" />
      </video>

      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      {/* Base Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-xl" />

      {/* Content */}
      <main className="relative z-10 text-white font-sans">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 px-5 py-2 rounded-full animate-pulse">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span className="font-medium">AI Powered</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
              Create Stunning AI Banners
            </h1>
            <p className="text-lg md:text-2xl text-white/80">
              Transform your ideas into professional promotional banners with the power of artificial intelligence. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-2xl transition">
                Start Creating Free <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 shadow transition">
                <Play className="inline-block w-5 h-5 mr-2" /> Watch Demo
              </motion.button>
            </div>
            <div className="flex justify-center gap-8 mt-8 text-sm text-white/60">
              <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 50K+ Creators</div>
              <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-300" /> 4.9/5 Rating</div>
              <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-300" /> 1M+ Banners Created</div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose BannerCraft AI?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl hover:scale-105 transition shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-white/70">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12">
            Loved by Creators Worldwide
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl hover:shadow-2xl transition">
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow" />
                  <div>
                    <h4 className="font-semibold">{t.name}</h4>
                    <p className="text-sm text-white/60">{t.role}</p>
                  </div>
                </div>
                <p className="italic text-white/80 mb-4">“{t.content}”</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-yellow-400/10 to-pink-400/10 border border-white/10 backdrop-blur-xl p-12 rounded-3xl max-w-3xl mx-auto shadow-lg">
            <h2 className="text-4xl font-bold mb-6">Ready to Create Amazing Banners?</h2>
            <p className="text-xl text-white/80 mb-8">Join the AI revolution and start creating professional banners that convert.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAuthModal(true)}
              className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl shadow-xl transition">
              <Sparkles className="inline-block w-6 h-6 mr-2" /> Get Started Now
            </motion.button>
          </motion.div>
        </section>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={onLogin} onSignup={onSignup} isLoading={isLoading} />
    </div>
  );
};

export default LandingPage;
