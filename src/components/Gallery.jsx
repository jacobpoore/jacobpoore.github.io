"use client"

import { useEffect, useRef, useState } from "react"

const Gallery = () => {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerTop = containerRef.current.offsetTop
      const containerHeight = containerRef.current.offsetHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // Define the sticky range
      const stickyStart = containerTop
      const stickyEnd = containerTop + containerHeight - windowHeight

      // Determine if gallery should be sticky
      const shouldBeSticky = scrollY >= stickyStart && scrollY <= stickyEnd
      setIsSticky(shouldBeSticky)

      // Calculate progress through the sticky section
      if (scrollY >= stickyStart && scrollY <= stickyEnd) {
        const progress = (scrollY - stickyStart) / (stickyEnd - stickyStart)
        const clampedProgress = Math.max(0, Math.min(1, progress))
        setScrollProgress(clampedProgress)
        setIsAnimationComplete(clampedProgress >= 1)
      } else if (scrollY < stickyStart) {
        setScrollProgress(0)
        setIsAnimationComplete(false)
      } else {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Preload images to prevent CLS
  useEffect(() => {
    const imagePromises = images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = resolve
        img.onerror = resolve
        img.src = image.src
      })
    })

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true)
    })
  }, [])

  const images = [
    { id: 1, src: "/placeholder1.svg?height=400&width=400", alt: "Gallery Image 1" },
    { id: 2, src: "/placeholder.svg?height=300&width=500", alt: "Gallery Image 2" },
    { id: 3, src: "/placeholder1.svg?height=500&width=300", alt: "Gallery Image 3" },
    { id: 4, src: "/placeholder.svg?height=350&width=450", alt: "Gallery Image 4" },
    { id: 5, src: "/placeholder1.svg?height=450&width=350", alt: "Gallery Image 5" },
    { id: 6, src: "/placeholder.svg?height400&width=400", alt: "Gallery Image 6" },
  ]

  const getImageTransform = (index, progress) => {
    const delay = index * 0.1
    const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)))
    const easedProgress = adjustedProgress * adjustedProgress * (3 - 2 * adjustedProgress)

    const positions = [
      { x: 0, y: 0, scale: 1, rotate: 0 },
      { x: -300, y: -200, scale: 0.8, rotate: -12 },
      { x: 350, y: -150, scale: 0.85, rotate: 15 },
      { x: -250, y: 180, scale: 0.75, rotate: -10 },
      { x: 400, y: 220, scale: 0.8, rotate: 12 },
      { x: -400, y: 50, scale: 0.7, rotate: -15 },
    ]

    const pos = positions[index] || positions[0]

    if (index === 0) {
      return {
        transform: `translate(0px, 0px) scale(${1 - easedProgress * 0.2}) rotate(0deg)`,
        opacity: 1 - easedProgress * 0.3,
        zIndex: 10 - index,
      }
    }

    return {
      transform: `translate(${pos.x * easedProgress}px, ${pos.y * easedProgress}px) scale(${pos.scale + (1 - pos.scale) * (1 - easedProgress)}) rotate(${pos.rotate * easedProgress}deg)`,
      opacity: easedProgress * 0.9,
      zIndex: 10 - index,
    }
  }

  const textOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.5) / 0.4))

  return (
    <>
      {/* Scroll container - this creates the "track" for the sticky animation */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "300vh" }} // Fixed height to prevent CLS
      >
        {/* Sticky Gallery - Use single positioning strategy to prevent CLS */}
        <div
          className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            // Use transform instead of changing position classes to prevent CLS
            transform: isAnimationComplete ? "translateY(0)" : "translateY(0)",
          }}
        >
          {/* Loading placeholder to prevent CLS during image loading */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Image Gallery */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ opacity: imagesLoaded ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="absolute transition-all duration-75 ease-out"
                style={getImageTransform(index, scrollProgress)}
              >
                {/* Reserve space for images to prevent CLS */}
                <div
                  className="relative rounded-xl shadow-xl dark:shadow-2xl overflow-hidden bg-gray-200 dark:bg-gray-700"
                  style={{
                    width: index === 0 ? "350px" : "250px",
                    height: index === 0 ? "350px" : "250px",
                  }}
                >
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    // Prevent layout shift by setting explicit dimensions
                    width={index === 0 ? 350 : 250}
                    height={index === 0 ? 350 : 250}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Text Content - Reserve space to prevent CLS */}
          <div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            style={{
              opacity: textOpacity,
              transform: `scale(${0.9 + textOpacity * 0.1}) translateY(${(1 - textOpacity) * 20}px)`,
              transition: "all 0.3s ease-out",
            }}
          >
            {/* Reserve minimum space for text content */}
            <div
              className="text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl dark:shadow-gray-900/50 max-w-md mx-4 border border-white/20 dark:border-gray-600/30"
              style={{ minHeight: "280px", minWidth: "320px" }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Jacob Poore</h1>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Physics/Engineering Student <br />
                  at<mark className="mx-1 pr-1 py-0.5 rounded-sm text-blue-900 bg-cyan-500"> Wesleyan University</mark>
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">Future Engineer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                  Passionate about creating innovative solutions and pushing the boundaries of technology.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                {/* Reserve space for progress bar to prevent CLS */}
                <div className="w-[200px] h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${textOpacity * 100}%`,
                      transform: "translateZ(0)", // Force GPU acceleration
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Gallery
