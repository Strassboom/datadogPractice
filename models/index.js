module.exports = (sequelize) => {
    const person = require('./person')(sequelize);
    const detail = require('./detail')(sequelize);

    return {
        person,
        detail
    }
}