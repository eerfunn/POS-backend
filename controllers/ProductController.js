const { Product, Profile, Category, Toko } = require("../models");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "TokoId",
        "CategoryId",
        "image",
        "name",
        "price",
        "g_price",
        "stock",
        "description",
        "barcode",
      ],
      include: {
        model: Toko,
        required: true,
        attributes: ["id", "name"],
      },
      include: {
        model: Category,
        required: true,
        attributes: ["id", "name"],
      },
    });
    res.status(200).json({
      message: "Success get all products",
      statusCode: 200,
      data: products,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({
      attributes: [
        "id",
        "TokoId",
        "CategoryId",
        "image",
        "name",
        "price",
        "g_price",
        "stock",
        "description",
        "barcode",
      ],
      include: {
        model: Toko,
        required: true,
        attributes: ["id", "name"],
      },
      include: {
        model: Category,
        required: true,
        attributes: ["id", "name"],
      },
      where: {
        id: productId,
      },
    });
    res.status(200).json({
      message: "Success get product",
      statusCode: 200,
      data: product,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getProductByCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findOne({
      attributes: ["id", "name"],
      where: { id: categoryId },
    });
    if (!category || category == "") {
      res.status(404).json({
        message: "Category does not exist",
        statusCode: 404,
      });
    } else {
      const product = await Product.findAll({
        attributes: [
          "id",
          "TokoId",
          "CategoryId",
          "image",
          "name",
          "price",
          "g_price",
          "stock",
          "description",
          "barcode",
        ],
        where: { CategoryId: categoryId },
      });
      res.status(200).json({
        message: "Success get product from Category " + category.name,
        statusCode: 200,
        data: product,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getProductByToko = async (req, res) => {
  const tokoId = req.params.id;
  try {
    const toko = await Toko.findOne({
      attributes: ["id", "name"],
      where: { id: tokoId },
    });
    if (!toko || toko == "") {
      res.status(404).json({
        message: "Toko does not exist",
        statusCode: 404,
      });
    } else {
      const product = await Product.findAll({
        attributes: [
          "id",
          "TokoId",
          "CategoryId",
          "image",
          "name",
          "price",
          "g_price",
          "stock",
          "description",
          "barcode",
        ],
        where: { TokoId: tokoId },
      });

      res.status(200).json({
        message: "Success get product from Toko " + toko.name,
        statusCode: 200,
        data: product,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const createProduct = async (req, res) => {
  const { name, description, CategoryId, price, stock, g_price, barcode } =
    req.body;
  const userId = req.user.userId;
  const image = req.body.file;
  try {
    const profile = await getProfileByRequest(userId);
    const totalRecord = await Product.count({
      where: { TokoId: profile.activeToko },
    });
    console.log("count: ", totalRecord);
    if (totalRecord >= 100) {
      res.status(400).json({
        statusCode: 400,
        message: "Satu toko hanya dapat memiliki maksimal 100 produk",
      });
    } else {
      const TokoId = profile.activeToko;
      const product = await Product.create({
        TokoId,
        name,
        description,
        CategoryId,
        price,
        image,
        stock,
        g_price,
        barcode,
      });
      res.status(201).json({
        message: "Success create product",
        statusCode: 201,
        data: product,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, CategoryId, price, stock, g_price, barcode } =
    req.body;
  const image = req.body.file;
  try {
    const product = await Product.findOne({
      where: { id: productId },
    });
    const currUser = await Profile.findOne({
      where: { UserId: req.user.UserId },
    });
    if (!product || currUser.activeToko != product.TokoId) {
      res.status(401).json({
        message: "Cannot update product!",
        statusCode: 401,
      });
    } else {
      const updatedProduct = await Product.update({
        name,
        description,
        CategoryId,
        price,
        image,
        stock,
        g_price,
        barcode,
      });
      res.status(201).json({
        message: "Success update product",
        statusCode: 201,
        data: updatedProduct,
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      where: { id: productId },
    });
    const currUser = await Profile.findOne({
      where: { UserId: req.user.UserId },
    });
    if (!product || currUser.activeToko != product.TokoId) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized!",
      });
    } else {
      await Product.destroy({
        where: { id: productId },
      });
      res.status(204).end();
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getListCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.status(200).json({
      message: "Success get all Category",
      statusCode: 200,
      data: category,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getProfileByRequest = (id) => {
  return Profile.findOne({
    where: {
      UserId: id,
    },
  });
};

module.exports = {
  getAllProducts,
  getProduct,
  getProductByToko,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getListCategory,
};
