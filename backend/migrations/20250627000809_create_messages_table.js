/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
exports.up = function(knex) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary();
    table.text('body').notNullable();

    // IDs do remetente e do destinatário
    table.integer('sender_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('recipient_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    // Referência à conversa (opcional por agora, mas bom ter)
    // table.integer('conversation_id').unsigned().notNullable().references('id').inTable('conversations').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};
exports.down = function(knex) { return knex.schema.dropTable('messages'); };