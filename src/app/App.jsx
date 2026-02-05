import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                <AppRouter />
            </div>
        </BrowserRouter>
    )
}

export default App