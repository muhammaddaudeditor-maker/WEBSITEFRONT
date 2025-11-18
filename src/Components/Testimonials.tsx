// src/Components/Testimonials.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  avatar_url: string | null;
  gradient_color: string;
}

const API_URL = 'http://127.0.0.1:8000/api/testimonials/';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<(Testimonial & { color: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any) => {
        const items = Array.isArray(data) ? data : data?.results || [];
        const formatted = items.map((item: any) => ({
          ...item,
          color:
            typeof item?.gradient_color === 'string' && item.gradient_color.trim()
              ? item.gradient_color.trim()
              : 'from-purple-500 to-pink-500',
        }));
        setTestimonials(formatted);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.warn('Testimonials API failed → hiding section gracefully', err);
          setTestimonials([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  const next = () => setCurrentIndex(i => (i + 1) % testimonials.length);
  const prev = () => setCurrentIndex(i => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-purple relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 px-4 py-2 rounded-full mb-6">
            <Star className="text-purple-400" size={16} fill="currentColor" />
            <span className="text-purple-300 text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            What Clients<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Say
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 rounded-full mx-auto my-6" />
        </div>

        {/* Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-700/50 shadow-2xl hover:border-purple-500/50 transition-all group">
            {/* Quote Icon – FIXED */}
            <div className="absolute -top-6 left-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${current.color} rounded-2xl flex items-center justify-center shadow-lg -rotate-6 group-hover:rotate-0 transition-transform`}>
                <Quote className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6 justify-center md:justify-start pt-4">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            {/* Text */}
            <p className="text-gray-200 text-lg md:text-2xl leading-relaxed italic text-center md:text-left mb-8">
              "{current.text}"
            </p>

            {/* Avatar + Info */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {current.avatar_url ? (
                <img src={current.avatar_url} alt={current.name} className="w-16 h-16 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform" />
              ) : (
                <div className={`w-16 h-16 bg-gradient-to-r ${current.color} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                  {current.avatar}
                </div>
              )}
              <div className="text-center md:text-left">
                <h4 className="text-white font-semibold text-lg">{current.name}</h4>
                <p className="text-gray-400 text-sm">{current.role}</p>
                <p className="text-purple-400 text-sm font-medium">{current.company}</p>
              </div>
            </div>

            {/* Bottom gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${current.color} rounded-b-3xl opacity-50`} />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button onClick={prev} className="w-12 h-12 bg-gray-800/80 hover:bg-purple-600 rounded-full flex items-center justify-center transition hover:scale-110 border border-gray-700">
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all rounded-full ${i === currentIndex ? 'w-8 h-3 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-3 h-3 bg-gray-600'}`}
                />
              ))}
            </div>

            <button onClick={next} className="w-12 h-12 bg-gray-800/80 hover:bg-purple-600 rounded-full flex items-center justify-center transition hover:scale-110 border border-gray-700">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            {currentIndex + 1} / {testimonials.length}
          </p>
        </div>
      </div>
    </section>
  );
}