module.exports = (sequelize) => {
    const person = require('./person')(sequelize);
    const detail = require('./detail')(sequelize);
    const login = require('./login')(sequelize);

    person.belongsTo(login, {foreignKey: 'id'});
    return {
        person,
        detail,
        login
    }
}