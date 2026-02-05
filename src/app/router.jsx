import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LoginPage from '../pages/LoginPage'
import AlbumPage from '../pages/AlbumPage'

function AppRouter() {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/album/:qrCode" element={<AlbumPage />} />
            </Routes>
        </AnimatePresence>
    )
}

export default AppRouter