const { Customer, Profile, Transaction, Toko } = require("../models");

// Not to use, I'll fix it after built Front End (If I ever built it LOL)
const getShopCustomer = async (req, res) => {
  try {
    const getActiveToko = await Profile.findOne({
      where: { UserId: req.user.userId },
    });
    const customer = await Customer.findAll({
      where: { id: getActiveToko.ActiveToko },
    });
    res.status(200).json({
      status: 200,
      message: "Success get customer!",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getCustomer = async (req, res) => {
  const userId = req.params.id;
  try {
    const customer = await Customer.findOne({ where: { id: userId } });
    res.status(200).json({
      status: 200,
      message: "Success get customer data!",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error,
    });
  }
};
