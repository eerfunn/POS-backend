"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product);
      this.belongsTo(models.Toko);
      this.hasOne(models.Customer);
    }
  }
  Transaction.init(
    {
      TokoId: DataTypes.INTEGER,
      ProductId: DataTypes.STRING,
      notes: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
