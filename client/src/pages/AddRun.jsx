import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function AddRun() {
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0]

    const [form, setForm] = useState({
        date: today,
        distance: '',
        duration_minutes: '',
        duration_seconds: '',
        notes: ''
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // Convert minutes and seconds to total seconds
        const duration =
            parseInt(form.duration_minutes || 0) * 60 +
            parseInt(form.duration_seconds || 0)

        if (duration === 0) {
            setError('Please enter a valid duration')
            setLoading(false)
            return
        }

        try {
            await api.post('/runs', {
                date: form.date,
                distance: parseFloat(form.distance),
                duration,
                notes: form.notes
            })

            navigate('/dashboard')

        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-white">Log a Run</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    {/* Distance */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Distance (km)
                        </label>
                        <input
                            type="number"
                            name="distance"
                            value={form.distance}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="5.00"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Duration
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    name="duration_minutes"
                                    value={form.duration_minutes}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="32"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                                />
                                <p className="text-gray-500 text-xs mt-1">minutes</p>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    name="duration_seconds"
                                    value={form.duration_seconds}
                                    onChange={handleChange}
                                    min="0"
                                    max="59"
                                    placeholder="30"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                                />
                                <p className="text-gray-500 text-xs mt-1">seconds</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Notes <span className="text-gray-500">(optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="How did it feel?"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        {loading ? 'Saving...' : 'Save Run'}
                    </button>

                </form>
            </div>
        </Layout>
    )
}
