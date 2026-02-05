import { motion } from 'framer-motion'

function Loader({ message = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/30"
            >
                <div className="flex flex-col items-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
                    />
                    <p className="text-white font-medium text-lg">{message}</p>
                </div>
            </motion.div>
        </div>
    )
}

export default Loader