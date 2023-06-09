import { emailVerification } from '../../configs/email/emailVerification.js';
import { generateAccessToken } from '../../helper/accessToken.js';
import { generateRandomNumber } from '../../helper/randomNumberGenerator.js';
import { errorHandler } from '../../middlewares/error.js';
import { User } from '../../model/user/userModel.js';
import bcrypt from 'bcrypt';

export const emailVerificationByCode = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;
    console.log(verificationCode);
    const user = await User.findOne({ verificationCode });
    if (user.isVerified) {
      res
        .status(400)
        .json(errorHandler('Email is already verified please login'));
    }
    if (!user) {
      res.status(400).json(errorHandler('Verification code is not correct'));
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Email Verified Successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

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
    const verificationCode = generateRandomNumber();
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });
    emailVerification(user);
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
      const accessToken = generateAccessToken({
        name: user.name,
        email: user.email,
        id: user._id,
      });
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

export const getCurrentUserInfo = async (req, res, next) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(400).json(errorHandler('Wrong Email'));
    } else {
      if (password != confirmPassword) {
        res.status(400).json(errorHandler('Password does not match'));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
          success: true,
          message: 'Password changed successfully',
          user,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
