const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const login = sequelize.define('login', {
        personId: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
        username: { type: Sequelize.STRING(16), allowNull: false},
        password: { type: Sequelize.STRING(32), allowNull: false}
    });
    return login;
}