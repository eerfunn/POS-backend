"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transactions);
      this.belongsTo(models.Toko);
    }
  }
  Reports.init(
    {
      id: DataTypes.INTEGER,
      jenis: DataTypes.INTEGER,
      barangId: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      address: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Reports",
    }
  );
  return Reports;
};
