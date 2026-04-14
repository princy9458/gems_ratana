"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Send,
  CheckCircle2,
  Gem,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { AnnotatorPlugin } from "../annotationPlugin/AnnotatorPlugin";
import GetAllPages from "../../lib/GetAllDetails/GetAllPages";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { gemsratnaUser } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {gemsratnaUser?.role === "admin" && <AnnotatorPlugin />}
      <GetAllPages />

      <main className="bg-[#FDFBF7] min-h-screen text-[#1A1A1A] py-20 px-6 md:px-12 lg:px-24 selection:bg-[#C5A059]/20 font-sans">
        
        {/* --- TOP SECTION --- */}
        <section className="max-w-4xl mx-auto text-center mb-24 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-heading mb-6 tracking-tight text-[#1A1A1A]">
              Contact Gems Ratna
            </h1>
            <p className="text-lg md:text-xl text-[#666] font-light italic tracking-wide">
              Speak with our team for gemstone guidance, custom jewellery requests, certification queries, and purchase support.
            </p>
            <div className="w-24 h-px bg-[#C5A059] mx-auto mt-8 opacity-40" />
          </motion.div>
        </section>

        {/* --- MAIN SECTION (Split Layout) --- */}
        <section className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* LEFT SIDE: Brand Information */}
            <motion.div 
              className="lg:col-span-5 space-y-16"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-8">Get In Touch</h3>
                <p className="text-base text-[#666] font-light leading-8 mb-10">
                  Whether you are searching for a Vedic recommendation, an engagement ring, a certified natural stone, or a gifting consultation, our Gems Ratna advisors are ready to help.
                </p>
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500">
                      <Mail size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Email Address</p>
                      <a href="mailto:info@gemsratna.com" className="text-xl font-light hover:text-[#C5A059] transition-colors duration-300">
                        info@gemsratna.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500">
                      <Phone size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Call Us</p>
                      <a href="tel:+919810159604" className="text-xl font-light hover:text-[#C5A059] transition-colors duration-300">
                        +91 98101 59604
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500">
                      <MapPin size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Studio & Assistance</p>
                      <p className="text-xl font-light text-[#1A1A1A]">
                        Online Consultation Available Across India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-8">What We Help With</h3>
                <div className="space-y-5">
                  {[
                    {
                      icon: Gem,
                      title: "Gem Recommendation",
                      text: "Personalized suggestions for ruby, panna, neelam, pukhraj, moti and other natural stones.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Certification & Authenticity",
                      text: "Guidance on lab certificates, origin, clarity, treatment disclosures, and stone quality.",
                    },
                    {
                      icon: Sparkles,
                      title: "Custom Orders & Ritual Guidance",
                      text: "Support for ring customization, gifting, energization rituals, and gemstone wearing advice.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-white/70 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
                          <item.icon size={18} strokeWidth={1.8} />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-[#1A1A1A] mb-2">{item.title}</h4>
                          <p className="text-sm leading-7 text-[#666] font-light">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-8">Working Hours</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex items-center justify-center text-[#C5A059]">
                      <Clock size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="mb-4">
                        <p className="text-base font-medium text-[#1A1A1A]">Gem Enquiry Support</p>
                        <p className="text-sm text-[#666] font-light">Available every day for online requests</p>
                      </div>
                      <div>
                        <p className="text-base font-medium text-[#1A1A1A]">Consultation Hours</p>
                        <p className="text-sm text-[#666] font-light">9:00 AM to 7:30 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-8">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, link: "#" },
                    { icon: Facebook, link: "#" },
                    { icon: Youtube, link: "#" }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.link} 
                      className="w-10 h-10 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]/60 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300"
                    >
                      <social.icon size={16} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: Contact Form */}
            <motion.div 
              className="lg:col-span-7 bg-white p-10 md:p-14 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-[#1A1A1A]/5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-heading mb-4">Message Sent</h3>
                  <p className="text-[#666] font-light mb-10 max-w-sm mx-auto">
                    Thank you for reaching out. Our Gems Ratna team will connect with you shortly with the right guidance.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold uppercase tracking-widest text-[#C5A059] border-b border-[#C5A059]/30 pb-1 hover:border-[#C5A059] transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] ml-1">Full Name *</label>
                      <input 
                        required 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 px-1 outline-none focus:border-[#C5A059] transition-all font-light text-lg placeholder:text-black/5" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] ml-1">Email Address *</label>
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 px-1 outline-none focus:border-[#C5A059] transition-all font-light text-lg placeholder:text-black/5" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 px-1 outline-none focus:border-[#C5A059] transition-all font-light text-lg placeholder:text-black/5" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] ml-1">Subject</label>
                      <input 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange}
                        placeholder="Gem recommendation, custom order, certification..."
                        className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 px-1 outline-none focus:border-[#C5A059] transition-all font-light text-lg placeholder:text-black/10" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] ml-1">Your Message</label>
                      <textarea 
                        required 
                        name="message" 
                      value={formData.message} 
                      onChange={handleChange}
                        rows={4} 
                        placeholder="Tell us which gemstone, budget, occasion, zodiac or requirement you want help with."
                        className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 px-1 outline-none focus:border-[#C5A059] transition-all font-light text-lg resize-none placeholder:text-black/5" 
                      />
                    </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-[#1A1A1A] text-white py-6 rounded-lg font-bold uppercase tracking-[0.3em] text-[10px] overflow-hidden relative group transition-all duration-500 hover:bg-[#C5A059] shadow-xl hover:shadow-[#C5A059]/20"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* --- BREATHING SPACE --- */}
        <div className="h-40" />
      </main>
    </>
  );
};

export default ContactPage;
