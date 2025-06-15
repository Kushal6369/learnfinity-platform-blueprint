
import React, { useState } from "react";
import { Menu } from "lucide-react";

const menuItems = [
  { icon: "🏠", label: "Home", href: "#" },
  { icon: "📄", label: "About", href: "#" },
  { icon: "🖼️", label: "Portfolio", href: "#" },
  { icon: "📞", label: "Contact", href: "#" },
];

export default function SlidingMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    // On mount, set theme according to preference or default to light
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Menu Icon */}
      <button
        className="fixed top-4 left-4 z-50 p-3 rounded-md bg-gray-900 text-white shadow-lg focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <span className="font-bold text-lg tracking-wide">Menu</span>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav>
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center px-6 py-4 hover:bg-gray-800 transition gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Theme Toggle */}
      <button
        id="theme-toggle"
        type="button"
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-gray-900 text-white rounded shadow-lg"
        onClick={() => setDarkMode((v) => !v)}
      >
        Toggle Theme
      </button>

      {/* Main Content (example) */}
      <div
        className={`transition-all duration-300 md:ml-64 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="pt-20 px-8 pb-8">
          <h1 className="text-3xl font-semibold mb-4">
            Welcome to the Combined Interface
          </h1>
          <p className="mb-2">
            This page demonstrates a sliding sidebar menu combined with a dark/light theme toggle.
          </p>
          <p>
            You can click the ☰ menu icon to expand/collapse the sidebar, or use the toggle button to change the theme.
          </p>
        </div>
      </div>
    </>
  );
}
