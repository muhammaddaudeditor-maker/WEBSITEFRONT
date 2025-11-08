import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  thumbnail: string;
  video_url: string;
  description: string;
}

const ProjectGallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("https://backend-swart-seven-13.vercel.app//portfolio/categories/")
      .then((res) => res.json())
      .then((data) => {
        const allProjects = data.results?.flatMap((cat: any) => cat.projects) || [];
        setProjects(allProjects);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {projects.map((p) => (
        <div key={p.id} className="bg-white shadow rounded overflow-hidden">
          <img src={p.thumbnail} alt={p.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{p.description}</p>
            <video src={p.video_url} controls className="w-full mt-3 rounded"></video>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGallery;
