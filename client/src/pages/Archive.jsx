import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function Archive() {
    const navigate = useNavigate()
    const [runs, setRuns] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')

    const fetchRuns = async (filterValue) => {
        setLoading(true)
        try {
            const params = filterValue === 'current' ? '?month=current' : ''
            const res = await api.get(`/runs${params}`)
            setRuns(res.data.runs)
        } catch (err) {
            setError('Failed to load runs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRuns(filter)
    }, [filter])

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

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">All Runs</h1>
                    <p className="text-gray-400 mt-1">{runs.length} runs total</p>
                </div>
                <button
                    onClick={() => navigate('/add-run')}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    + Add run
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { label: 'All time', value: 'all' },
                    { label: 'This month', value: 'current' },
                ].map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === tab.value
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Runs list */}
            <div className="bg-gray-900 rounded-xl border border-gray-800">
                {loading ? (
                    <p className="text-gray-400 px-6 py-8 text-center">Loading...</p>
                ) : error ? (
                    <p className="text-red-400 px-6 py-8 text-center">{error}</p>
                ) : runs.length === 0 ? (
                    <p className="text-gray-400 px-6 py-8 text-center">No runs found</p>
                ) : (
                    <ul className="divide-y divide-gray-800">
                        {runs.map(run => (
                            <li key={run.id} className="px-6 py-4 flex justify-between items-center">
                                <div>
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
                                    {run.notes && (
                                        <p className="text-gray-500 text-sm mt-1 italic">{run.notes}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-white">{formatDuration(run.duration)}</p>
                                    <p className="text-orange-500 text-sm">
                                        {formatPace(run.distance, run.duration)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    )
}
