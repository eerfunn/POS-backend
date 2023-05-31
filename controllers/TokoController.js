const { Toko, Products, Users } = require("../models");

const getAllToko = async (req, res) => {
  try {
    const toko = await Toko.findAll({
      attributes: [
        "id",
        "image",
        "name",
        "description",
        "address",
        "category",
        "contact",
      ],
      include: {
        model: Profiles,
        required: true,
        attributes: ["name"],
      },
    });
    res.status(200);
    return res.json({
      message: "Success get all toko",
      statusCode: 200,
      data: toko,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
const getTokoById = async (req, res) => {
  const userId = req.params.id;
  try {
    const toko = await Toko.findOne({
      attributes: [
        "id",
        "image",
        "name",
        "description",
        "address",
        "category",
        "contact",
      ],
      include: {
        model: Profiles,
        required: true,
        attributes: ["name"],
      },
      where: {
        id: id,
      },
    });
    if (!toko) {
      res.status(404);
      return res.json({
        message: "Toko does not exist",
        statusCode: 404,
      });
    } else {
      res.status(200);
      return res.json({
        message: "Success get toko",
        statusCode: 200,
        data: toko,
      });
    }
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
