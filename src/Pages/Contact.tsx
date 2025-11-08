import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send, Clock, Award, MessageSquare, User, AtSign, Hash, FileText, CheckCircle, Star, Heart, Camera } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/footer';
import emailjs from 'emailjs-com';

interface VisibilityState {
  [key: string]: boolean;
}

interface FormData {
  [key: string]: string;
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  id: number;
  icon: string;
  title: string;
  info: string;
  link: string;
}

interface WhyChooseUs {
  id: number;
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge_text: string;
  badge_icon: string;
  media_type: 'video' | 'image';
  media_url: string ;
}

export default function ContactPage() {
  const [typewriterText, setTypewriterText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [reasons, setReasons] = useState<WhyChooseUs[]>([]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map backend icon names to Lucide icon components (not JSX)
  const iconComponents: { [key: string]: React.ComponentType<any> } = {
    Phone,
    Mail,
    MapPin,
    Clock,
    Award,
    Star,
    Heart,
    Camera,
    MessageSquare,
  };

  // Helper function to render icons with proper sizing
  const renderIcon = (iconName: string, size: string = "w-6 h-6") => {
    const IconComponent = iconComponents[iconName] || Star;
    return <IconComponent className={size} />;
  };

  // Fetch data for ContactInfo, WhyChooseUs, and HeroSection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactInfoRes = await fetch('https://backend-swart-seven-13.vercel.app/api/contact/info/');
        const reasonsRes = await fetch('https://backend-swart-seven-13.vercel.app/api/contact/reasons/');
        const heroRes = await fetch('https://backend-swart-seven-13.vercel.app/api/contact/hero/contact/');

        if (!contactInfoRes.ok || !reasonsRes.ok || !heroRes.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const contactInfoData = await contactInfoRes.json();
        const reasonsData = await reasonsRes.json();
        const heroData = await heroRes.json();

        console.log('Reasons Data:', reasonsData);
        const parsedReasons = Array.isArray(reasonsData) ? reasonsData : reasonsData.results || [];
        setReasons(parsedReasons);
        console.log('Reasons State:', parsedReasons);

        setContactInfo(Array.isArray(contactInfoData) ? contactInfoData : contactInfoData.results || []);
        setHero(Array.isArray(heroData) ? heroData[0] : heroData.results?.[0] || heroData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load dynamic content. Some sections may not display correctly.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Typewriter effect for hero subtitle
  useEffect(() => {
    if (hero && currentIndex < hero.subtitle.length) {
      const timeout = setTimeout(() => {
        setTypewriterText((prev) => prev + hero.subtitle[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, hero]);

  // IntersectionObserver for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setIsVisible((prev: VisibilityState) => {
              console.log('Visible:', target.id);
              return { ...prev, [target.id]: true };
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    console.log('Elements to observe:', elements.length);
    elements.forEach((el: Element) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [reasons, contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();

  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    setFormError("Please fill in all required fields.");
    return;
  }

  try {
    // 1️⃣ Send main email to you (admin)
    await emailjs.send(
      "service_62k6n0x",        // e.g., service_abc123
      "template_feji55x",       // your first template
      formData,
      "qU_ljJITgXTBKHwWp"
    );

    // 2️⃣ Send auto-reply to the user
    await emailjs.send(
      "service_62k6n0x",
      "template_hcg887f",     // your second template
      {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
  subject: formData.subject,
  message: formData.message
      },
      "qU_ljJITgXTBKHwWp"
    );

    console.log("Emails sent successfully!");
    setIsSubmitted(true);
    setFormError(null);
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
      subject: "",
      message: "",
    });

    setTimeout(() => setIsSubmitted(false), 3000);
  } catch (error) {
    console.error("Error sending email:", error);
    setFormError("Something went wrong. Please try again later.");
  }
};



  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      <Header />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.6); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .animate-slide-up { transform: translateY(8px); }
          .animate-fade-in { transform: translateY(4px); }
        }
      `,
        }}
      />

      {/* Hero Section with Background Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {loading || error ? (
          <div className="absolute inset-0 w-full h-full bg-gray-900" />    
        ) : hero?.media_type === 'video' && hero?.media_url ? (
          <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
            <source src={hero.media_url} type="video/mp4" />
          </video>
        ) : hero?.media_type === 'image' && hero?.media_url ? (
          <img src={hero.media_url} alt={hero.title} className="absolute top-0 left-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900" />
        )}

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/90" />

        <div className="absolute inset-0">
          {[...Array(15)].map((_: undefined, i: number) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-purple-500/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {hero?.badge_text && (
            <div className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm px-3 py-1.5 sm:px-6 sm:py-3 rounded-full border border-purple-500/30 mb-4 sm:mb-8 animate-fade-in">
              {hero.badge_icon && renderIcon(hero.badge_icon, "w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-spin-slow")}
              <span className="text-purple-300 text-xs sm:text-sm font-medium">{hero.badge_text}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold mb-3 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-slide-up">
            {hero?.title || 'Get in Touch'}
          </h1>

          <div className="h-12 sm:h-20 flex items-center justify-center">
            <p className="text-base sm:text-2xl md:text-3xl text-gray-300 font-light">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {hero?.description && (
            <p className="mt-3 sm:mt-6 text-sm sm:text-xl text-gray-400 max-w-md sm:max-w-2xl mx-auto animate-fade-in">
              {hero.description}
            </p>
          )}

          <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-4 h-6 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1 sm:p-2">
              <div className="w-0.5 h-1.5 sm:w-1 sm:h-3 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-6 sm:py-12 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-y border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-400">Loading contact information...</div>
          ) : error ? (
            <div className="text-center text-red-500">Error loading contact information</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-6">
              {contactInfo.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-black/30 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-103 sm:hover:scale-105 group"
                >
                  <div className="text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(item.icon, "w-4 h-4 sm:w-6 sm:h-6")}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm text-gray-400 mb-1">{item.title}</h3>
                    <p className="text-white font-semibold text-sm sm:text-base">{item.info}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map and Contact Form Section */}
      <section className="py-8 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12" data-animate id="contact-section">
            {/* Map */}
            <div className={`transition-all duration-800 ${isVisible['contact-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                  Visit Our <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Studio</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Drop by our studio in Islamabad or reach out online. We're always excited to meet new clients and discuss creative projects.
                </p>
              </div>

              <div
                className="rounded-lg sm:rounded-2xl overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-lg sm:shadow-2xl shadow-purple-500/20"
                id="map"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26565.10740840091!2d73.05255576450394!3d33.666529509507775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9544389abb3f%3A0x8ea6e9c4c6afe851!2sI-8%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1759717562615!5m2!1sen!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className={`transition-all duration-800 delay-200 ${isVisible['contact-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="mb-4 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                  Send Us a <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Message</span>
                </h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-6">
                {formError && (
                  <div className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-4 bg-red-600 rounded-full">
                    <span className="text-sm sm:text-lg font-semibold">{formError}</span>
                  </div>
                )}
                <div className="group">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-black/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    <AtSign className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-black/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-black/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-black/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Wedding Videography Inquiry"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-3 bg-black/50 border border-purple-500/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {isSubmitted ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full animate-pulse-glow">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-lg font-semibold">Message Sent Successfully!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-sm sm:text-lg hover:scale-103 sm:hover:scale-105 transition-all duration-300 shadow-md sm:shadow-lg shadow-purple-500/50 group cursor-pointer"
                  >
                    <Send className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-8 sm:py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16" data-animate id="reasons-title">
            <h2
              className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 transition-all duration-800 ${
                isVisible['reasons-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Why <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Choose Us</span>
            </h2>
            <p
              className={`text-sm sm:text-xl text-gray-400 max-w-xl sm:max-w-3xl mx-auto transition-all duration-800 delay-200 ${
                isVisible['reasons-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              We don't just capture moments, we create cinematic experiences that last forever
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400">Loading reasons...</div>
          ) : error ? (
            <div className="text-center text-red-500">Error loading reasons</div>
          ) : reasons.length === 0 ? (
            <div className="text-center text-gray-400">No reasons available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {reasons.map((reason, index: number) => {
                const IconComponent = iconComponents[reason.icon] || Star;
                return (
                  <div
                    key={reason.id}
                    data-animate
                    id={`reason-${index}`}
                    className={`text-center p-4 sm:p-8 rounded-lg sm:rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/50 transition-all duration-600 hover:scale-103 sm:hover:scale-105 ${
                      isVisible[`reason-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-3 sm:mb-6">
                      <div className="p-2 sm:p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-white">{reason.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-base">{reason.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 sm:mt-20 text-center" data-animate id="final-cta">
            <div className={`transition-all duration-800 ${isVisible['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-base sm:text-2xl text-gray-300 mb-4 sm:mb-8">
                Ready to start your project? Let's make it happen!
              </p>
              <a
                href="#contact-section"
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 sm:px-12 py-3 sm:py-6 rounded-full hover:scale-103 sm:hover:scale-105 transition-all duration-300 shadow-lg sm:shadow-2xl shadow-purple-500/50 cursor-pointer text-sm sm:text-xl font-semibold"
              >
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
                Book a Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}