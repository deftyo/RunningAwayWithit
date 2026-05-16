import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'
import RunForm from '../components/Forms/RunForm.jsx'
import RunMap from '../components/RunMap'

export default function EditRun() {
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0]
    const { id } = useParams()

    const [form, setForm] = useState({
        date: today,
        distance: '',
        duration_minutes: '',
        duration_seconds: '',
        notes: ''
    })
    const [gpsStream, setGpsStream] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await api.get(`/runs/${id}`)
            const run = res.data.run
            setForm({
                date: new Date(run.date).toISOString().split('T')[0],
                distance: run.distance.toString(),
                duration_minutes: Math.floor(run.duration / 60).toString(),
                duration_seconds: (run.duration % 60).toString(),
                notes: run.notes ?? ''
            })
            // gps_stream comes back as parsed JSON from jsonb column
            if (run.gps_stream) {
                setGpsStream(run.gps_stream)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const duration =
            parseInt(form.duration_minutes || 0) * 60 +
            parseInt(form.duration_seconds || 0)

        if (duration === 0) {
            setError('Please enter a valid duration')
            setLoading(false)
            return
        }

        try {
            await api.put(`/runs/${id}`, {
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this run?')) return
        try {
            await api.delete(`/runs/${id}`)
            navigate('/dashboard')
        } catch (err) {
            setError('Failed to delete run: ' + err)
        }
    }

    return (
        <Layout>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-white">Edit Run</h1>
                </div>

                {gpsStream && (
                    <div className="mb-6">
                        <RunMap stream={gpsStream} />
                    </div>
                )}

                <RunForm
                    onSubmit={handleSubmit}
                    initialValues={form}
                    handleChange={handleChange}
                    error={error}
                    loading={loading}
                />

                <button
                    className="w-full disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer bg-red-500 hover:bg-red-800 mt-1"
                    onClick={handleDelete}
                >
                    Delete Run
                </button>
            </div>
        </Layout>
    )
}
