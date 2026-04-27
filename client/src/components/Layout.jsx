import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        localStorage.removeItem('token')
        navigate('/login')
    }

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Runs', path: '/archive' },
        { label: 'Stats', path: '/stats' },
    ]

    const isLoginPage = location.pathname === '/login'

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span
              onClick={() => navigate('/dashboard')}
              className="text-orange-500 font-bold text-xl cursor-pointer"
          >
            Running Away With It
          </span>

                    {!isLoginPage && (
                        <div className="flex items-center gap-6">
                            {navItems.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`text-sm font-medium transition-colors ${
                                        location.pathname === item.path
                                            ? 'text-orange-500'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}
