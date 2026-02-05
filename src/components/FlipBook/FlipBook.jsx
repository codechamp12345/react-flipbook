import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { processImagesForFlipbook } from '../../utils/validateQR'

// Image component with loading and error handling
function AlbumImage({ src, alt, className }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)

    // Try alternative URL formats if the original fails
    if (src && !src.startsWith('http') && !imgSrc.includes('proxyImage')) {
      const proxyUrl = `https://us-central1-instant-photos-9a258.cloudfunctions.net/proxyImage?path=${encodeURIComponent(src)}`
      setImgSrc(proxyUrl)
      setIsLoading(true)
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
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        loading="lazy"
      />
    </div>
  )
}

function FlipBook({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next')
  const [processedImages, setProcessedImages] = useState([])

  useEffect(() => {
    const processed = processImagesForFlipbook(images)
    setProcessedImages(processed)
    setCurrentIndex(0)
  }, [images])

  const totalSheets = Math.ceil(processedImages.length / 2)

  const handleNext = () => {
    if (currentIndex < totalSheets - 1 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('next')
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setIsFlipping(false)
      }, 800)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('prev')
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
        setIsFlipping(false)
      }, 800)
    }
  }

  const getCurrentSheetImages = () => {
    const startIndex = currentIndex * 2
    return {
      left: processedImages[startIndex] || null,
      right: processedImages[startIndex + 1] || null
    }
  }

  const getTargetSheetImages = () => {
    const targetIndex = flipDirection === 'next' ? currentIndex + 1 : currentIndex - 1
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
  }, [currentIndex, isFlipping])

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

  const currentSheet = getCurrentSheetImages()
  const targetSheet = getTargetSheetImages()

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-full">
      <div className="block md:hidden mb-4 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
          <p className="text-white/80 text-sm flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Rotate device for better experience</span>
          </p>
        </div>
      </div>

      <div className="relative mb-8 transform md:rotate-0 rotate-90 md:scale-100 scale-75 origin-center">
        <div
          className="flex justify-center items-center overflow-visible"
          style={{ perspective: '2000px' }}
        >
          <div className="relative w-[40rem] h-[28rem] sm:w-[48rem] sm:h-[32rem] md:w-[56rem] md:h-[36rem] lg:w-[64rem] lg:h-[42rem] xl:w-[72rem] xl:h-[48rem] max-w-[95vw] max-h-[75vh] bg-neutral-100 rounded-lg shadow-2xl">

            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-300 transform -translate-x-0.5 z-30 shadow-sm"></div>

            <div className="absolute inset-2 bg-white rounded-lg shadow-lg">
              <div className="flex h-full">
                <div className="w-1/2 p-1.5 flex flex-col border-r border-gray-200">
                  <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                    {currentSheet.left ? (
                      <AlbumImage
                        src={currentSheet.left.url}
                        alt={currentSheet.left.alt}
                        className="w-full h-full rounded-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Empty page</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-gray-500 font-mono">{currentIndex * 2 + 1}</span>
                  </div>
                </div>

                <div className="w-1/2 p-1.5 flex flex-col">
                  <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                    {currentSheet.right ? (
                      <AlbumImage
                        src={currentSheet.right.url}
                        alt={currentSheet.right.alt}
                        className="w-full h-full rounded-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Empty page</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-gray-500 font-mono">{currentIndex * 2 + 2}</span>
                  </div>
                </div>
              </div>
            </div>

            {isFlipping && (
              <>
                {flipDirection === 'next' && (
                  <motion.div
                    className="absolute top-2 bottom-2 right-2 w-1/2 bg-white rounded-r-lg shadow-xl z-20"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transformOrigin: 'left center'
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <div className="absolute inset-0 backface-hidden">
                      <div className="w-full h-full p-1.5 flex flex-col">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                          {currentSheet.right ? (
                            <AlbumImage
                              src={currentSheet.right.url}
                              alt={currentSheet.right.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500 font-mono">{currentIndex * 2 + 2}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full p-1.5 flex flex-col">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
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
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500 font-mono">{(currentIndex + 1) * 2 + 1}</span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-r-lg pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                    />
                  </motion.div>
                )}

                {flipDirection === 'prev' && (
                  <motion.div
                    className="absolute top-2 bottom-2 right-2 w-1/2 bg-white rounded-r-lg shadow-xl z-20"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transformOrigin: 'left center'
                    }}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <div className="absolute inset-0 backface-hidden">
                      <div className="w-full h-full p-1.5 flex flex-col">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
                          {currentSheet.right ? (
                            <AlbumImage
                              src={currentSheet.right.url}
                              alt={currentSheet.right.alt}
                              className="w-full h-full rounded-sm"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-50"></div>
                          )}
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500 font-mono">{currentIndex * 2 + 2}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div className="w-full h-full p-1.5 flex flex-col">
                        <div className="flex-1 relative bg-white rounded-sm overflow-hidden">
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
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500 font-mono">{(currentIndex - 1) * 2 + 2}</span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 bg-black/20 rounded-r-lg pointer-events-none"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                    />
                  </motion.div>
                )}
              </>
            )}

            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-[95%] h-6 bg-black/30 blur-xl rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full max-w-lg px-4 mb-4 md:rotate-0 rotate-90">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isFlipping}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </motion.button>

        <div className="flex flex-col items-center space-y-3">
          <div className="text-white/90 text-lg font-semibold">
            Page {currentIndex + 1} of {totalSheets}
          </div>

          <div className="flex space-x-2">
            {Array.from({ length: Math.min(totalSheets, 6) }, (_, index) => {
              const pageIndex = totalSheets <= 6 ? index :
                currentIndex < 3 ? index :
                  currentIndex > totalSheets - 4 ? totalSheets - 6 + index :
                    currentIndex - 2 + index

              return (
                <motion.div
                  key={pageIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${pageIndex === currentIndex ? 'bg-white scale-125' : 'bg-white/40'
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
          disabled={currentIndex === totalSheets - 1 || isFlipping}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div >
  )
}

export default FlipBook