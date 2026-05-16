import { Knex } from 'knex'

exports.up = function(knex: Knex) {
    return knex.schema.alterTable('users', (table) => {
        table.bigInteger('strava_athlete_id').nullable()
        table.text('strava_access_token').nullable()
        table.text('strava_refresh_token').nullable()
        table.timestamp('strava_token_expires_at').nullable()
    })
}

exports.down = function(knex: Knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('strava_athlete_id')
        table.dropColumn('strava_access_token')
        table.dropColumn('strava_refresh_token')
        table.dropColumn('strava_token_expires_at')
    })
}
