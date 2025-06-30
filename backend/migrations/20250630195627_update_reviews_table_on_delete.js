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
  return knex.schema.table('reviews', function(table) {
    table.dropForeign('course_id');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
  });
};
exports.down = function(knex) { /* Não precisa fazer nada no downgrade */ };