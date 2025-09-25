import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Code,
  ChevronDown,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Star,
} from "lucide-react";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const features = [
    { icon: Rocket, title: "AI-Powered Generation", description: "Generate personalized learning roadmaps tailored by cutting-edge AI." },
    { icon: Target, title: "Skill-Level Customization", description: "Adapted for beginners, intermediate learners, and advanced developers." },
    { icon: TrendingUp, title: "Progress Tracking", description: "Stay motivated with visual milestones and performance statistics." },
    { icon: Code, title: "Comprehensive Tech Stack", description: "Support for 50+ technologies including React, Python & AWS." },
    { icon: BookOpen, title: "Curated Resources", description: "Get structured learning material, docs, and projects." },
    { icon: Users, title: "Multiple Roadmaps", description: "Manage different paths and track progress seamlessly." },
  ];

  const faqs = [
    { q: "What is Roadmap Generator?", a: "It’s an AI-powered tool that creates structured learning paths tailored to your goals, skills, and experience." },
    { q: "Is it free to use?", a: "We offer a free plan with limited features. Premium plans unlock advanced AI customization and detailed analytics." },
    { q: "Can I track multiple roadmaps?", a: "Yes, you can generate and manage multiple learning roadmaps at once." },
    { q: "Do I need coding experience?", a: "No. Roadmap Generator adapts to your level, from beginner to advanced developer." },
  ];

  const testimonials = [
    { name: "Alex Johnson", role: "Frontend Developer", feedback: "The AI roadmap helped me structure my React learning. I landed my first dev job thanks to it!", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Maria Gomez", role: "Full Stack Engineer", feedback: "I used it to transition from PHP to modern stacks like Node.js and Docker. Super useful tool!", avatar: "https://i.pravatar.cc/100?img=2" },
    { name: "David Kim", role: "Student", feedback: "As a beginner, I was overwhelmed. This roadmap broke things down step by step for me.", avatar: "https://i.pravatar.cc/100?img=3" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold">Roadmap Generator</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {["Features", "Preview", "Pricing", "FAQ", "Testimonials"].map((section) => (
              <a key={section} href={`#${section.toLowerCase()}`} className="hover:text-blue-600 transition-colors">{section}</a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => openAuthModal("login")} className="text-slate-600 hover:text-slate-900 transition">Sign In</button>
            <button onClick={() => openAuthModal("register")} className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold hover:opacity-90 transition">Get Started</button>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Fullscreen Nav */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-6 text-lg font-medium z-40">
            {["Features", "Preview", "Pricing", "FAQ", "Testimonials"].map((section) => (
              <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600">{section}</a>
            ))}
            <button onClick={() => openAuthModal("login")} className="px-6 py-3 border rounded-full text-slate-700">Sign In</button>
            <button onClick={() => openAuthModal("register")} className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white">Get Started</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-[13rem] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Text Left */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Build Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
                AI Roadmaps
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-slate-600 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Structured learning paths, progress tracking, and curated resources — everything you need to grow as a developer.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => openAuthModal("register")}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold text-lg shadow-lg hover:opacity-90"
              >
                Generate Your Roadmap
              </button>
            </motion.div>
                
          </div>

          {/* Hero Mockup Right */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <img src="/progress.png" alt="App Preview" className="w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>


      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Roadmap Generator?</h2>
            <p className="text-slate-600 text-lg">Everything you need to build, track, and achieve your learning goals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-slate-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Application Preview</h2>
            <p className="text-slate-300 text-lg">Get a glimpse of our clean and intuitive UI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <motion.div className="md:col-span-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <img src="/progress3.png" alt="Preview 1" className="rounded-2xl shadow-lg w-full object-cover" />
            </motion.div>

            <motion.div className="md:col-span-2 flex flex-col gap-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <img src="/progress4.png" alt="Preview 2" className="rounded-2xl shadow-lg w-full object-cover" />
              <img src="/progress2.png" alt="Preview 3" className="rounded-2xl shadow-lg w-full object-cover" />
            </motion.div>

            <motion.div className="md:col-span-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <img src="/progress.png" alt="Preview 4" className="rounded-2xl shadow-lg w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg">Answers to the most common questions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium hover:bg-slate-100 transition">
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 transform transition-transform ${openFAQ === i ? "rotate-180" : ""}`} />
                </button>
                {openFAQ === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-6 pb-4 text-slate-600">
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Developers Are Saying</h2>
          <p className="text-slate-600 text-lg mb-12">Join thousands of learners building their careers with Roadmap Generator.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex justify-center mb-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full" />
                </div>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-slate-500 text-sm">{t.role}</p>
                <div className="flex justify-center text-yellow-400 my-2">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 mt-4">{t.feedback}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning Smarter?</h2>
        <p className="mb-8 text-lg text-white/90">Join thousands of developers already growing with Roadmap Generator.</p>
        <button onClick={() => openAuthModal("register")} className="px-10 py-4 rounded-full bg-white text-blue-600 font-semibold text-lg shadow-lg hover:bg-slate-100">Get Started for Free</button>
      </section>

      {/* FOOTER */}
      <footer className="py-14 bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Roadmap Generator</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering learners and developers to create personalized, AI-powered roadmaps for growth and success.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Home", "Features", "Pricing", "FAQ"].map(link => (
                <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              {["Blog", "Guides", "Documentation", "Community"].map(link => (
                <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm text-slate-400 mb-2">Have questions? We’d love to hear from you.</p>
            <p className="text-sm">📧 <a href="mailto:support@roadmapgen.com" className="hover:text-white">support@roadmapgen.com</a></p>
            <p className="text-sm">📍 Bangalore, India</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Roadmap Generator. Built with ❤️ by your team.<br /> All rights reserved.
        </div>
      </footer>


      {/* AUTH MODAL */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </div>
  );
};

export default LandingPage;