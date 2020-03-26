const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const login = sequelize.define('login', {
        username: { type: Sequelize.STRING(16), allowNull: false},
        password: { type: Sequelize.STRING(32), allowNull: false}
    });
    return login;
}