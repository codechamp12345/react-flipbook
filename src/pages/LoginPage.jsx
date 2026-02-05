import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { validateAlbum } from '../firebase/albumService'
import { isValidQRCode, formatQRInput } from '../utils/validateQR'
import Loader from '../components/Loader'

function LoginPage() {
    const [qrCode, setQrCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const formatted = formatQRInput(e.target.value)
        setQrCode(formatted)
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isValidQRCode(qrCode)) {
            setError('Please enter a valid 6-digit album code')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const isValid = await validateAlbum(qrCode)

            if (isValid) {
                navigate(`/album/${qrCode}`)
            } else {
                setError('Album not found. Please check your code and try again.')
            }
        } catch (err) {
            console.error('Validation error:', err)
            setError('Unable to connect. Please check your internet connection.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {isLoading && <Loader message="Validating album code..." />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Glassmorphism Card */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8">
                    {/* Logo/Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Digital Memory Album
                        </h1>
                        <p className="text-white/70 text-lg">
                            Enter your 6-digit album code to access your memories
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Input Field */}
                        <div>
                            <label htmlFor="qrCode" className="block text-white/80 text-sm font-medium mb-2">
                                Album Code
                            </label>
                            <input
                                id="qrCode"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={qrCode}
                                onChange={handleInputChange}
                                placeholder="000000"
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-3"
                            >
                                <p className="text-red-200 text-sm text-center">{error}</p>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!isValidQRCode(qrCode) || isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <span>✨ Access Album</span>
                        </motion.button>
                    </motion.form>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-white/50 text-sm">
                            Need help? Contact your album creator
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage