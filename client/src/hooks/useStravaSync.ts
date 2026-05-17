import api from '../api/axios'

const RETRY_LIMIT = 3
const RETRY_DELAY_MS = 1000

interface SyncOptions {
    silent409?: boolean
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useStravaSync() {
    const sync = async (options: SyncOptions = { silent409: true }) => {
        let attempts = 0

        while (attempts < RETRY_LIMIT) {
            try {
                await api.get('/strava/import-latest')
                // 201 - new run imported successfully
                console.info('[Strava] New run imported')
                return
            } catch (err: any) {
                const status = err?.response?.status

                if (status === 409) {
                    // Already up to date — not a real failure
                    if (!options.silent409) {
                        console.info('[Strava] Already up to date')
                        // TODO: dispatch toast({ message: 'Already up to date', type: 'info' })
                    }
                    return
                }

                if (status === 401) {
                    // Strava not connected — no point retrying
                    console.warn('[Strava] Not connected — skipping sync')
                    // TODO: dispatch toast({ message: 'Strava not connected. Reconnect in settings.', type: 'warning' })
                    return
                }

                attempts++

                if (attempts < RETRY_LIMIT) {
                    console.warn(`[Strava] Sync failed, retrying (${attempts}/${RETRY_LIMIT - 1})...`)
                    await delay(RETRY_DELAY_MS)
                }
            }
        }

        // All retries exhausted
        console.warn('[Strava] Sync failed after 3 attempts')
        // TODO: dispatch toast({ message: 'Strava sync failed. Check your connection.', type: 'error' })
    }

    return { sync }
}
