const { Profiles, Products, Transaction, Toko } = require("../models");

const getAllTransactions = async (req, res) => {
  const allTransactions = await Transaction.findAll({
    attributes: ["TokoId", "ProductId", "notes", "quantity", "total"],
  });
  res.status(200).json({
    status: 200,
    message: "Success Get All Transactions Data",
    data: allTransactions,
  });
};
const getAllTransactionsFromOwnedShop = async (req, res) => {
  const shop = await Toko.findAll({
    where: { ProfileId: req.user.userId },
  });
  let allTransactions = [];
  for (let x of shop) {
    const newTransactions = await Transaction.findAll({
      attributes: ["TokoId", "ProductId", "notes", "quantity", "total"],
      where: {
        TokoId: x.id,
      },
    });
    if (newTransactions.length != 0) {
      allTransactions.push(newTransactions);
    }
  }

  res.status(200).json({
    status: 200,
    message: "Success Get All Transactions Data",
    data: allTransactions,
  });
};

module.exports = {
  getAllTransactions,
  getAllTransactionsFromOwnedShop,
};
