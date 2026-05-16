export interface RunInput {
    date?: string
    distance: number | string
    duration: number | string
    notes?: string
}

export const validateRun = ({ distance, duration }: RunInput): string | null => {
    const distanceNum = parseFloat(String(distance))
    const durationNum = parseInt(String(duration))

    if (!distance || !duration) return 'Distance and duration are required'
    if (isNaN(distanceNum) || distanceNum <= 0 || distanceNum > 100) return 'Distance must be between 0 and 100km'
    if (isNaN(durationNum) || durationNum <= 0) return 'Duration must be a positive number'
    if (durationNum / distanceNum < 173) return 'Pace is unrealistically fast'

    return null
}
