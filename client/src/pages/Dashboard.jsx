import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function Dashboard() {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [runs, setRuns] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [runsRes, statsRes] = await Promise.all([
                    api.get('/runs?limit=5'),
                    api.get('/runs/stats/summary')
                ])
                setRuns(runsRes.data.runs)
                setStats(statsRes.data.stats)
            } catch (err) {
                setError('Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleLogout = () => {
        logout()
        localStorage.removeItem('token')
        navigate('/login')
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const formatPace = (distance, duration) => {
        const paceSeconds = duration / distance
        const mins = Math.floor(paceSeconds / 60)
        const secs = Math.round(paceSeconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')} /km`
    }

    if (loading) return (
        <Layout>
            <p className="text-gray-400">Loading...</p>
        </Layout>
    )

    if (error) return (
        <Layout>
            <p className="text-red-400">{error}</p>
        </Layout>
    )

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                    Log out
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
                    {[
                        {label: 'Total Runs', value: stats.total_runs},
                        {label: 'Total Distance', value: `${parseFloat(stats.total_distance).toFixed(1)}km`},
                        {label: 'Longest Run', value: `${parseFloat(stats.longest_run).toFixed(1)}km`},
                        {label: 'Avg Distance', value: `${parseFloat(stats.avg_distance).toFixed(1)}km`},
                    ].map(stat => (
                        <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-orange-500">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent runs */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-white">Recent Runs</h2>
                    <button
                        onClick={() => navigate('/add-run')}
                        className="text-orange-500 hover:text-orange-400 text-sm transition-colors"
                    >
                        + Add run
                    </button>
                </div>

                {runs.length === 0 ? (
                    <p className="text-gray-400 px-6 py-8 text-center">No runs yet — add your first one</p>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {runs.map(run => (
                            <li key={run.id} className="px-6 py-4 flex justify-between items-center">
                                <div>
                                    <p>
                                        <button onClick={() => navigate(`/runs/${run.id}`)}>Edit Run</button>
                                    </p>
                                    <p className="text-white font-medium">
                                        {parseFloat(run.distance).toFixed(1)}km
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(run.date).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white">{formatDuration(run.duration)}</p>
                                    <p className="text-orange-500 text-sm">{formatPace(run.distance, run.duration)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    )
}
