"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pelanggan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transactions);
    }
  }
  Pelanggan.init(
    {
      TransactionId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pelanggan",
    }
  );
  return Pelanggan;
};
