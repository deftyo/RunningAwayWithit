import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
    const { user, logout } = useAuth()
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

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome back {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>

            <h2>Your Stats</h2>
            {stats && (
                <div>
                    <p>Total runs: {stats.total_runs}</p>
                    <p>Total distance: {parseFloat(stats.total_distance).toFixed(2)}km</p>
                    <p>Longest run: {parseFloat(stats.longest_run).toFixed(2)}km</p>
                    <p>Average distance: {parseFloat(stats.avg_distance).toFixed(2)}km</p>
                </div>
            )}

            <h2>Recent Runs</h2>
            {runs.length === 0 ? (
                <p>No runs yet</p>
            ) : (
                <ul>
                    {runs.map(run => (
                        <li key={run.id}>
                            {new Date(run.date).toLocaleDateString()} —
                            {parseFloat(run.distance).toFixed(2)}km —
                            {formatDuration(run.duration)} —
                            {formatPace(run.distance, run.duration)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
