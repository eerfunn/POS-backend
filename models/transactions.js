"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Toko);
      this.hasMany(models.Pelanggan, {
        foreignKey: "TransactionId",
      });
    }
  }
  Products.init(
    {
      TokoId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      id: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );
  return Transactions;
};
