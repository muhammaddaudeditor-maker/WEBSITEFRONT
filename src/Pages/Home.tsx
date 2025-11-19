import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Phone, AtSign, User, Hash, FileText, Send, CheckCircle, Download
} from 'lucide-react';
import emailjs from 'emailjs-com';
import Header from '../Components/Header';
import Footer from '../Components/footer';
import {
  Play, Award, Calendar, Users, MapPin, ArrowUpRight, HelpCircle,
  PenTool, Palette, Music, MessageCircle, Edit3, Cpu, Camera, Laptop,
  Workflow, Wifi, Sparkles, Heart, Building2, Film, Eye, X, Lightbulb, Target, Zap
} from 'lucide-react';

// === INTERFACES ===
interface Hero {
  id?: number;
  title: string;
  typewriter_phrases: string | string[];
  subtitle: string;
  video: string;
  video_url?: string;
  primary_button_text: string;
  secondary_button_text: string;
  is_active: boolean;
}

interface Stat {
  id?: number;
  name: string;
  value: string;
  suffix: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface Intro {
  id?: number;
  title: string;
  subtitle: string;
  image: string;
  image_url?: string;
  achievements: string | string[] | null;
  primary_button_text: string;
  secondary_button_text: string;
  is_active: boolean;
}
interface CoreValue {
  id: number;
  title: string;
  description: string;
}
interface Skill {
  id?: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface Tool {
  id?: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
}

interface CTA {
  id?: number;
  title: string;
  description: string;
  button_text: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface TabContent {
  id: number;
  tab_name: string;
  title: string;
  content: string;
  image?: string;
  image_url?: string;
}

interface Project {
  id: number;
  title: string;
  category: number;
  thumbnail: string;
  video: string;
  description: string;
  views: string;
  likes: string;
  video_url?: string;
  thumbnail_url?: string;
}

interface Counts {
  yearsExp: number;
  happyClients: number;
  awardsWon: number;
  citiesCov: number;
}

interface FormData {
  [key: string]: string;
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
}

interface CVData {
  cv_file: string;
  cv_file_url?: string;
  cv_url?: string;
}

// UPDATED BASE URL
const BASE_URL = 'https://api.daudportfolio.cloud';

// Dynamic endpoint – local in dev, prod in build
const CV_ENDPOINT = import.meta.env.DEV
  ? 'http://127.0.0.1:8000/api/cv/active/'
  : `${BASE_URL}/api/cv/active/`;

  // Dynamic Logos endpoint – local in dev, prod in build
const LOGOS_ENDPOINT = import.meta.env.DEV
  ? 'http://127.0.0.1:8000/home/logos/'
  : `${BASE_URL}/home/logos/`;
// === HELPERS ===
const extractData = <T,>(response: any): T[] => {
  if (response && response.results && Array.isArray(response.results)) {
    return response.results;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const parseStatValue = (value: string): number => {
  const match = value.match(/^(\d+)([MK]?)$/);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const suffix = match[2];
  if (suffix === 'M') return num * 1_000_000;
  if (suffix === 'K') return num * 1_000;
  return num;
};

// === MAIN COMPONENT ===
const Home = () => {
  // === STATES ===
  const [stats, setStats] = useState<Stat[]>([]);
  const [intro, setIntro] = useState<Intro | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [cta, setCta] = useState<CTA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setCounts] = useState<Counts>({
    yearsExp: 0,
    happyClients: 0,
    awardsWon: 0,
    citiesCov: 0,
  });
  const statsRef = useRef<HTMLDivElement>(null);
  const [phrases, setPhrases] = useState<string[]>(['Cinematic Excellence']);
  const [tabContent, setTabContent] = useState<TabContent[]>([]);
  const [activeTab, setActiveTab] = useState<string>("story");
  const [projects, setProjects] = useState<Project[]>([]);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);

  // === CV STATE ===
  const [, setCvData] = useState<CVData | null>(null);
  const [cvLoading, setCvLoading] = useState(false);

  const [logos, setLogos] = useState<Array<{
  id: number;
  title: string;
  logo_url: string;
  website_url: string | null;
}>>([]);

  // === FETCH CV ===
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(CV_ENDPOINT);
        if (response.ok) {
          const data = await response.json();
          setCvData(data.length > 0 ? data[0] : null);
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };
    fetchCV();
  }, []);

