import { motion } from 'framer-motion'
import { useState } from 'react'

function FlipPage({
    frontImage,
    backImage,
    isFlipping,
    zIndex,
    isActive,
    onImageLoad,
    pageNumber,
    isFlipped
}) {
    const [frontLoaded, setFrontLoaded] = useState(false)
    const [backLoaded, setBackLoaded] = useState(false)

    const handleFrontLoad = () => {
        setFrontLoaded(true)
        onImageLoad?.()
    }

    const handleBackLoad = () => {
        setBackLoaded(true)
        onImageLoad?.()
    }

    return (
        <div
            className="absolute inset-0 preserve-3d"
            style={{
                zIndex,
                transformOrigin: 'left center',
                transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
                transition: 'transform 0.8s ease-in-out'
            }}
        >
            {/* Front Side (Right Page) */}
            <div className="absolute inset-0 backface-hidden bg-white page-shadow rounded-r-lg overflow-hidden border-l-2 border-gray-200">
                {/* Page binding */}
                <div className="absolute left-0 top-0 bottom-0 w-1 book-spine" />

                {/* Content area */}
                <div className="h-full pl-3 pr-4 py-4 flex flex-col">
                    {/* Image container */}
                    <div className="flex-1 relative bg-gray-50 rounded-md overflow-hidden">
                        {frontImage ? (
                            <div className="relative w-full h-full">
                                {!frontLoaded && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <img
                                    src={frontImage.url}
                                    alt={frontImage.alt}
                                    onLoad={handleFrontLoad}
                                    className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${frontLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                                <p className="text-gray-400 text-xs">Empty page</p>
                            </div>
                        )}
                    </div>

                    {/* Page number */}
                    <div className="text-center mt-2">
                        <span className="text-xs text-gray-500 font-mono">{pageNumber * 2}</span>
                    </div>
                </div>
            </div>

            {/* Back Side (Left Page when flipped) */}
            <div
                className="absolute inset-0 backface-hidden bg-white page-shadow rounded-l-lg overflow-hidden border-r-2 border-gray-200"
                style={{ transform: 'rotateY(180deg)' }}
            >
                {/* Page binding */}
                <div className="absolute right-0 top-0 bottom-0 w-1 book-spine" />

                {/* Content area */}
                <div className="h-full pl-4 pr-3 py-4 flex flex-col">
                    {/* Image containr */}
                    <div className="flex-1 relative bg-gray-50 rounded-md overflow-hidden">
                        {backImage ? (
                            <div className="relative w-full h-full">
                                {!backLoaded && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <img
                                    src={backImage.url}
                                    alt={backImage.alt}
                                    onLoad={handleBackLoad}
                                    className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${backLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                                <p className="text-gray-400 text-xs">Empty page</p>
                            </div>
                        )}
                    </div>

                    {/* Page numbe */}
                    <div className="text-center mt-2">
                        <span className="text-xs text-gray-500 font-mono">{pageNumber * 2 - 1}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlipPage