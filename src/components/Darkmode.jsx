import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Darkmode({ className = '' }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (prefersDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const currentlyDark = html.classList.contains('dark');

    if (currentlyDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className={`p-2 ${className}`}>
      <button
        onClick={toggleDarkMode}
        className="w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 relative"
        aria-label="Toggle dark mode"
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ${
            isDark ? 'translate-x-8' : 'translate-x-0'
          }`}
        />
        <FaSun className="text-yellow-500 w-4 h-4 z-10 ml-1" />
        <FaMoon className="text-blue-300 w-4 h-4 z-10 ml-auto mr-1" />
      </button>
    </div>
  );
}