  // === HANDLE VIEW CV ===
  const handleViewCV = async () => {
    setCvLoading(true);
    try {
      const response = await fetch(CV_ENDPOINT);
      if (response.ok) {
        const data = await response.json();
        const cv = Array.isArray(data) && data.length > 0 ? data[0] : data;
        if (cv?.cv_url) {
          window.open(cv.cv_url, '_blank', 'noopener,noreferrer');
        } else {
          alert('CV URL not found.');
        }
      } else {
        alert('Failed to load CV. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching CV on click:", error);
      alert('Network error. Please check your connection.');
    } finally {
      setCvLoading(false);
    }
  };

  // === FORM STATES ===
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // === FORM HANDLERS ===
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError('Please fill in all required fields.');
      return;
    }
    const templateParams = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      subject: formData.subject,
      message: formData.message,
    };
    try {
      console.log('Sending email with params:', templateParams);
     
      const response = await emailjs.send(
        'service_t0pawjh',
        'template_05v1iyi',
        templateParams,
        'Cw8opDgdlvyc27n2Q'
      );
     
      console.log('Email sent successfully:', response);
      setIsSubmitted(true);
      setFormError(null);
      setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      setFormError(`Failed to send message: ${err?.text || err?.message || 'Unknown error'}`);
    }
  };

