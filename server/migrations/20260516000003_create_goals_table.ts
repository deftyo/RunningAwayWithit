import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('goals', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid())
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.string('type').notNullable().comment('e.g. distance, runs_count')
        table.decimal('target', 8, 2).notNullable()
        table.string('period').notNullable().comment('e.g. weekly, monthly, all_time')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('goals')
}
