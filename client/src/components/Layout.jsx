export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-orange-500 font-bold text-xl">
            Running Away With It
          </span>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}
