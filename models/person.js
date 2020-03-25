const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const person = sequelize.define('person', {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: { type: Sequelize.STRING(64), allowNull: true}
    });
    return person;
}