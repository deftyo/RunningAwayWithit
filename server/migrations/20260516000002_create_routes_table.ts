import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('routes', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid())
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.string('name').notNullable()
        table.text('notes').nullable()
        // GPS fields to be added in Phase 2
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('routes')
}
