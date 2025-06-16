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
// File: backend/migrations/xxxx_add_image_and_content_to_courses.js

exports.up = function(knex) {
  return knex.schema.table('courses', function(table) {
    // Campo para a URL da imagem de capa do curso
    table.string('course_image_url');

    // Campo para o conteúdo principal do curso, pode ser um texto longo
    table.text('content'); 
  });
};

exports.down = function(knex) {
  return knex.schema.table('courses', function(table) {
    table.dropColumn('course_image_url');
    table.dropColumn('content');
  });
};