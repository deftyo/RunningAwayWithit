import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('runs', (table) => {
        table.bigInteger('strava_activity_id').nullable().unique()
        table.text('gps_polyline').nullable()
        table.jsonb('gps_stream').nullable()
        table.jsonb('elevation_stream').nullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('runs', (table) => {
        table.dropColumn('strava_activity_id')
        table.dropColumn('gps_polyline')
        table.dropColumn('gps_stream')
        table.dropColumn('elevation_stream')
    })
}
