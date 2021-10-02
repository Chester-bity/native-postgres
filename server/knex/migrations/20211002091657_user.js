
exports.up = function (knex) {
    return  knex.schema.createTable('user', function (table) {
        table.increments('id').primary();
        table.string('first_name');
        table.string('last_name')
        table.string('nickname');
        table.string('phone_no');
        table.string('phone_type');
        table.string('email');
    })
};

exports.down = function (knex) {
    return  knex.schema.dropTable('user')
};
