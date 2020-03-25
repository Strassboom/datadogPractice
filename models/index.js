module.exports = (sequelize) => {
    const person = require('./person')(sequelize);
    const detail = require('./detail')(sequelize);
    const login = require('./login')(sequelize);

    login.belongsTo(person, {foreignKey: 'personId'});
    return {
        person,
        detail,
        login
    }
}