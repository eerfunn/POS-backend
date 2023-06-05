const { User, Profile, Log } = require("../models");
const bcrypt = require("bcrypt");
const { checkToken, signToken } = require("../services/authServices");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role"],
      include: {
        model: Profile,
        required: true,
        attributes: ["image", "name", "address", "no_hp"],
      },
    });
    await Log.create({
      UserId: req.user.userId,
      desc: "User " + req.user.userId + " getting all user data",
    });
    res.status(200);
    return res.json({
      message: "Success get all users",
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const users = await User.findOne({
      attributes: ["id", "email", "role"],
      include: {
        model: Profile,
        required: true,
        attributes: ["image", "name", "address", "no_hp"],
      },
      where: {
        id: userId,
      },
    });
    await Log.create({
      UserId: req.user.userId,
      desc: "User " + req.user.userId + " user " + userId + " data",
    });
    if (!users) {
      res.status(404);
      return res.json({
        message: "User does not exist",
        statusCode: 404,
      });
    } else {
      res.status(200);
      return res.json({
        message: "Success get user",
        statusCode: 200,
        data: users,
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

const register = async (req, res) => {
  const role = "owner";
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !role) {
    res.status(400);
    return res.json({ status: 400, message: "Data cannot be empty!" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const isEmailRegistered = await User.findOne({
      where: {
        email: email,
      },
    });
    if (isEmailRegistered) {
      res.status(409);
      return res.json({
        status: 409,
        message: "Email already exist!",
      });
    }
    const user = await User.create({
      email: email,
      password: hashPassword,
      role: role,
    });
    await Profile.create({
      UserId: user.id,
      name: name,
    });
    await Log.create({
      UserId: user.id,
      desc: "User " + req.user.userId + " created",
    });
    res.status(201);
    return res.json({
      message: "Register success!",
      statusCode: 201,
      data: user,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      res.status(404);
      return res.json({
        message: "Email is not registered!",
        statusCode: 404,
      });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401);
      return res.json({
        message: "Username or password do not match!",
        statusCode: 401,
      });
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    await Log.create({
      UserId: user.id,
      desc: "User " + user.id + " Logged in",
    });
    signToken(req, res);
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const whoami = async (req, res) => {
  try {
    checkToken(req, res);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.sendStatus(204);
    }
    await Log.create({
      UserId: req.user.userId,
      desc: "User " + req.user.userId + " logged out",
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    delete req.user;
    res.status(200);
    console.log("Logout Succeed, data: " + req.user);
    return res.json({
      statusCode: 200,
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, address, no_hp } = req.body;
  console.log(req.body);
  const image = req.body.file;
  try {
    if (!req.user.userId) {
      res.status(403);
      return res.json({
        message: "Cannot update profile!",
        statusCode: 403,
      });
    }
    if (!name || !address || !no_hp) {
      res.status(400);
      return res.json({
        status: 400,
        message: "Please fill in each input field!",
      });
    }

    await Profile.update(
      { image, name, address, no_hp },
      {
        where: {
          UserId: req.user.userId,
        },
      }
    );
    await Log.create({
      UserId: req.user.userId,
      desc: "User " + req.user.userId + " updated their profile",
    });
    const afterUpdate = await Profile.findOne({
      attributes: ["image", "name", "address", "no_hp"],
      where: {
        UserId: req.user.userId,
      },
    });
    res.status(200);
    return res.json({
      message: "Update profile Success!",
      statusCode: 200,
      data: afterUpdate,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const updateRole = async (req, res) => {
  const { role } = req.body;
  try {
    if (req.user.role != null) {
      res.status(403);
      return res.json({ status: 403, message: "You already have role!" });
    }
    if (!req.user.userId) {
      res.status(403);
      return res.json({ status: 403, message: "Please login first!" });
    }
    await User.update(
      { role },
      {
        where: {
          UserId: req.user.userId,
        },
      }
    );
    const updatedRole = await User.findOne({
      where: { UserId: req.user.userId },
    });
    res.status(200);
    return res.json({
      message: "Update role Success!",
      statusCode: 200,
      data: updatedRole,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 500,
      message: "Something went wrong!",
      error: error.stack,
    });
  }
};

const getLogs = async (req, res) => {
  const logs = await Log.findAll({
    attributes: ["id", "UserId", "desc"],
  });
  await Log.create({
    UserId: req.user.userId,
    desc: "User " + req.user.userId + " viewing all user logs",
  });
  res.status(200).json({
    status: 200,
    message: "Data Found!",
    data: logs,
  });
};

module.exports = {
  getLogs,
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  updateRole,
  logout,
};
