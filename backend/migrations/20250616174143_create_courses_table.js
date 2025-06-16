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
// File: backend/migrations/xxxx_create_courses_table.js

exports.up = function(knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable(); // Título do curso
    table.text('description'); // Descrição do curso

    // Chave estrangeira para o instrutor (um usuário)
    table.integer('instructor_id').unsigned().references('id').inTable('users');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('courses');
};