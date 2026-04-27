import { useEffect, useState } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts'

export default function Stats() {
    const [runs, setRuns] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [runsRes, statsRes] = await Promise.all([
                    api.get('/runs'),
                    api.get('/runs/stats/summary')
                ])

                // Reverse so charts show oldest to newest left to right
                const sorted = [...runsRes.data.runs].reverse()

                const chartData = sorted.map((run, index) => ({
                    run: index + 1,
                    distance: parseFloat(parseFloat(run.distance).toFixed(2)),
                    pace: parseFloat((run.duration / 60 / run.distance).toFixed(2)),
                    date: new Date(run.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                    })
                }))

                setRuns(chartData)
                setStats(statsRes.data.stats)
            } catch (err) {
                setError('Failed to load stats')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <Layout><p className="text-gray-400">Loading...</p></Layout>
    if (error) return <Layout><p className="text-red-400">{error}</p></Layout>

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Stats</h1>
                <p className="text-gray-400 mt-1">Your running progress over time</p>
            </div>

            {/* Summary cards */}
            {stats && (
                <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
                    {[
                        { label: 'Total Runs', value: stats.total_runs },
                        { label: 'Total Distance', value: `${parseFloat(stats.total_distance).toFixed(1)}km` },
                        { label: 'Longest Run', value: `${parseFloat(stats.longest_run).toFixed(1)}km` },
                        { label: 'Avg Distance', value: `${parseFloat(stats.avg_distance).toFixed(1)}km` },
                    ].map(stat => (
                        <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-orange-500">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Distance chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
                <h2 className="text-white font-semibold mb-6">Distance per Run (km)</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={runs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Bar dataKey="distance" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pace chart */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-white font-semibold mb-6">Pace per Run (min/km)</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={runs}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111827',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pace"
                            stroke="#f97316"
                            strokeWidth={2}
                            dot={{ fill: '#f97316', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Layout>
    )
}
