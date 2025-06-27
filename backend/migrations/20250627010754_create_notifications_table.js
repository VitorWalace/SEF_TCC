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
// File: backend/migrations/xxxx_create_notifications_table.js

exports.up = function(knex) {
  return knex.schema.createTable('notifications', function(table) {
    table.increments('id').primary();

    // O usuário que VAI RECEBER a notificação
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    // O tipo de notificação (ex: 'new_review', 'new_follower')
    table.string('type').notNullable();

    // A mensagem da notificação
    table.text('message').notNullable();

    // Para saber se o usuário já leu a notificação
    table.boolean('is_read').notNullable().defaultTo(false);

    // Link para onde o usuário deve ir ao clicar na notificação (opcional)
    table.string('link_to'); 

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};