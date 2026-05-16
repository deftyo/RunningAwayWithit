import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('runs', (table) => {
        table.uuid('shoe_id').nullable().references('id').inTable('shoes').onDelete('SET NULL')
        table.uuid('route_id').nullable().references('id').inTable('routes').onDelete('SET NULL')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('runs', (table) => {
        table.dropColumn('shoe_id')
        table.dropColumn('route_id')
    })
}
