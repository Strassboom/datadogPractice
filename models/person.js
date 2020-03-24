const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const person = sequelize.define('person', {
        //id: { type: Sequelize.STRING(14), allowNull: false, primaryKey: true},
        name: { type: Sequelize.STRING(64), allowNull: true}
    });
    return person;
}