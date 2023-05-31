"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Toko);

      this.belongsTo(models.Categories);

      this.hasMany(models.Transactions, {
        foreignKey: "ProductId",
      });
    }
  }
  Products.init(
    {
      tokoId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      g_price: DataTypes.INTEGER,
      barcode: DataTypes.STRING,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
