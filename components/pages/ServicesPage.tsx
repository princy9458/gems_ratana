"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Gem, Sparkles, ShieldCheck, Ruler, Sun, Globe } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    { 
      icon: Sparkles, 
      title: 'Astrological Consultation', 
      sub: 'Expert Kundli analysis to recommend the perfect gemstone for your life goals.',
      details: 'Our experienced astrologers deeply analyze your birth chart to suggest natural, unheated gemstones that harmonize with your ruling planets and elevate your life\'s trajectory, ensuring maximum astrological benefits.'
    },
    { 
      icon: Gem, 
      title: 'Bespoke Jewelry Design', 
      sub: 'Customized rings, pendants, and bracelets crafted around your chosen gemstone.',
      details: 'Work with our master artisans to design high-end, bespoke settings in Gold, Silver, or Platinum. We ensure the gemstone touches your skin precisely as mandated by Vedic practices for optimal energy flow.'
    },
    { 
      icon: ShieldCheck, 
      title: 'Certification & Appraisal', 
      sub: 'Every gemstone comes with guaranteed lab certification for complete peace of mind.',
      details: 'We provide 100% genuine, unheated, and untreated gemstones accompanied by authentication certificates from government-approved and internationally recognized gemological laboratories (like IGI or GIA).'
    },
    { 
      icon: Ruler, 
      title: 'Ring Size Consultation', 
      sub: 'Precision sizing guides and consultations for a perfect, comfortable fit.',
      details: 'Whether you are ordering online or consulting with us, we offer precision measuring support to account for the unique geometry of astrological rings, ensuring the metal holds the gem securely while fitting perfectly.'
    },
    { 
      icon: Sun, 
      title: 'Vedic Energization (Pran Pratishtha)', 
      sub: 'Sacred consecration rituals performed before your gemstone is dispatched.',
      details: 'A gemstone must be awakened to channel its planetary energy. Our pandits perform authentic Vedic mantras and Pran Pratishtha rituals specific to the gemstone\'s ruling planet to activate its dormant powers.'
    },
    { 
      icon: Globe, 
      title: 'Global Secure Delivery', 
      sub: 'Fully insured, white-glove shipping to your doorstep, anywhere in the world.',
      details: 'Your precious gemstones and luxury jewelry pieces are shipped using premium international logistics partners. Every package is fully insured, discreet, and tracked in real-time until it reaches you safely.'
    }
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="py-24 px-[5%] bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary uppercase tracking-[4px] text-sm font-black mb-4"
          >
            What we offer
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[48px] lg:text-[64px] font-bold leading-tight tracking-tight mb-6"
          >
            Premium Services for <br className="hidden md:block" /> Your Spiritual Journey.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted font-semibold max-w-[700px] mx-auto"
          >
            From expert astrological guidance to custom jewelry crafting and Vedic energization, we offer end-to-end services to bring you the finest natural gemstones.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-[5%] max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-background border border-border rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <service.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{service.title}</h3>
              <p className="text-muted font-semibold mb-6 leading-relaxed">{service.sub}</p>
              <div className="h-px bg-border mb-6" />
              <p className="text-sm text-muted/80 font-medium leading-relaxed">{service.details}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-[5%]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-primary text-white p-12 lg:p-20 rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-[38px] lg:text-[48px] font-bold tracking-tight mb-6">Discover Your Perfect Gemstone</h2>
            <p className="text-white/70 font-semibold text-lg max-w-[600px] mx-auto mb-10">
              Book an astrological consultation with our experts to find the natural gemstone that aligns with your destiny.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-secondary text-dark px-10 h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-secondary/90 transition-all">Book Consultation</button>
              <button className="px-10 h-14 rounded-full border border-white/55 text-white text-[15px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">Shop Gemstones</button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ServicesPage;
