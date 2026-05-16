import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('shoes', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid())
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.string('name').notNullable()
        table.string('brand').nullable()
        table.text('notes').nullable()
        table.boolean('is_retired').notNullable().defaultTo(false)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('shoes')
}
