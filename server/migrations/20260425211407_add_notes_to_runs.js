exports.up = function (knex) {
    return knex.schema.alterTable('runs', (table) => {
        table.text('notes').nullable()
    })
}

exports.down = function (knex) {
    return knex.schema.alterTable('runs', (table) => {
        table.dropColumn('notes')
    })
}
