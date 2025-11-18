// src/pages/Projects.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Components/Header";
import Footer from "../Components/footer";

const API_BASE_URL = "https://api.daudportfolio.cloud/api";

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  media_type: "image" | "video";
  media_url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string;
  client: string;
  technologies_list: string[];
  is_featured: boolean;
}

const Projects: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cubicEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const heroResponse = await fetch(`${API_BASE_URL}/portfolio-hero/active/`);
      if (heroResponse.ok) {
        const heroJson = await heroResponse.json();
        setHeroData(heroJson);
      }

      const projectsResponse = await fetch(`${API_BASE_URL}/projects/`);
      if (projectsResponse.ok) {
        const projectsJson = await projectsResponse.json();
        setProjects(projectsJson.results || projectsJson);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data from backend.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
        {/* ---------------- HERO SECTION ---------------- */}
        {heroData && (
          <section className="relative h-[90vh] bg-black overflow-hidden flex items-center justify-center">
            {heroData.media_type === "video" ? (
              <motion.video
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: cubicEase }}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={heroData.media_url} type="video/mp4" />
              </motion.video>
            ) : (
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: cubicEase }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroData.media_url})` }}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: cubicEase }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-4"
            >
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: cubicEase }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {heroData.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7, ease: cubicEase }}
                  className="text-lg md:text-xl mb-6 text-gray-300"
                >
                  {heroData.subtitle}
                </motion.p>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 12px rgba(168, 85, 247, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring" as const, stiffness: 200, damping: 18 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold"
                >
                  {heroData.button_text}
                </motion.button>
              </div>
            </motion.div>
          </section>
        )}

        {/* ---------------- PROJECTS SECTION ---------------- */}
        <section className="container mx-auto py-20 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: cubicEase }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Projects
          </motion.h2>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center text-gray-400 py-12"
            >
              <p>No projects available.</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={{
                    hidden: { opacity: 0, y: 60, scale: 0.95 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.9, ease: cubicEase },
                    },
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    transition: { type: "spring" as const, stiffness: 160, damping: 16 },
                  }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl block"
                  >
                    <div className="relative h-52 bg-gray-700">
                      {project.media_type === "video" ? (
                        <video
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          loop
                        >
                          <source src={project.media_url} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={project.media_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {project.is_featured && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, ease: cubicEase }}
                          className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Featured
                        </motion.span>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {project.title}
                      </h3>
                      {project.client && (
                        <p className="text-sm text-purple-400 mb-2">
                          Client: {project.client}
                        </p>
                      )}
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {project.technologies_list.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies_list.map((tech, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <div className="bg-[#0b0d17] text-white">
        <Footer />
      </div>
    </>
  );
};

export default Projects;
