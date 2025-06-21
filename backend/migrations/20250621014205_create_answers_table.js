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
// File: backend/migrations/xxxx_create_answers_table.js

exports.up = function(knex) {
  return knex.schema.createTable('answers', function(table) {
    table.increments('id').primary();

    // O corpo da resposta
    table.text('body').notNullable();

    // Chave estrangeira para a pergunta que está sendo respondida
    table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');

    // Chave estrangeira para o usuário que deu a resposta
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('answers');
};