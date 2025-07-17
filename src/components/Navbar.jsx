"use client"
import { useState, useRef, useEffect } from "react"
import { FaLinkedinIn } from "react-icons/fa6"
import Darkmode from "./Darkmode"

export default function Navbar() {
  const [openTab, setOpenTab] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState({
    about: false,
    projects: false,
  })

  // Refs for dropdown positioning
  const aboutButtonRef = useRef(null)
  const projectsButtonRef = useRef(null)
  const aboutDropdownRef = useRef(null)
  const projectsDropdownRef = useRef(null)
  const navRef = useRef(null)

  // State for dropdown positioning
  const [dropdownPosition, setDropdownPosition] = useState({
    about: { left: 0 },
    projects: { left: 0 },
  })

  // State for fluid font size
  const [fontSize, setFontSize] = useState("1rem")

  // Function to calculate dropdown position
  const calculateDropdownPosition = (buttonRef, dropdownRef, tabName) => {
    if (!buttonRef.current || !dropdownRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth

    // Calculate if dropdown would overflow to the right
    const overflowRight = buttonRect.left + dropdownRect.width > viewportWidth - 20

    // If it would overflow, align it to the right edge of the viewport with some padding
    if (overflowRight) {
      const rightAligned = Math.max(0, viewportWidth - dropdownRect.width - 20)
      setDropdownPosition((prev) => ({
        ...prev,
        [tabName]: { left: rightAligned - buttonRect.left },
      }))
    } else {
      // Default left alignment
      setDropdownPosition((prev) => ({
        ...prev,
        [tabName]: { left: 0 },
      }))
    }
  }

  // Calculate fluid font size based on viewport width
  const calculateFontSize = () => {
    if (!navRef.current) return

    const viewportWidth = window.innerWidth
    const minWidth = 768 // md breakpoint
    const maxWidth = 1920 // max reasonable desktop size

    // Only adjust if we're above the md breakpoint
    if (viewportWidth >= minWidth) {
      const minFontSize = 1 // rem
      const maxFontSize = 1.25 // rem

      // Calculate scaling factor between 0 and 1
      const scale = Math.min(1, Math.max(0, (viewportWidth - minWidth) / (maxWidth - minWidth)))

      // Calculate font size between min and max
      const newFontSize = minFontSize + (maxFontSize - minFontSize) * scale
      setFontSize(`${newFontSize}rem`)
    } else {
      setFontSize("1rem")
    }
  }

  // Recalculate positions when tabs open
  useEffect(() => {
    if (openTab === "about") {
      calculateDropdownPosition(aboutButtonRef, aboutDropdownRef, "about")
    } else if (openTab === "projects") {
      calculateDropdownPosition(projectsButtonRef, projectsDropdownRef, "projects")
    }
  }, [openTab])

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      calculateFontSize()

      if (openTab === "about") {
        calculateDropdownPosition(aboutButtonRef, aboutDropdownRef, "about")
      } else if (openTab === "projects") {
        calculateDropdownPosition(projectsButtonRef, projectsDropdownRef, "projects")
      }
    }

    // Initial calculation
    calculateFontSize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [openTab])

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab)
  }

  const toggleMobileDropdown = (section) => {
    setMobileDropdown((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openTab === "about" &&
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target) &&
        !aboutButtonRef.current.contains(event.target)
      ) {
        setOpenTab(null)
      }
      if (
        openTab === "projects" &&
        projectsDropdownRef.current &&
        !projectsDropdownRef.current.contains(event.target) &&
        !projectsButtonRef.current.contains(event.target) &&
        !projectsButtonRef.current.contains(event.target)
      ) {
        setOpenTab(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openTab])

  return (
    <nav
      ref={navRef}
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg dark:shadow-gray-800/30 sticky top-0 z-50 transition-all duration-300 border-b border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-mono font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
          >
            J.Poore
          </a>

          {/* Mobile menu button with darkmode toggle */}
          <div className="flex md:hidden items-center">
            <Darkmode className="mr-3" />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${menuOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <ul className="hidden md:flex space-x-8 items-center" style={{ fontSize: fontSize }}>
            {/* About dropdown */}
            <li className="relative group">
              <button
                ref={aboutButtonRef}
                onClick={() => toggleTab("about")}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-expanded={openTab === "about"}
              >
                <span>About</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${openTab === "about" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openTab === "about" && (
                <div
                  key={openTab === "about" ? "about-open" : "about-closed"}
                  ref={aboutDropdownRef}
                  className="absolute top-full mt-2 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 grid grid-cols-2 gap-8 z-10 animate-in slide-in-from-top-2"
                  style={{
                    left: `${dropdownPosition.about.left}px`,
                    width: "min(520px, calc(100vw - 40px))",
                    maxWidth: "calc(100vw - 40px)",
                  }}
                >
                  {/* Professional Focus */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        <a
                          href="/about"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                        >
                          About Me
                          <svg
                            className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Engineering background & professional work
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-3">
                        <a
                          href="/blog"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                        >
                          Blog - All Articles
                          <svg
                            className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </h4>
                      <ul className="space-y-2">
                        {[
                          { href: "/blog/f1-air-tunnel", title: "F1 Air Tunnel", subtitle: "Aerodynamics deep-dive" },
                          {
                            href: "/blog/modern-retro-game",
                            title: "Modern Retro Game",
                            subtitle: "Game design analysis",
                          },
                          { href: "/blog/kei-trucks", title: "Kei Trucks", subtitle: "Japanese automotive culture" },
                          { href: "/blog/jdm", title: "JDM", subtitle: "Japanese domestic market cars" },
                        ].map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              className="group block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {item.subtitle}
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Personal Interests */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Personal Interests</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">What I explore in my free time</p>
                    </div>

                    <ul className="space-y-3">
                      <li>
                        <a
                          href="/goodreads"
                          className="group block py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                Goodreads
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">What I've been reading</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Books that shaped my thinking
                          </div>
                        </a>
                      </li>

                      <li>
                        <a
                          href="/letterboxd"
                          className="group block py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                Letterboxd
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Films I think about</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Cinema as a window into systems and design
                          </div>
                        </a>
                      </li>

                      <li>
                        <a
                          href="/retroachievements"
                          className="group block py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                RetroAchievements
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">Games I play</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
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
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Retro gaming with a technical lens
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>

            {/* Portfolio dropdown */}
            <li className="relative group">
              <button
                ref={projectsButtonRef}
                onClick={() => toggleTab("projects")}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-expanded={openTab === "projects"}
              >
                <span>Portfolio</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${openTab === "projects" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openTab === "projects" && (
                <div
                  key={openTab === "projects" ? "projects-open" : "projects-closed"}
                  ref={projectsDropdownRef}
                  className="absolute top-full mt-2 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl pt-5 pl-7 pb-3 grid grid-cols-3 gap-5 z-10"
                  style={{
                    left: `${dropdownPosition.projects.left}px `,
                    width: "min(640px, calc(100vw - 40px))",
                    maxWidth: "calc(100vw - 40px)",
                  }}
                >
                  {/* Main Portfolio Links */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        <a
                          href="/projects"
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                        >
                          All Projects
                          <svg
                            className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete portfolio overview</p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="https://github.com/jacobpoore"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              GitHub
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">/jacobpoore</div>
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
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

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Most Recent</h4>
                        <a
                          href="/a4"
                          className="group block py-2 px-3 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <div className="font-medium">Euler Method Implementation</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Numerical analysis project
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Physics/Code Projects */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Physics/Code</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Computational physics & simulations
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {[
                        { href: "/b1", title: "Simulation 1", subtitle: "Wave propagation modeling" },
                        { href: "/b2", title: "Simulation 2", subtitle: "Particle dynamics system" },
                        { href: "/b3", title: "Simulation 3", subtitle: "Fluid mechanics solver" },
                        { href: "/b4", title: "Simulation 4", subtitle: "Electromagnetic field analysis" },
                      ].map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="group block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                          >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {item.subtitle}
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CAD Projects */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">CAD Projects</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mechanical design & engineering</p>
                    </div>

                    <ul className="space-y-2">
                      {[
                        { href: "/c1", title: "CAD 1", subtitle: "Mechanical assembly design" },
                        { href: "/c2", title: "CAD 2", subtitle: "Parametric modeling project" },
                        { href: "/c3", title: "CAD 3", subtitle: "Structural analysis study" },
                        { href: "/c4", title: "CAD 4", subtitle: "Manufacturing optimization" },
                      ].map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            className="group block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                          >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {item.subtitle}
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>

            {/* Contact link */}
            <li>
              <a
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Contact
              </a>
            </li>

            {/* LinkedIn icon */}
            <li>
              <a
                href="https://www.linkedin.com/in/jacobtpoore/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </li>

            {/* Darkmode toggle - desktop */}
            <li>
              <Darkmode className="hidden md:block" />
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            key={menuOpen ? "mobile-menu-open" : "mobile-menu-closed"}
            className="md:hidden mt-4 space-y-4 pb-6 border-t border-gray-200 dark:border-gray-700 pt-6"
          >
            {/* About dropdown */}
            <div>
              <button
                onClick={() => toggleMobileDropdown("about")}
                className="flex items-center justify-between w-full py-3 px-4 text-gray-800 dark:text-gray-200 font-medium hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <span>About</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown.about ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileDropdown.about && (
                <div
                  key={mobileDropdown.about ? "mobile-about-open" : "mobile-about-closed"}
                  className="underline ml-4 mt-2 space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800 animate-in slide-in-from-top-1"
                >
                  <a
                    href="/about"
                    className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    About Me
                  </a>
                  <a
                    href="/blog"
                    className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    Blog
                  </a>
                </div>
              )}
            </div>

            {/* Portfolio dropdown */}
            <div>
              <button
                onClick={() => toggleMobileDropdown("projects")}
                className="flex items-center justify-between w-full py-3 px-4 text-gray-800 dark:text-gray-200 font-medium hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <span>Portfolio</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown.projects ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileDropdown.projects && (
                <div
                  key={mobileDropdown.projects ? "mobile-projects-open" : "mobile-projects-closed"}
                  className="underline ml-4 mt-2 space-y-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800 animate-in slide-in-from-top-1"
                >
                  {[
                    { href: "/projects", title: "All Projects" },
                    { href: "/a2", title: "./Simulation #" },
                    { href: "/a3", title: "./Simulation #" },
                    { href: "/a4", title: "./CAD #" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <a
              href="/contact"
              className="block py-3 px-4 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
            >
              Contact
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/jacobtpoore/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-3 px-4 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <FaLinkedinIn className="w-5 h-5 mr-3" />
              <span className="font-medium">LinkedIn</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
