import { emailVerification } from '../../configs/email/emailVerification.js';
import { emailVerificationForForgetPassword } from '../../configs/email/emailVerificationForForgetPassword.js';
import { generateAccessToken } from '../../helper/accessToken.js';
import {
  generateRandomNumber,
  isVerificationCodeExpired,
} from '../../helper/randomNumberGenerator.js';
import { errorHandler } from '../../middlewares/error.js';
import { User } from '../../model/user/userModel.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

export const resendVerificationCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json(errorHandler('User not found'));
    } else if (user?.isVerified) {
      res.status(400).json(errorHandler('User is already verified'));
    } else if (!isVerificationCodeExpired(user)) {
      res
        .status(400)
        .json(errorHandler('Verification code has not expired yet'));
    } else {
      const verificationCode = generateRandomNumber();
      const verificationCodeExpiresAt = new Date();
      verificationCodeExpiresAt.setMinutes(
        verificationCodeExpiresAt.getMinutes() + 2
      );
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;
      user.isVerified = false;
      await user.save();

      emailVerification(user);
      res.json({
        success: true,
        message: 'Verification code resent successfully',
        user,
      });
    }
  } catch (error) {}
};

export const emailVerificationByCode = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({ verificationCode });
    if (isVerificationCodeExpired(user)) {
      res.status(400).json(errorHandler('Verification code is expired'));
    } else if (user == null || !user) {
      res.status(400).json(errorHandler('Verification code is not correct'));
    } else if (user?.isVerified) {
      res
        .status(400)
        .json(errorHandler('Email is already verified please login'));
    } else {
      user.isVerified = true;
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Email Verified Successfully',
        user,
      });
    }
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
    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() + 2
    );
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt,
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
  const id = req.params.id;
  const user = await User.findById(id);

  res.json({
    success: true,
    user,
  });
};

export const forgetPassword = async (req, res, next) => {
  const { verificationCode, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ verificationCode });
    if (isVerificationCodeExpired(user)) {
      res.status(400).json(errorHandler('Verification code is expired'));
    } else if (!user) {
      res.status(400).json(errorHandler('Wrong verification code'));
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

export const emailForForgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json(errorHandler('Can not find the user'));
    } else {
      const verificationCode = generateRandomNumber();
      const verificationCodeExpiresAt = new Date();
      verificationCodeExpiresAt.setMinutes(
        verificationCodeExpiresAt.getMinutes() + 2
      );
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;
      await user.save();
      emailVerificationForForgetPassword(user);
      res.json({
        success: true,
        message: 'Email sent successfully',
        user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCodeForForgetPassword = async (
  req,
  res,
  next
) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json(errorHandler('User not found'));
    } else if (!isVerificationCodeExpired(user)) {
      res
        .status(400)
        .json(errorHandler('Verification code has not expired yet'));
    } else {
      const verificationCode = generateRandomNumber();
      const verificationCodeExpiresAt = new Date();
      verificationCodeExpiresAt.setMinutes(
        verificationCodeExpiresAt.getMinutes() + 2
      );
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;
      await user.save();

      emailVerificationForForgetPassword(user);
      res.json({
        success: true,
        message: 'Verification code resent successfully',
        user,
      });
    }
  } catch (error) {}
};

export const updateUserProfile = async (req, res, next) => {
  const id = req.params.id;
  const { name } = req.body;
  const profilePhotoPath = req.file.path;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(400).json(errorHandler('User not found'));
    } else {
      user.name = name;
      user.profilePhoto = profilePhotoPath;
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Details Updated Successfully',
        user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUserAccount = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Account Deleted!',
  });
};

export const logOut = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logout Successfully',
  });
};
