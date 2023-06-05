import { generateAccessToken } from '../../helper/accessToken.js';
import { errorHandler } from '../../middlewares/error.js';
import { User } from '../../model/user/userModel.js';
import bcrypt from 'bcrypt';

export const registerNewUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    let userName = await User.findOne({ name });
    if (userName) {
      res.status(400).json(errorHandler('Name is already taken'));
    }
    if (user) {
      res.status(400).json(errorHandler('Email is already taken'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json(errorHandler('Email is not valid'));
    }
    const passOk = await bcrypt.compare(password, user.password);
    if (passOk) {
      const accessToken = generateAccessToken(email);
      res.status(200).json({
        success: true,
        user,
        accessToken,
      });
    } else {
      res.status(400).json(errorHandler('Wrong Credentials'));
    }
  } catch (error) {
    next(error);
  }
};
