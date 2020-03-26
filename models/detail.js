const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const detail = sequelize.define('detail', {
        quest: { type: Sequelize.STRING(64), allowNull: true},
        favoriteColor: { type: Sequelize.STRING(32), allowNull: true}
    });
    return detail;
}