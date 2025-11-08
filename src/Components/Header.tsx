"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState({
    logo_url: null,
    site_name: "Logo",
  });
  const [cvData, setCvData] = useState({
    cv_url: null,
    title: "My CV",
  });

  // scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch site configuration
  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const response = await fetch(
          "https://backend-swart-seven-13.vercel.app/api/site-config/"
        );
        if (response.ok) {
          const data = await response.json();
          setSiteConfig(data);
        }
      } catch (error) {
        console.error("Error fetching site config:", error);
      }
    };
    fetchSiteConfig();
  }, []);

  // Fetch CV from Django API (LOCAL MEDIA)
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await fetch(
          "https://backend-swart-seven-13.vercel.app/api/cv/active/"
        );
        if (response.ok) {
          const data = await response.json();
          setCvData(data);
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };
    fetchCV();
  }, []);

  // close mobile nav
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest("nav")) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
  ];

  const whatsappNumber = "923028974047";
  const whatsappMessage =
    "Hello! I would like to inquire about your videography services.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(url, "_blank");
  };

  const handleDownloadCV = () => {
    if (cvData.cv_url) {
      const link = document.createElement("a");
      link.href = cvData.cv_url;
      link.download = `${cvData.title || "CV"}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    //   toast.success("🎉 CV download started successfully!", {
    //     position: "bottom-right",
    //     theme: "dark",
    //   });
    // } else {
    //   toast.error("⚠️ CV not available. Please try again later.", {
    //     position: "bottom-right",
    //     theme: "dark",
    //   });
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer />

      {/* Navbar */}
      <nav
  className={`w-full transition-all duration-300 ${
    isScrolled
      ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
      : "bg-transparent"
  }`}
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              {siteConfig.logo_url ? (
                <img
                  src={siteConfig.logo_url}
                  alt={siteConfig.site_name}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <h1 className="text-2xl font-bold text-white">
                  {siteConfig.site_name}
                </h1>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleDownloadCV}
                disabled={!cvData.cv_url}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  cvData.cv_url
                    ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Download CV
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-purple-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={handleDownloadCV}
                disabled={!cvData.cv_url}
                className={`w-full px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 mt-2 ${
                  cvData.cv_url
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Download CV
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          className="w-7 h-7 group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>
      </button>
    </>
  );
};

export default Header;
