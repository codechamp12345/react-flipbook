import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAlbumImages } from '../firebase/albumService'
import { isValidQRCode } from '../utils/validateQR'
import Header from '../components/Header'
import FlipBook from '../components/FlipBook/FlipBook'
import Loader from '../components/Loader'

function AlbumPage() {
    const { qrCode } = useParams()
    const navigate = useNavigate()
    const [images, setImages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        // Validate QR code format
        if (!isValidQRCode(qrCode)) {
            navigate('/')
            return
        }

        loadAlbumImages()
    }, [qrCode, navigate])

    const loadAlbumImages = async () => {
        setIsLoading(true)
        setError('')

        try {
            const albumImages = await fetchAlbumImages(qrCode)

            if (albumImages.length === 0) {
                setError('This album is empty')
            } else {
                setImages(albumImages)
            }
        } catch (err) {
            console.error('Error loading album:', err)
            if (err.message === 'Album not found') {
                setError('Album not found. Please check your code and try again.')
            } else {
                setError('Unable to load album. Please check your internet connection.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen?.()
            setIsFullscreen(false)
        }
    }

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    if (isLoading) {
        return <Loader message="Loading your album..." />
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <Header qrCode={qrCode} onFullscreen={handleFullscreen} />

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center pt-16">
                {error ? (
                    /* Error State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center px-4"
                    >
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/30 max-w-md">
                            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Oops!</h2>
                            <p className="text-white/80 mb-6">{error}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Try Another Code
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    /* Album Content - Centered */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center justify-center w-full h-full p-4"
                    >
                        <FlipBook images={images} />
                    </motion.div>
                )}
            </main>
        </div>
    )
}

export default AlbumPage