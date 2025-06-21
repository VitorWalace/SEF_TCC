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
// File: backend/migrations/xxxx_create_questions_table.js

exports.up = function(knex) {
  return knex.schema.createTable('questions', function(table) {
    table.increments('id').primary();

    // O corpo ou título da pergunta
    table.string('title').notNullable();

    // Chave estrangeira para o curso ao qual a pergunta pertence
    table.integer('course_id').unsigned().notNullable().references('id').inTable('courses').onDelete('CASCADE');

    // Chave estrangeira para o usuário que fez a pergunta
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions');
};