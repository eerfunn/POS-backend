const { Customer, Profile, Transaction } = require("../models");

// Not to use, I'll fix it after built Front End (If I ever built it LOL)
const getShopCustomer = async (req, res) => {
  try {
    const getActiveToko = await Profile.findOne({
      where: { UserId: req.user.userId },
    });
    const customer = await Customer.findAll({ where: { id: id } });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};
