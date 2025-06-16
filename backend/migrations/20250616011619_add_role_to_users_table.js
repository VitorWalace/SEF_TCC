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
// File: backend/migrations/xxxx_add_role_to_users_table.js

exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    // Adiciona a coluna 'role' do tipo texto.
    // notNullable() significa que não pode ser vazia.
    // defaultTo('user') define que todo novo usuário será 'user' por padrão.
    table.string('role').notNullable().defaultTo('user');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('role');
  });
};