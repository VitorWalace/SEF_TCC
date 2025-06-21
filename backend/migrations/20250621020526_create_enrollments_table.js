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
// File: backend/migrations/xxxx_create_enrollments_table.js

exports.up = function(knex) {
  return knex.schema.createTable('enrollments', function(table) {
    table.increments('id').primary();

    // Chave estrangeira para o usuário que se inscreveu.
    // Se o usuário for deletado, a inscrição é removida.
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    // Chave estrangeira para o curso no qual o usuário se inscreveu.
    // Se o curso for deletado, a inscrição também é.
    table.integer('course_id').unsigned().notNullable().references('id').inTable('courses').onDelete('CASCADE');

    table.timestamps(true, true);

    // Garante que um usuário não possa se inscrever no mesmo curso mais de uma vez.
    table.unique(['user_id', 'course_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enrollments');
};