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
  return knex.schema.createTable('conversations', function(table) {
    table.increments('id').primary();
    // Adiciona um campo para os participantes, que podemos usar no futuro
    table.timestamps(true, true);
  });
};
exports.down = function(knex) { return knex.schema.dropTable('conversations'); };