const { Toko, Product, Profile, Transaction } = require("../models");

const getAllToko = async (req, res) => {
  try {
    const toko = await Toko.findAll({
      attributes: ["id", "image", "name", "description", "address", "contact"],
      include: {
        model: Profile,
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
  const tokoId = req.params.id;
  try {
    const toko = await Toko.findOne({
      attributes: ["id", "image", "name", "description", "address", "contact"],
      include: {
        model: Profile,
        required: true,
        attributes: ["name"],
      },
      where: {
        id: tokoId,
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

const getTokoOwner = async (req, res) => {
  const tokoId = req.params.id;
  try {
    const toko = await Toko.findOne({
      where: { id: tokoId },
    });
    console.log("Toko is:", toko);
    if (!toko || toko == "") {
      res.status(404).json({
        message: "Toko does not exist",
        statusCode: 404,
      });
    } else {
      const profile = await Profile.findOne({
        where: { id: toko.ProfileId },
      });
      res.status(200).json({
        message: "Success get toko owner for " + toko.name,
        statusCode: 200,
        data: profile,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getOwnedToko = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Profile.findOne({
      where: { id: userId },
    });
    console.log("User is:", user);
    if (!user || user == "") {
      res.status(404).json({
        message: "User does not exist",
        statusCode: 404,
      });
    } else {
      const TheirTokos = await Toko.findAll({
        where: { ProfileId: user.id },
      });
      res.status(200).json({
        message: "Success get toko owned by " + user.name,
        statusCode: 200,
        data: TheirTokos,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
const createToko = async (req, res) => {
  const { name, description, contact, address } = req.body;
  console.log("The Request Body: ", req.body);
  const userId = req.user.userId;
  const image = req.body.file;
  try {
    const profile = await getProfileByRequest(userId);
    const ProfileId = profile.id;
    const totalRecord = await Toko.count({
      where: { ProfileId: ProfileId },
    });
    if (totalRecord >= 4) {
      res.status(400).json({
        statusCode: 400,
        message: "Jumlah toko yang dimiliki maksimal 4",
      });
    } else {
      const tokoCreate = await Toko.create({
        ProfileId,
        name,
        description,
        contact,
        address,
        image,
      });
      res.status(201).json({
        message: "Success create toko",
        statusCode: 201,
        data: tokoCreate,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateToko = async (req, res) => {
  const TokoId = req.params.id;
  const { name, description, contact, address } = req.body;
  const image = req.body.file;
  try {
    if (!name || !address || !description || !contact) {
      res.status(400);
      return res.json({
        status: 400,
        message: "Please fill in each input field!",
      });
    }
    const findToko = await Toko.findOne({
      where: {
        id: TokoId,
      },
    });
    console.log("Toko ID:", TokoId);
    console.log("FInd TOkko:", findToko);
    if (!req.user.role == "owner" && req.user.userId != findToko.ProfileId) {
      res.status(403);
      return res.json({
        message: "Cannot update Toko!",
        statusCode: 403,
      });
    } else {
      await Toko.update(
        {
          name,
          description,
          contact,
          address,
          image,
        },
        { where: { id: findToko.id } }
      );
      const afterUpdate = await Toko.findOne({ where: { id: TokoId } });
      res.status(200).json({
        message: "Success update Toko!",
        statusCode: 200,
        data: afterUpdate,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const deleteToko = async (req, res) => {
  try {
    const TokoId = req.params.id;
    const findToko = await Toko.findOne({
      where: {
        id: TokoId,
      },
    });
    if (!req.user.role == "owner" && req.user.userId != findToko.ProfileId) {
      res.status(403);
      return res.json({
        message: "Cannot update Toko!",
        statusCode: 403,
      });
    } else {
      await Toko.destroy({
        where: { id: TokoId },
      });
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({
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
  getAllToko,
  getTokoById,
  getTokoOwner,
  getOwnedToko,
  createToko,
  updateToko,
  deleteToko,
  getProfileByRequest,
};
