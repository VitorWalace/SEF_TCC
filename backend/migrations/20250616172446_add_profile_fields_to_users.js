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
// File: backend/migrations/xxxx_add_profile_fields_to_users.js

exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    // Título do usuário, ex: "Desenvolvedor de Software"
    table.string('title');

    // Usamos 'text' para a biografia, que permite textos mais longos.
    table.text('bio');

    // URL para a imagem de avatar do usuário.
    table.string('avatarUrl');

    // Matérias que o usuário ensina.
    // Vamos guardar como um único texto com as matérias separadas por vírgula.
    // Ex: "Matemática,Física,Química"
    table.string('subjects'); 
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('title');
    table.dropColumn('bio');
    table.dropColumn('avatarUrl');
    table.dropColumn('subjects');
  });
};