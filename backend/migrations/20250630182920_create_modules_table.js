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
// File: backend/migrations/xxxx_create_modules_table.js

exports.up = function(knex) {
  return knex.schema.createTable('modules', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();

    // Chave estrangeira que conecta o módulo ao curso
    table.integer('course_id').unsigned().notNullable().references('id').inTable('courses').onDelete('CASCADE');

    // Para definir a ordem dos módulos (Módulo 1, Módulo 2, etc.)
    table.integer('order').notNullable(); 
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('modules');
};