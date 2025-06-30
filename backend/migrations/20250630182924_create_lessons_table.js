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
// File: backend/migrations/xxxx_create_lessons_table.js

exports.up = function(knex) {
  return knex.schema.createTable('lessons', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content'); // O conteúdo da aula (texto, vídeo, etc.)

    // Chave estrangeira que conecta a aula ao módulo
    table.integer('module_id').unsigned().notNullable().references('id').inTable('modules').onDelete('CASCADE');

    // Para definir a ordem das aulas dentro de um módulo
    table.integer('order').notNullable(); 
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lessons');
};