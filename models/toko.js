"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Toko extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.User);
      this.belongsTo(models.Profile);
      this.hasMany(models.Transaction, {
        foreignKey: "TokoId",
      });
    }
  }
  Toko.init(
    {
      ProfileId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      address: DataTypes.STRING,
      contact: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Toko",
    }
  );
  return Toko;
};
