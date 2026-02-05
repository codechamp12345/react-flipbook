import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Header({ qrCode, onFullscreen }) {
    const navigate = useNavigate()

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline font-medium">Back</span>
                    </motion.button>

                    {/* Album Title */}
                    <div className="flex flex-col items-center">
                        <h1 className="text-white font-semibold text-lg">Digital Memory Album</h1>
                        {qrCode && (
                            <span className="text-white/60 text-sm font-mono">#{qrCode}</span>
                        )}
                    </div>

                    {/* Fullscreen Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onFullscreen}
                        className="text-white/80 hover:text-white transition-colors p-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.header>
    )
}

export default Header