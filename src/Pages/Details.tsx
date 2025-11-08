// src/pages/Details.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/footer';

const API_BASE_URL = 'https://backend-swart-seven-13.vercel.app/api';

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  details: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string;
  client: string;
  project_url: string | null;
  technologies_list: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`);
      
      if (!response.ok) {
        throw new Error('Project not found');
      }
      
      const data = await response.json();
      setProject(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load project details');
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
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header />
        <div className="bg-gray-900 text-white min-h-screen">
          <div className="container mx-auto py-12 px-4 text-center">
            <p className="text-red-500 mb-4">{error || 'Project not found'}</p>
            <Link
              to="/projects"
              className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              &larr; Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="container mx-auto py-12 px-4">
          <Link
            to="/projects"
            className="text-purple-400 hover:text-purple-300 mb-6 inline-flex items-center transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Media Section */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                {project.media_type === 'video' ? (
                  <video
                    controls
                    className="w-full h-auto"
                    poster={project.thumbnail_url}
                  >
                    <source src={project.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={project.media_url}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
              
              {project.is_featured && (
                <div className="flex items-center text-purple-400">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">Featured Project</span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                {project.client && (
                  <p className="text-purple-400 text-lg mb-4">
                    <span className="font-semibold">Client:</span> {project.client}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Details</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.details}
                </p>
              </div>

              {project.technologies_list.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies_list.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.project_url && (
                <div className="pt-4">
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                  >
                    View Live Project
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-4 border-t border-gray-700">
                <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                <p>Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
   <div className="bg-[#0b0d17] text-white">
           <Footer />
         </div>
    </>
  );
};

export default Details;