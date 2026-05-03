export default function RunForm({ initialValues, onSubmit, handleChange, error, loading }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                </label>
                <input
                    type="date"
                    name="date"
                    value={initialValues.date}
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
                    value={initialValues.distance}
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
                            value={initialValues.duration_minutes}
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
                            value={initialValues.duration_seconds}
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
                    value={initialValues.notes}
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
    )
}
