module.exports = (sequelize) => {
    const person = require('./person')(sequelize);

    return {
        person
    }
}