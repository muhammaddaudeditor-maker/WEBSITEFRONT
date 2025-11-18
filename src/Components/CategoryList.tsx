import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("https://api.daudportfolio.cloud/portfolio/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data.results || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {categories.map((cat) => (
        <div key={cat.id} className="bg-gray-100 p-4 rounded shadow text-center">
          <span className="block text-lg font-semibold">{cat.name}</span>
          <span className="text-sm text-gray-600">{cat.icon}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
