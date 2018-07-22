var randomstring = require("randomstring");
module.exports = function (sequelize, DataTypes) {
    var Achievement = sequelize.define("Achievement", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        description: DataTypes.STRING,
        points: DataTypes.INTEGER,
        image: DataTypes.STRING
    }, {
        hooks: {},
        classMethods: {
            associate: function (models) {
                // Achievement.belongsTo(models.Game);
            }
        }
    });
    return Achievement;
};
