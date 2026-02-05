import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FlipPage from './FlipPage'
import { processImagesForFlipbook } from '../../utils/validateQR'

function FlipBook({ images = [] }) {
    const [currentPage, setCurrentPage] = useState(0)
    const [isFlipping, setIsFlipping] = useState(false)
    const [processedImages, setProcessedImages] = useState([])
    const [loadedImages, setLoadedImages] = useState(0)
    const [flippedPages, setFlippedPages] = useState(new Set())

    // Process images for flipbook display
    useEffect(() => {
        const processed = processImagesForFlipbook(images)
        setProcessedImages(processed)
        setLoadedImages(0)
        setFlippedPages(new Set())
        setCurrentPage(0)
    }, [images])

    // Calculate total pages (each page shows 2 images)
    const totalPages = Math.ceil(processedImages.length / 2)

    const handleNext = () => {
        if (currentPage < totalPages - 1 && !isFlipping) {
            setIsFlipping(true)

            // Add current page to flipped pages
            setFlippedPages(prev => new Set([...prev, currentPage]))

            setTimeout(() => {
                setCurrentPage(prev => prev + 1)
                setIsFlipping(false)
            }, 400)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 0 && !isFlipping) {
            setIsFlipping(true)

            // Remove previous page from flipped pages
            setFlippedPages(prev => {
                const newSet = new Set(prev)
                newSet.delete(currentPage - 1)
                return newSet
            })

            setTimeout(() => {
                setCurrentPage(prev => prev - 1)
                setIsFlipping(false)
            }, 400)
        }
    }

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1)
    }

    // Get images for current page
    const getCurrentPageImages = (pageIndex) => {
        const startIndex = pageIndex * 2
        return {
            front: processedImages[startIndex] || null,
            back: processedImages[startIndex + 1] || null
        }
    }

    // Handle keyboard navigation
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
    }, [currentPage, isFlipping])

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

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-full">
            {/* Book Container */}
            <div className="relative perspective-1000 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Responsive Book Size - Optimized for screen fit */}
                    <div className="relative w-80 h-[22rem] sm:w-96 sm:h-[26rem] md:w-[28rem] md:h-[30rem] lg:w-[32rem] lg:h-[34rem] max-w-[90vw] max-h-[60vh]">
                        {/* Book Cover/Base */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 book-shadow rounded-lg">
                            {/* Book spine effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 book-spine rounded-l-lg" />
                            <div className="absolute right-0 top-0 bottom-0 w-2 book-spine rounded-r-lg" />
                        </div>

                        {/* Pages Stack Effect (background pages) */}
                        <div className="absolute inset-1 bg-white rounded-md shadow-inner">
                            <div className="absolute inset-1 bg-gray-50 rounded-sm opacity-50" />
                            <div className="absolute inset-2 bg-gray-100 rounded-sm opacity-30" />
                        </div>

                        {/* Render all pages */}
                        {Array.from({ length: totalPages }, (_, pageIndex) => {
                            const { front, back } = getCurrentPageImages(pageIndex)
                            const isPageFlipped = flippedPages.has(pageIndex)

                            // Calculate z-index properly
                            let zIndex = totalPages - pageIndex
                            if (isPageFlipped) {
                                zIndex = pageIndex + 1
                            }

                            return (
                                <FlipPage
                                    key={pageIndex}
                                    frontImage={front}
                                    backImage={back}
                                    isFlipping={false}
                                    isFlipped={isPageFlipped}
                                    zIndex={zIndex}
                                    isActive={pageIndex === currentPage}
                                    onImageLoad={handleImageLoad}
                                    pageNumber={pageIndex + 1}
                                />
                            )
                        })}

                        {/* Book depth shadow */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-4 bg-black/20 blur-lg rounded-full scale-95" />
                    </div>
                </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between w-full max-w-lg px-4 mb-4">
                {/* Previous Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    disabled={currentPage === 0 || isFlipping}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                </motion.button>

                {/* Page Indicator */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="text-white/90 text-lg font-semibold">
                        Page {currentPage + 1} of {totalPages}
                    </div>

                    {/* Progress dots */}
                    <div className="flex space-x-2">
                        {Array.from({ length: Math.min(totalPages, 6) }, (_, index) => {
                            const pageIndex = totalPages <= 6 ? index :
                                currentPage < 3 ? index :
                                    currentPage > totalPages - 4 ? totalPages - 6 + index :
                                        currentPage - 2 + index

                            return (
                                <motion.div
                                    key={pageIndex}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${pageIndex === currentPage ? 'bg-white scale-125' : 'bg-white/40'
                                        }`}
                                    whileHover={{ scale: 1.3 }}
                                />
                            )
                        })}
                    </div>
                </div>

                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1 || isFlipping}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-all duration-200 shadow-lg"
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </div>
        </div>
    )
}

export default FlipBook