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
// File: backend/migrations/xxxx_create_reviews_table.js

exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id').primary();

    // A nota que o usuário deu, de 1 a 5.
    table.integer('rating').notNullable();

    // O comentário escrito pelo usuário.
    table.text('comment');

    // Chave estrangeira para o curso que está sendo avaliado.
    // Se o curso for deletado, a avaliação também será.
    table.integer('course_id').unsigned().notNullable().references('id').inTable('courses').onDelete('CASCADE');

    // Chave estrangeira para o usuário que fez a avaliação.
    // Se o usuário for deletado, a avaliação também será.
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

    table.timestamps(true, true);

    // Impede que um mesmo usuário avalie o mesmo curso mais de uma vez.
    table.unique(['course_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};