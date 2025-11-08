import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../Components/footer';
import Header from '../Components/Header';
import {
  Play,
  Heart,
  Building2,
  MessageCircle,
  Sparkles,
  Film,
  Eye,
  X,
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
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

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Building2,
  MessageCircle,
  Film,
};

const Portfolio = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [videoPopup, setVideoPopup] = useState<string | null>(null);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, projRes] = await Promise.all([
          fetch('https://backend-swart-seven-13.vercel.app/api/portfolio/categories/'),
          fetch('https://backend-swart-seven-13.vercel.app/api/portfolio/projects/'),
        ]);

        const catData = await catRes.json();
        const projData = await projRes.json();

        setCategories(catData.results || catData);
        setProjects(projData.results || projData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  const handleCategoryChange = (categoryId: number | 'all') => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-x-hidden">
      <Header />
      {/* Projects Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <motion.h2 
  initial={{ opacity: 1, y: 0 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-white"
  style={{ 
    color: 'white',
    opacity: 1,
    visibility: 'visible'
  }}
>
  Explore Our{' '}
  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
    Work
  </span>
</motion.h2>
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
              viewport={{ once: false, margin: "-100px" }}
              className="w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"
            ></motion.div>
          </div>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange('all')}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Sparkles size={14} className="sm:w-4 sm:h-4" />
                <span>All Projects</span>
              </motion.button>

              {categories.map((cat, index) => {
                const Icon = iconMap[cat.icon] || Sparkles;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                    <span>{cat.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {currentProjects.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Thumbnail with Play Button */}
                <div className="relative aspect-video overflow-hidden bg-gray-800">
                  <motion.img
                    initial={{ scale: 1.15, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-50px" }}
                    src={p.thumbnail_url || p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button
                    onClick={() => setVideoPopup(p.video_url || p.video)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Play ${p.title}`}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 90, transition: { duration: 0.4, ease: "easeOut" } }}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Play size={18} className="sm:w-5 sm:h-5 fill-white ml-0.5" />
                    </motion.div>
                  </button>
                </div>
                
                {/* Project Info */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="p-4 sm:p-5"
                >
                  <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Eye size={14} />
                    <span>{p.views}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex justify-center items-center gap-2 mt-8 sm:mt-10"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 sm:px-4 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition"
              >
                Previous
              </button>
              
              <div className="flex gap-1 sm:gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 sm:px-4 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition"
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-br from-purple-900/20 to-gray-900 text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4"
          >
            Ready to Create Your Masterpiece?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-gray-300 mb-5 sm:mb-7 text-sm sm:text-base max-w-xl mx-auto px-4 leading-relaxed"
          >
            Let's bring your vision to life with cinematic excellence.
          </motion.p>
          <motion.button
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
  viewport={{ once: true, margin: "-100px" }}
  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
  whileTap={{ scale: 0.95 }}
  onClick={() => (window.location.href = '/#contact')}
  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-lg font-semibold text-sm sm:text-base transition-all shadow-lg shadow-purple-500/30"
>
  Start Your Project
</motion.button>
        </div>
      </section>
      <Footer />

      {/* Video Modal */}
      {videoPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setVideoPopup(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-10"
            aria-label="Close video"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </motion.button>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl w-full"
          >
            <video
              src={videoPopup}
              controls
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-2xl aspect-video"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Portfolio;