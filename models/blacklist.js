'use strict';
const { Model } = require('sequelize');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {
    class BlackList extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    BlackList.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        token: DataTypes.STRING(512)
    }, {
        sequelize,
        timestamps: true,
        modelName: 'BlackList',
        associate: (models) => {
            BlackList.belongsTo(models.User);
        }
    });

    return BlackList;
};