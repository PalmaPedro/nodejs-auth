exports.seed = function (knex) {
    return knex('users').insert([
        { username: 'admin', password: '$2b$12$sgciYfp7yxRBaFENi/efvOFVmtldAy/evLy1vrvkzxHzEjL8zKAs2', email: 'admin@gmail.com', activation_code: ''},
    ]);
};