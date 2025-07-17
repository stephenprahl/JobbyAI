import { gsap } from 'gsap'
import React, { useEffect, useRef } from 'react'
import { FiPlay, FiX } from 'react-icons/fi'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  // Animation refs
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  // Handle closing with animation
  const handleClose = () => {
    if (modalOverlayRef.current && modalContentRef.current) {
      // Animate modal closing
      const tl = gsap.timeline({
        onComplete: onClose
      })

      tl.to(modalContentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: 'power2.in'
      })
        .to(modalOverlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, 0.1)
    } else {
      onClose()
    }
  }

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // GSAP Animation effects
  useEffect(() => {
    if (isOpen && modalOverlayRef.current && modalContentRef.current) {
      // Reset initial states
      gsap.set(modalOverlayRef.current, { opacity: 0 })
      gsap.set(modalContentRef.current, { opacity: 0, scale: 0.8, y: 50 })

      // Animate modal opening with enhanced effects
      const tl = gsap.timeline()

      tl.to(modalOverlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
        .to(modalContentRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }, 0.1)

      // Animate content sections with enhanced stagger
      if (headerRef.current && videoRef.current && featuresRef.current && footerRef.current) {
        gsap.fromTo([headerRef.current, videoRef.current, featuresRef.current, footerRef.current],
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.4
          }
        )
      }

      // Animate feature cards with bounce effect
      const featureCards = modalContentRef.current.querySelectorAll('.feature-card')
      if (featureCards.length > 0) {
        gsap.fromTo(featureCards,
          { opacity: 0, scale: 0.8, y: 30, rotation: -5 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            delay: 0.8
          }
        )

        // Add hover animations for feature cards
        featureCards.forEach((card) => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              y: -5,
              duration: 0.3,
              ease: 'power2.out'
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            })
          })
        })
      }

      // Enhanced play button animation with pulsing effect
      const playButton = modalContentRef.current.querySelector('.play-button')
      if (playButton) {
        gsap.fromTo(playButton,
          { opacity: 0, scale: 0.3, rotation: -360 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.6)',
            delay: 0.6
          }
        )

        // Add continuous floating and pulsing animation
        gsap.to(playButton, {
          y: -15,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        })

        gsap.to(playButton, {
          scale: 1.1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: 0.5
        })
      }

      // Animate floating particles
      const particles = modalContentRef.current.querySelectorAll('.particle')
      if (particles.length > 0) {
        particles.forEach((particle, index) => {
          // Initial fade in
          gsap.fromTo(particle,
            { opacity: 0, scale: 0 },
            {
              opacity: 0.6,
              scale: 1,
              duration: 0.8,
              delay: 1 + index * 0.2,
              ease: 'power2.out'
            }
          )

          // Floating animation
          gsap.to(particle, {
            y: -20,
            x: Math.random() * 20 - 10,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: index * 0.3
          })

          // Scale pulsing
          gsap.to(particle, {
            scale: 1.5,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            delay: index * 0.5
          })
        })
      }

      // Add text reveal animation
      const textElements = modalContentRef.current.querySelectorAll('h2, h3, p')
      if (textElements.length > 0) {
        gsap.fromTo(textElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 0.7
          }
        )
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={modalOverlayRef}
      className="fixed inset-0 z-[9999] overflow-auto bg-black bg-opacity-80 flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)'
      }}
      onClick={handleClose}
    >
      <div
        ref={modalContentRef}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-auto border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              � Interactive Demo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              See how JobbyAI transforms your career prospects
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Close demo modal"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Video Content */}
        <div ref={videoRef} className="p-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-gray-800">
            {/* Placeholder for actual video - you can replace this with an actual video element */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
              {/* Animated background particles */}
              <div className="absolute inset-0">
                <div className="floating-particles absolute inset-0 opacity-20">
                  <div className="particle absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
                  <div className="particle absolute w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
                  <div className="particle absolute w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse" style={{ top: '40%', left: '70%', animationDelay: '2s' }}></div>
                  <div className="particle absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '80%', left: '25%', animationDelay: '1.5s' }}></div>
                  <div className="particle absolute w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ top: '30%', left: '50%', animationDelay: '0.5s' }}></div>
                </div>
              </div>

              <div className="text-center text-white relative z-10">
                <FiPlay className="play-button h-16 w-16 mx-auto mb-4 opacity-80 hover:opacity-100 cursor-pointer transition-all duration-300 hover:scale-110 drop-shadow-lg" />
                <h3 className="text-2xl font-semibold mb-2 drop-shadow-lg">Interactive Demo</h3>
                <p className="text-lg opacity-90 max-w-md mx-auto mb-4 drop-shadow-sm">
                  Experience how JobbyAI transforms job postings into perfectly tailored,
                  ATS-optimized resumes
                </p>
                <div className="text-sm opacity-75 space-y-1 drop-shadow-sm">
                  <p>• Paste any job posting URL</p>
                  <p>• AI analyzes requirements instantly</p>
                  <p>• Generate ATS-friendly resume in 60 seconds</p>
                </div>
              </div>
            </div>

            {/* Uncomment and modify this when you have an actual demo video */}
            {/*
            <video
              className="w-full h-full object-cover"
              controls
              poster="/demo-thumbnail.jpg"
              preload="metadata"
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              <source src="/demo-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            */}
          </div>

          {/* Features highlight */}
          <div ref={featuresRef} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="feature-card text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                AI Analysis
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analyzes job requirements automatically
              </p>
            </div>
            <div className="feature-card text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                ATS Friendly
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Optimized for applicant tracking systems
              </p>
            </div>
            <div className="feature-card text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                Quick Results
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate tailored resumes in minutes
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div ref={footerRef} className="px-6 py-4 bg-gray-50 dark:bg-black rounded-b-2xl border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ready to create your perfect resume?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 hover:scale-105"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClose()
                  // Navigate to register page
                  window.location.href = '/register'
                }}
                className="btn btn-primary px-6 py-2 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoModal