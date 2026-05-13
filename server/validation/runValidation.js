// TODO: note to self - this is a good candidate for a type interface. Maybe if I migrate this to typescript this is a good starting point

// server/validation/runValidation.js
const validateRun = ({ distance, duration }) => {
    const distanceNum = parseFloat(distance)
    const durationNum = parseInt(duration)

    if (!distance || !duration) return 'Distance and duration are required'
    if (isNaN(distanceNum) || distanceNum <= 0 || distanceNum > 100) return 'Distance must be between 0 and 100km'
    if (isNaN(durationNum) || durationNum <= 0) return 'Duration must be a positive number'
    if (durationNum / distanceNum < 173) return 'Pace is unrealistically fast'

    return null // null = valid
}

module.exports = { validateRun }
