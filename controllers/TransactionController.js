const { Profile, Products, Transaction, Toko } = require("../models");
const { Sequelize, Op } = require("sequelize");

const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.findAll({
      attributes: ["TokoId", "ProductId", "notes", "quantity", "total"],
    });
    res.status(200).json({
      status: 200,
      message: "Success Get All Transactions Data",
      data: allTransactions,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
const getAllTransactionsFromOwnedShop = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getAllTransactionsFromActiveToko = async (req, res) => {
  try {
    const user = await Profile.findOne({ where: { UserId: req.user.userId } });
    const transactions = await Transaction.findAll({
      where: { TokoId: user.activeToko },
    });
    const shop = await Toko.findOne({ where: { id: user.activeToko } });
    res.status(200).json({
      status: 200,
      message: "Success get all transactions from " + shop.name + " Shop",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
const getTransactionsBasedOnDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(startDate + " Till " + endDate);
  try {
    const report = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.and]: [
            {
              [Op.lt]: new Date(`${endDate} 23:59:59`),
              [Op.gt]: new Date(startDate),
            },
          ],
        },
      },
    });
    res.status(200).json({
      status: 200,
      message:
        "Success find transactions data between " +
        startDate +
        " and " +
        endDate,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getTransaction = (req, res) => {
  const TrId = req.params.id;
  try {
    const user = Profile.findOne({ where: { UserId: req.user.userId } });
    const transaction = Transaction.findOne({ where: { id: TrId } });
    if (user.activeToko != transaction.TokoId) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Success get Transaction!",
        data: transaction,
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

const createTransaction = async (req, res) => {
  const { ProductId, customer, notes, quantity, total } = req.body;
  try {
    const currProfile = await Profile.findOne({
      where: { UserId: req.user.userId },
    });
    console.log("Req Body: ", req.body);
    console.log("Profile Curr: ", currProfile);
    const TokoId = currProfile.activeToko;
    console.log("TOKO ID: " + TokoId);
    z;
    const addTransaction = await Transaction.create({
      TokoId,
      ProductId,
      customer,
      notes,
      quantity,
      total,
    });
    console.log("Transaction Data: ", addTransaction);
    res.status(201).json({
      status: 201,
      message: "Success Add Transaction",
      data: addTransaction,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};
module.exports = {
  getAllTransactions,
  getAllTransactionsFromOwnedShop,
  getAllTransactionsFromActiveToko,
  getTransactionsBasedOnDate,
  createTransaction,
};
