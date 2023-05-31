"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Toko);
      this.hasMany(models.Products, {
        foreignKey: "CategoryId",
      });
    }
  }
  Categories.init(
    {
      name: DataTypes.STRING,
      TokoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Categories",
    }
  );
  return Categories;
};
