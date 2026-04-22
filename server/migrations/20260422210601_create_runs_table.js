exports.up = function (knex) {
    return knex.schema.createTable('runs', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid())
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
        table.date('date').notNullable().defaultTo(knex.fn.now())
        table.decimal('distance', 8, 2).notNullable()
        table.integer('duration').notNullable().comment('Duration in seconds')
        table.decimal('avg_pace', 8, 2)
        table.timestamps(true, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('runs')
}
