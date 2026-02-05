import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { processImagesForFlipbook } from '../../utils/validateQR'

// Image component with error handling (no loading spinner)
function AlbumImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    setHasError(true)

    // Try alternative URL formats if the original fails
    if (src && !src.startsWith('http') && !imgSrc.includes('proxyImage')) {
      const proxyUrl = `https://us-central1-instant-photos-9a258.cloudfunctions.net/proxyImage?path=${encodeURIComponent(src)}`
      setImgSrc(proxyUrl)
      setHasError(false)
    }
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-xs">Failed to load</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`${className} w-full h-full object-contain`}
      loading="eager"
    />
  )
}

function FlipBook({ images = [] }) {
  const [visibleIndex, setVisibleIndex] = useState(0) // Currently displayed images
  const [targetIndex, setTargetIndex] = useState(0) // Target images after flip
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next')
  const [processedImages, setProcessedImages] = useState([])

  useEffect(() => {
    const processed = processImagesForFlipbook(images)
    setProcessedImages(processed)
    setVisibleIndex(0)
    setTargetIndex(0)
  }, [images])

  const totalSheets = Math.ceil(processedImages.length / 2)

  const handleNext = () => {
    if (visibleIndex < totalSheets - 1 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('next')
      setTargetIndex(visibleIndex + 1)
      // Do NOT update visibleIndex here - only after animation completes
    }
  }

  const handlePrevious = () => {
    if (visibleIndex > 0 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('prev')
      setTargetIndex(visibleIndex - 1)
      // Do NOT update visibleIndex here - only after animation completes
    }
  }

  const onFlipComplete = () => {
    // Update visible images ONLY after flip animation completes
    setVisibleIndex(targetIndex)
    setIsFlipping(false)
  }

  const getVisibleSheetImages = () => {
    const startIndex = visibleIndex * 2
    return {
      left: processedImages[startIndex] || null,
      right: processedImages[startIndex + 1] || null
    }
  }

  const getTargetSheetImages = () => {
    const startIndex = targetIndex * 2
    return {
      left: processedImages[startIndex] || null,
      right: processedImages[startIndex + 1] || null
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [visibleIndex, isFlipping])

  if (processedImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/80 text-lg font-medium">No images found</p>
          <p className="text-white/60 text-sm">This album appears to be empty</p>
        </div>
      </div>
    )
  }

  const visibleSheet = getVisibleSheetImages()
  const targetSheet = getTargetSheetImages()

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-full">
      {/* Mobile rotation hint - updated message */}
      <div className="block sm:hidden mb-2 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20">
          <p className="text-white/80 text-xs flex items-center justify-center space-x-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Album optimized for landscape</span>
          </p>
        </div>
      </div>

      {/* Album Container - Auto-rotate on mobile with better scaling */}
      <div className="relative mb-4 sm:mb-8 transform-gpu rotate-90 sm:rotate-0 scale-90 sm:scale-100 origin-center">
        {/* Mobile Navigation Arrows - Positioned at album edges */}
        <div className="block sm:hidden">
          {/* Next Button - Left edge shows RIGHT arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={visibleIndex === totalSheets - 1 || isFlipping}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white rounded-full w-16 h-16 text-gray-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Previous Button - Right edge shows LEFT arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            disabled={visibleIndex === 0 || isFlipping}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md border-2 border-white rounded-full w-16 h-16 text-gray-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>

        <div
          className="flex justify-center items-center overflow-visible"
          style={{ perspective: '2000px' }}
        >
          {/* Responsive Album Dimensions - Larger mobile album */}
          <div className="relative 
            w-[85vh] h-[60vh] max-w-[600px] max-h-[400px]
            sm:w-[40rem] sm:h-[28rem] 
            md:w-[56rem] md:h-[36rem] 
            lg:w-[64rem] lg:h-[42rem] 
            xl:w-[72rem] xl:h-[48rem] 
            sm:max-w-[95vw] sm:max-h-[75vh]
            bg-neutral-100 rounded-lg shadow-2xl">

            {/* Center Spine - thinner on mobile only */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-neutral-300 transform -translate-x-0.5 z-30 shadow-sm"></div>

            {/* Album Pages - Show only visible images */}
            <div className="absolute inset-1 sm:inset-2 bg-white rounded-lg shadow-lg">
              <div className="flex h-full">
                {/* Left Page */}
                <div className="w-1/2 p-1 sm:p-1.5 flex flex-col border-r border-gray-200">
                  <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                    {visibleSheet.left ? (
                      <AlbumImage
                        src={visibleSheet.left.url}
                        alt={visibleSheet.left.alt}
                        className="w-full h-full rounded-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400 text-xs sm:text-sm">Empty page</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Page */}
                <div className="w-1/2 p-1 sm:p-1.5 flex flex-col">
                  <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                    {visibleSheet.right ? (
                      <AlbumImage
                        src={visibleSheet.right.url}
                        alt={visibleSheet.right.alt}
                        className="w-full h-full rounded-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400 text-xs sm:text-sm">Empty page</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isFlipping && (
              <>
                {flipDirection === 'next' && (
                  <motion.div
                    className="absolute top-1 bottom-1 right-1 sm:top-2 sm:bottom-2 sm:right-2 w-1/2 bg-white rounded-r-lg shadow-xl z-20"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transformOrigin: 'left center'
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1
                    }}
                    onAnimationComplete={onFlipComplete}
                  >
                    {/* Front side - Current image */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="w-full h-full p-1 sm:p-1.5">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden h-full">
                          {visibleSheet.right ? (
                            <AlbumImage
                              src={visibleSheet.right.url}
                              alt={visibleSheet.right.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Back side - Target image */}
                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full p-1 sm:p-1.5">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden h-full">
                          {targetSheet.left ? (
                            <AlbumImage
                              src={targetSheet.left.url}
                              alt={targetSheet.left.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-r-lg pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1] }}
                    />
                  </motion.div>
                )}

                {flipDirection === 'prev' && (
                  <motion.div
                    className="absolute top-1 bottom-1 right-1 sm:top-2 sm:bottom-2 sm:right-2 w-1/2 bg-white rounded-r-lg shadow-xl z-20"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transformOrigin: 'left center'
                    }}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1
                    }}
                    onAnimationComplete={onFlipComplete}
                  >
                    {/* Front side - Current image */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="w-full h-full p-1 sm:p-1.5">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden h-full">
                          {visibleSheet.right ? (
                            <AlbumImage
                              src={visibleSheet.right.url}
                              alt={visibleSheet.right.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Back side - Target image */}
                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full p-1 sm:p-1.5">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden h-full">
                          {targetSheet.right ? (
                            <AlbumImage
                              src={targetSheet.right.url}
                              alt={targetSheet.right.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-r-lg pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1] }}
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* Album Shadow */}
            <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-[95%] h-4 sm:h-6 bg-black/30 blur-xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Page Indicator - Bottom center */}
      <div className="block sm:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-white/90 text-sm font-semibold bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30">
            {visibleIndex + 1}/{totalSheets}
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalSheets, 6) }, (_, index) => {
              const pageIndex = totalSheets <= 6 ? index :
                visibleIndex < 3 ? index :
                  visibleIndex > totalSheets - 4 ? totalSheets - 6 + index :
                    visibleIndex - 2 + index

              return (
                <motion.div
                  key={pageIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${pageIndex === visibleIndex ? 'bg-white scale-125' : 'bg-white/60'
                    }`}
                  whileHover={{ scale: 1.3 }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Bottom positioned */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-lg px-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={visibleIndex === 0 || isFlipping}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </motion.button>

        <div className="flex flex-col items-center space-y-3">
          <div className="text-white/90 text-lg font-semibold">
            Page {visibleIndex + 1} of {totalSheets}
          </div>

          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalSheets, 6) }, (_, index) => {
              const pageIndex = totalSheets <= 6 ? index :
                visibleIndex < 3 ? index :
                  visibleIndex > totalSheets - 4 ? totalSheets - 6 + index :
                    visibleIndex - 2 + index

              return (
                <motion.div
                  key={pageIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${pageIndex === visibleIndex ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  whileHover={{ scale: 1.3 }}
                />
              )
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={visibleIndex === totalSheets - 1 || isFlipping}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          <span>Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div >
  )
}

export default FlipBook