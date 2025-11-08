import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Award,
  Users,
  Heart,
  Star,
  TrendingUp,
  CheckCircle,
  Home,
  User,
  Palette,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/footer';

// API Base URL - Change this to your backend URL
const API_BASE_URL = 'https://backend-swart-seven-13.vercel.app/api';

interface ServiceFeature {
  id: number;
  feature_text: string;
  order: number;
}

interface Service {
  id: number;
  title: string;
  icon: string;
  video_url: string;
  description: string;
  features: ServiceFeature[];
  is_active: boolean;
  order: number;
}

interface ProcessStep {
  id: number;
  step_number: string;
  title: string;
  description: string;
  order: number;
}

interface EquipmentItem {
  id: number;
  item_name: string;
  order: number;
}

interface EquipmentCategory {
  id: number;
  name: string;
  items: EquipmentItem[];
  order: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface Stats {
  projects_completed: number;
  happy_clients: number;
  industry_awards: number;
  client_satisfaction: number;
}

export default function ServicesPage() {
  const [typewriterText, setTypewriterText] = useState<string>('');
  const fullText = 'Elevating Your Vision Through Professional Cinematography';
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // API Data States
  const [services, setServices] = useState<Service[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [equipment, setEquipment] = useState<EquipmentCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats>({
    projects_completed: 0,
    happy_clients: 0,
    industry_awards: 0,
    client_satisfaction: 0,
  });
  const [animatedStats, setAnimatedStats] = useState<Stats>({
    projects_completed: 0,
    happy_clients: 0,
    industry_awards: 0,
    client_satisfaction: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, processRes, equipmentRes, testimonialsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/services/`),
          fetch(`${API_BASE_URL}/process-steps/`),
          fetch(`${API_BASE_URL}/equipment/`),
          fetch(`${API_BASE_URL}/testimonials/`),
          fetch(`${API_BASE_URL}/stats/`),
        ]);

        if (!servicesRes.ok || !processRes.ok || !equipmentRes.ok || !testimonialsRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const processData = await processRes.json();
        const equipmentData = await equipmentRes.json();
        const testimonialsData = await testimonialsRes.json();
        const statsData = await statsRes.json();

        setServices(Array.isArray(servicesData) ? servicesData : servicesData.results || []);
        setProcessSteps(Array.isArray(processData) ? processData : processData.results || []);
        setEquipment(Array.isArray(equipmentData) ? equipmentData : equipmentData.results || []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : testimonialsData.results || []);

        setStats({
          projects_completed: statsData.projects_completed,
          happy_clients: statsData.happy_clients,
          industry_awards: statsData.industry_awards,
          client_satisfaction: statsData.client_satisfaction,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping
  const getIcon = (iconName: string): React.ReactElement => {
    const iconMap: { [key: string]: React.ReactElement } = {
      Heart: <Heart className="w-10 h-10 sm:w-12 sm:h-12" />,
      Home: <Home className="w-10 h-10 sm:w-12 sm:h-12" />,
      User: <User className="w-10 h-10 sm:w-12 sm:h-12" />,
      Palette: <Palette className="w-10 h-10 sm:w-12 sm:h-12" />,
      Camera: <Camera className="w-10 h-10 sm:w-12 sm:h-12" />,
    };
    return iconMap[iconName] || <Camera className="w-10 h-10 sm:w-12 sm:h-12" />;
  };
  
  // Typewriter Effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypewriterText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  // Animated Stats Counter
  const handleStatsAnimation = () => {
    if (!statsAnimated && stats.projects_completed > 0) {
      setStatsAnimated(true);
      let start = 0;
      const duration = 2000;
      const increment = 20;

      const counter = setInterval(() => {
        start += increment;
        setAnimatedStats({
          projects_completed: Math.min(
            Math.floor((stats.projects_completed * start) / duration),
            stats.projects_completed
          ),
          happy_clients: Math.min(
            Math.floor((stats.happy_clients * start) / duration),
            stats.happy_clients
          ),
          industry_awards: Math.min(
            Math.floor((stats.industry_awards * start) / duration),
            stats.industry_awards
          ),
          client_satisfaction: Math.min(
            Math.floor((stats.client_satisfaction * start) / duration),
            stats.client_satisfaction
          ),
        });
        if (start >= duration) clearInterval(counter);
      }, increment);
    }
  };

  const statsDisplay = [
    {
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      number: animatedStats.projects_completed + '+',
      label: 'Projects Completed',
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      number: animatedStats.happy_clients + '+',
      label: 'Happy Clients',
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
      number: animatedStats.industry_awards + '+',
      label: 'Industry Awards',
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
      number: animatedStats.client_satisfaction + '%',
      label: 'Client Satisfaction',
    },
  ];

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/Service2.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/90" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-purple-500/30 mb-6 sm:mb-8"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-purple-300 text-xs sm:text-sm font-medium">
              Award-Winning Services
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            Our Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-2xl md:text-3xl text-gray-300 font-light"
          >
            {typewriterText}
            <span className="animate-pulse">|</span>
          </motion.p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              What We{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Offer
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-black rounded-xl border border-purple-500/20 overflow-hidden"
              >
                {/* Auto-playing Video */}
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-80"
                  >
                    <source src={service.video_url} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                </div>

                <div className="relative p-6 sm:p-8 z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="text-purple-400 mb-4 sm:mb-6"
                  >
                    {getIcon(service.icon)}
                  </motion.div>
                  
                  <h3 className="text-1xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                        <span className="text-xs sm:text-sm text-gray-400">
                          {feature.feature_text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Process
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl sm:text-3xl font-bold relative"
                >
                  {item.step_number}
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-12 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-950/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Professional{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Equipment
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
            {equipment.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
                <ul className="space-y-1 sm:space-y-2">
                  {category.items.map((item, idx) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"
                    >
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-500" />
                      {item.item_name}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Client{' '}
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-purple-500/20"
              >
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 italic text-sm sm:text-base">
                  "{testimonial.text}"
                </p>
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-purple-400 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-12 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-950/30">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={handleStatsAnimation}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-16"
          >
            Excellence in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Numbers
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8">
            {statsDisplay.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, y: -4, transition: { duration: 0.3 } }}
                className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20"
              >
                <div className="text-purple-400 flex justify-center mb-3 sm:mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-purple-500/30 mb-6 sm:mb-8"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className="text-purple-300 text-xs sm:text-sm font-medium">
              Ready to Get Started?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            Let's Create Something
            <br />
            Extraordinary Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
          >
            Transform your vision into stunning visual stories. Our award-winning team is ready to
            bring your project to life with cinematic excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          >
            <motion.a
              href="/Contact"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              className="group relative px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-base sm:text-lg overflow-hidden shadow-md sm:shadow-lg shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Start Your Project
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>

            <motion.a
              href="/Contact"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              className="px-6 sm:px-10 py-3 sm:py-5 border-2 border-purple-500/50 rounded-full font-bold text-base sm:text-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
            >
              Schedule a Consultation
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Support Available</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                Fast
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Turnaround Time</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                100%
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Satisfaction Rate</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                Free
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Initial Consultation</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}