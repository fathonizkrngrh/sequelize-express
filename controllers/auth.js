const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SIGNATURE_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existUser = await User.findOne({
        where: {
          email: email,
        },
      });

      if (existUser) {
        return res.status(409).json({
          status: false,
          message: "email already used!!",
        });
      }

      // mengenkripsi password
      const encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: encryptedPassword,
      });

      return res.status(201).json({
        status: false,
        message: "success",
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      // get request body
      const { email, password } = req.body;

      //cek database email ada atau tidak

      // cek email user
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(409).json({
          status: false,
          message: "email or password doesn't match!!",
        });
      }
      // cek hash password
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        return res.status(400).json({
          status: false,
          message: "email or password doesn't match",
        });
      }

      //, generate token jwt
      payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SIGNATURE_KEY);

      return res.status(201).json({
        status: false,
        message: "success",
        data: {
          email: user.email,
          name: user.name,
          token: token,
        },
      });

      //return token
    } catch (err) {
      next(err);
    }
  },
  whoami: (req, res, next) => {
    const user = req.user;

    try {
      return res.status(200).json({
        status: false,
        message: "success",
        data: user,
      });
    } catch (error) {
      next(err);
    }
  },
};