  // === SCROLL TO CONTACT FORM ===
  useLayoutEffect(() => {
    const scrollToContact = () => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (window.location.hash === '#contact') {
      const timer = setTimeout(scrollToContact, 300);
      return () => clearTimeout(timer);
    }
    const handleHashChange = () => {
      if (window.location.hash === '#contact') scrollToContact();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // === DATA FETCHING ===
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        heroRes,
        statsRes,
        introRes,
        skillsRes,
        toolsRes,
        faqsRes,
        ctaRes,
        tabsRes,
        projectsRes,
        coreValuesRes,
        logosRes  // ← NEW: Fetch logos
      ] = await Promise.all([
        axios.get(`${BASE_URL}/home/hero/`).catch(() => ({ data: null })),
        axios.get(`${BASE_URL}/home/stats/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/home/intro/`).catch(() => ({ data: null })),
        axios.get(`${BASE_URL}/home/skills/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/home/tools/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/home/faqs/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/home/cta/`).catch(() => ({ data: null })),
        axios.get(`${BASE_URL}/about/tab-content/`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/api/portfolio/projects/`).catch(() => ({ data: { results: [] } })),
        axios.get(`${BASE_URL}/about/core-values/`).catch(() => ({ data: [] })),
        axios.get(LOGOS_ENDPOINT).catch(() => ({ data: [] }))      ]);

        // ---- HERO ----
        const heroData = extractData<Hero>(heroRes.data);
        const heroItem = heroData[0];
        if (heroItem?.typewriter_phrases) {
          const phrasesData = Array.isArray(heroItem.typewriter_phrases)
            ? heroItem.typewriter_phrases
            : typeof heroItem.typewriter_phrases === 'string'
              ? heroItem.typewriter_phrases.split(',').map(p => p.trim())
              : ['Cinematic Excellence'];
          setPhrases(phrasesData);
        }

        setStats(extractData<Stat>(statsRes.data).filter(s => s.is_active));
      setIntro(extractData<Intro>(introRes.data)[0] || null);
      setSkills(extractData<Skill>(skillsRes.data).filter(s => s.is_active));
      setTools(extractData<Tool>(toolsRes.data).filter(t => t.is_active));
      setFaqs(extractData<FAQ>(faqsRes.data).filter(f => f.is_active));
      setCta(extractData<CTA>(ctaRes.data)[0] || null);
      setTabContent(extractData<TabContent>(tabsRes.data));
      setCoreValues(extractData<CoreValue>(coreValuesRes.data));
      setLogos(extractData<any>(logosRes.data));

        // ---- PROJECTS ----
        const projectList = extractData<Project>(projectsRes.data);
        setProjects(projectList);

        setLoading(false);
      } catch (err: any) {
        setError(`Failed to load data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === TYPEWRITER EFFECT ===
  useEffect(() => {
    if (phrases.length === 0) return;
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 150;
    const timer = setTimeout(() => {
      if (!isDeleting && typewriterText.length < currentPhrase.length) {
        setTypewriterText(currentPhrase.substring(0, typewriterText.length + 1));
      } else if (isDeleting && typewriterText.length > 0) {
        setTypewriterText(currentPhrase.substring(0, typewriterText.length - 1));
      } else if (!isDeleting) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, currentPhraseIndex, phrases]);

  // === STATS ANIMATION ===
  useEffect(() => {
    if (stats.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const targetCounts: Counts = {
            yearsExp: parseStatValue(stats.find(s => s.name.toLowerCase().includes('years'))?.value || '8'),
            happyClients: parseStatValue(stats.find(s => s.name.toLowerCase().includes('clients'))?.value || '200'),
            awardsWon: parseStatValue(stats.find(s => s.name.toLowerCase().includes('awards'))?.value || '15'),
            citiesCov: parseStatValue(stats.find(s => s.name.toLowerCase().includes('cities'))?.value || '25'),
          };
          const duration = 1000;
          const startTime = Date.now();
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCounts({
              yearsExp: Math.floor(targetCounts.yearsExp * progress),
              happyClients: Math.floor(targetCounts.happyClients * progress),
              awardsWon: Math.floor(targetCounts.awardsWon * progress),
              citiesCov: Math.floor(targetCounts.citiesCov * progress),
            });
            if (progress >= 1) clearInterval(interval);
          }, 50);
          if (statsRef.current) observer.unobserve(statsRef.current);
        }
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [stats]);

  // === SLIDE-IN ANIMATIONS ===
  useEffect(() => {
    const sections = document.querySelectorAll('.intro-section, .faq-section, .skills-section, .tools-section, .cta-section');
    sections.forEach(section => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.slide-in-left').forEach(el => el.classList.add('animate-slideInLeft'));
            entry.target.querySelectorAll('.slide-in-right').forEach(el => el.classList.add('animate-slideInRight'));
            observer.unobserve(section);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(section);
    });
  }, [intro, faqs, skills, tools, cta]);

  // === OTHER STATES ===
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // === ICON MAP ===
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Calendar, Users, Award, MapPin, PenTool, Palette, Music, MessageCircle,
    Edit3, Cpu, Play, Camera, Laptop, Workflow, Wifi, Sparkles, Heart, Building2, Film
  };

  const getTab = (tabName: string) => tabContent.find(t => t.tab_name === tabName);

  // === RENDER ===
  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h2>
        <p className="text-gray-400">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* === INTRO SECTION === */}
      {intro && (
        <section className="intro-section py-0 px-0 bg-gray-900 overflow-visible -mt-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto w-full bg-gray-900 rounded-3xl shadow-2xl"
          >
            <div className="flex flex-col md:flex-row gap-0">
              {/* Left: Image + Stats */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
                className="md:w-1/2 pl-1 sm:pl-8 md:pl-32 pr-0 pt-0 pb-4 flex flex-col items-center"
              >
                <motion.img
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                  src={intro.image_url || intro.image}
                  alt="Videographer"
                  className="w-fw-full max-w-[70%] sm:max-w-[85%] md:max-w-[90%] h-auto aspect-[3/4] object-cover border-2 sm:border-4 border-gray-700 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(147,112,219,0.8)] mx-auto -mt-4 sm:-mt-6 md:-mt-8"
                />
                {stats.length > 0 ? (
                  <div ref={statsRef} className="grid grid-cols-2 gap-3 sm:gap-6 pt-8 sm:pt-6">
                    {stats.map((stat, index) => {
                      const Icon = iconMap[stat.icon] || Calendar;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-br from-gray-800 to-gray-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl max-w-xs min-h-24 sm:min-h-32 text-center flex flex-col items-center justify-center shadow-lg"
                        >
                          <Icon className="text-purple-500" size={18} />
                          <p className="text-lg sm:text-xl md:text-2xl font-bold px-2">
                            {stat.value}{stat.suffix}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 px-2">{stat.name}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 pt-6">No stats available.</div>
                )}
              </motion.div>

              {/* Right: Tabs + Content */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 py-4 sm:py-6 md:py-4 flex flex-col items-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="mb-6 sm:mb-8 flex flex-row gap-3 sm:gap-4"
                >
                  {["story", "philosophy", "process"].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  ))}
                </motion.div>

                <div className="max-w-[550px] text-center">
                  <AnimatePresence mode="wait">
                    {getTab(activeTab) && (
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                        className="space-y-4"
                      >
                        <motion.h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold pt-0 sm:pt-4 mb-3 sm:mb-4 text-white leading-tight">
                          {getTab(activeTab)?.title || "No Title"}
                        </motion.h1>
                        <motion.div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 rounded-full mb-4 sm:mb-6 mx-auto"></motion.div>

                        {getTab(activeTab)?.content?.split("\n").filter(p => p.trim()).map((para, i) => (
                          <motion.p key={i} className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4">
                            {para}
                          </motion.p>
                        ))}

                        {intro.achievements && (
                          <>
                            <motion.div className="flex items-center justify-center mb-4 sm:mb-6">
                              <ArrowUpRight className="text-purple-500 mr-2" size={16} />
                              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-purple-400">Recent Achievements</h2>
                            </motion.div>
                            <ul className="space-y-1.5 sm:space-y-2 inline-block text-left">
                              {(Array.isArray(intro.achievements) ? intro.achievements : intro.achievements?.split(',') || [])
                                .map((a, i) => (
                                  <motion.li key={i} className="flex items-center text-gray-300 text-xs sm:text-sm md:text-base">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mr-2 sm:mr-3"></div>
                                    {a.trim()}
                                  </motion.li>
                                ))}
                            </ul>
                          </>
                        )}

                        <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pb-2 sm:pb-4 mt-4 sm:mt-8">
{/* View My Portfolio Button */}
  <button
    onClick={() => window.location.href = "/portfolio"}
    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 w-fit mx-auto sm:mx-0"
  >
    <Film size={16} />
    View My Portfolio
  </button>

                          {/* CV BUTTON: Fresh API call + open in new tab */}
                          <button
  onClick={handleViewCV}
  disabled={cvLoading}
  className={`flex items-center justify-center gap-2 
    bg-purple-600 hover:bg-purple-700 text-white 
    px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base 
    transition-all duration-300 
    shadow-lg hover:shadow-purple-500/40 
    w-fit mx-auto sm:mx-0
    ${cvLoading ? 'opacity-70 cursor-not-allowed hover:bg-purple-600' : 'cursor-pointer'}`}
>
  {cvLoading ? (
    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
  ) : (
    <Download size={16} />
  )}
  {intro.secondary_button_text || "Download CV"}
</button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      )}

      {/* === LOGO CAROUSEL – PERFECTLY SMOOTH INFINITE LOOP === */}
<section className="py-16 sm:py-20 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 sm:mb-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
      >
        Trusted By{" "}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Leading Brands
        </span>
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="w-16 sm:w-20 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
      />
    </div>

    {logos.length > 0 ? (
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>

        {/* Infinite Marquee Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [0, -100 + "%"] }}  // This is the magic
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,        // Adjust speed here (lower = faster)
                ease: "linear",
              },
            }}
          >
            {/* First set */}
            {logos.map((logo) => (
              <motion.a
                key={`first-${logo.id}`}
                href={logo.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -10 }}
                className="flex-shrink-0 mx-8"  // Consistent spacing
              >
                <div className="relative group">
                  <div className="w-36 sm:w-44 md:w-52 h-20 sm:h-24 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden p-6 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-500 hover:shadow-purple-500/30">
                    <img
                      src={logo.logo_url}
                      alt={logo.title}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.3))' }}
                    />
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-purple-500/30 shadow-xl">
                    {logo.title}
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Second set – for seamless loop */}
            {logos.map((logo) => (
              <motion.a
                key={`second-${logo.id}`}
                href={logo.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -10 }}
                className="flex-shrink-0 mx-8"
              >
                <div className="relative group">
                  <div className="w-36 sm:w-44 md:w-52 h-20 sm:h-24 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden p-6 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-500 hover:shadow-purple-500/30">
                    <img
                      src={logo.logo_url}
                      alt={logo.title}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.3))' }}
                    />
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-purple-500/30 shadow-xl">
                    {logo.title}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    ) : (
      <p className="text-center text-gray-500 italic">No client logos added yet.</p>
    )}

    <div className="text-center mt-8 sm:mt-10">
      <p className="text-gray-400 text-sm sm:text-base">
        Collaborating with industry leaders to create exceptional visual experiences
      </p>
    </div>
  </div>
</section>

            {/* === CORE VALUES SECTION === */}
      {coreValues.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-[#1A0D2A]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              >
                My Core{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Values
                </span>
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {coreValues.map((value, i) => {
                const icons = [Heart, Film, Lightbulb, Users, Sparkles, Target, Zap];
                const Icon = icons[i % icons.length] || Heart;

                return (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: i * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    className="group relative bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 text-center hover:border-purple-500/80 transition-all duration-400 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* === PROJECTS SECTION === */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <motion.h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-white">
             The Niches That{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Define My Portfolio
              </span>
            </motion.h2>
            <motion.div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {projects.slice(0, 3).map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => (window.location.href = "/portfolio")}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  <motion.img
                    src={p.thumbnail_url || p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Play size={18} className="fill-white ml-0.5" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Eye size={14} /> <span>{p.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/portfolio")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
            >
              View More Projects
            </motion.button>
          </div>
        </div>
      </section>

      {/* === VIDEO MODAL === */}
      {videoPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          <motion.button
            onClick={() => setVideoPopup(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
          >
            <X size={24} />
          </motion.button>
          <video src={videoPopup} controls autoPlay className="max-w-5xl w-full rounded-lg shadow-2xl aspect-video" />
        </motion.div>
      )}

      {/* === PROCESS & TOOLS === */}
      <section className="relative py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Process &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
                Tools
              </span>
            </motion.h2>
          </div>

          <div className="flex items-center justify-center">
            {tools.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 w-full max-w-5xl justify-items-center">
                {tools.map((tool, i) => {
                  const Icon = iconMap[tool.icon] || Laptop;
                  return (
                    <div
                      key={i}
                      className="w-full sm:w-[90%] md:w-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition text-left"
                    >
                      <Icon size={32} className="text-purple-400 mb-3" />
                      <h4 className="text-base sm:text-lg font-semibold text-white">
                        {tool.title}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {tool.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS – FIXED & NO MORE WHITE SCREEN === */}
      <TestimonialsSection />

      {/* === FAQ === */}
      {faqs.length > 0 && (
        <section className="faq-section pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1A0D2A]">
          <div className="max-w-7xl mx-auto">
            <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white text-center">
              Frequently Asked<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </motion.h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 max-w-[50rem] mx-auto">
  {faqs.map((faq, i) => (
    <div
      key={i}
      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
      className="w-full bg-gradient-to-br from-gray-800 to-gray-950 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:border hover:border-purple-500 transition-all cursor-pointer"
    >
      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white flex items-start gap-2 sm:gap-3">
        <HelpCircle className="text-purple-400 flex-shrink-0 mt-1" size={20} />
        <span className="flex-1 leading-tight">{faq.question}</span>
        <ArrowUpRight
          size={16}
          className={`text-purple-400 flex-shrink-0 mt-1 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}
        />
      </h3>
      <p className={`text-gray-300 text-xs sm:text-sm md:text-base mt-4 overflow-hidden transition-all duration-500 ${openFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        {faq.answer}
      </p>
    </div>
  ))}
</div>
          </div>
        </section>
      )}

      {/* === CTA + CONTACT FORM === */}
      <section ref={contactFormRef} id="contact" className="py-12 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Map */}
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                Visit Our <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Studio</span>
              </h2>
              <p className="text-gray-400 mb-6">Drop by our studio in Islamabad or reach out online.</p>
              <div className="rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26565.10740840091!2d73.05255576450394!3d33.666529509507775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9544389abb3f%3A0x8ea6e9c4c6afe851!2sI-8%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1759717562615!5m2!1sen!2s"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                Send Us a <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Message</span>
              </h2>
              <p className="text-gray-400 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-full text-sm font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                    <User className="w-4 h-4 text-purple-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                    <AtSign className="w-4 h-4 text-purple-400" /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                    <Phone className="w-4 h-4 text-purple-400" /> WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                    <Hash className="w-4 h-4 text-purple-400" /> Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Wedding Videography Inquiry"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                    <FileText className="w-4 h-4 text-purple-400" /> Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>

                {isSubmitted ? (
                  <div className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-pulse">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Message Sent Successfully!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

// ──────────────────────────────────────────────────────────────
// TESTIMONIALS SECTION – Extracted to fix Hook Rules violation
// ──────────────────────────────────────────────────────────────
const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(
      import.meta.env.DEV
        ? 'http://127.0.0.1:8000/home/testimonials/'
        : 'https://api.daudportfolio.cloud/home/testimonials/'
    )
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.results || [];
        setTestimonials(
          items.map((t: any) => ({
            ...t,
            color: t.gradient_color?.trim() || 'from-purple-500 to-pink-500',
          }))
        );
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];
  const next = () => setCurrentIndex(i => (i + 1) % testimonials.length);
  const prev = () => setCurrentIndex(i => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Client <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Testimonials</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Compact Card */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-gray-700 shadow-2xl relative overflow-hidden"
          >
            {/* Quote Icon - Smaller */}
            <Quote className="w-12 h-12 absolute -top-5 -left-3 text-purple-500/30" />

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            {/* Text - Reduced size */}
            <p className="text-lg md:text-xl italic text-gray-100 text-center leading-relaxed mb-8">
              "{current.text}"
            </p>

            {/* Client Info */}
            <div className="flex items-center justify-center gap-4">
              {current.avatar_url ? (
                <img src={current.avatar_url} alt={current.name} className="w-14 h-14 rounded-full ring-4 ring-purple-500/30" />
              ) : (
                <div className={`w-14 h-14 bg-gradient-to-r ${current.color} rounded-full flex items-center justify-center text-xl font-bold text-white`}>
                  {current.name[0]}
                </div>
              )}
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{current.name}</h4>
                <p className="text-purple-400 text-sm">{current.company}</p>
              </div>
            </div>

            {/* Gradient bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${current.color} rounded-b-2xl`} />
          </motion.div>

          {/* Compact Navigation */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button onClick={prev} className="p-2.5 bg-gray-800/70 hover:bg-purple-600 rounded-full transition">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button onClick={next} className="p-2.5 bg-gray-800/70 hover:bg-purple-600 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};