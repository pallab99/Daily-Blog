import nodemailer from 'nodemailer';
import 'dotenv/config';

export const emailVerificationForForgetPassword = (user) => {
  const email = process.env.EMAIL_ADDRESS;
  const password = process.env.EMAIL_PASSWORD;
  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  const details = {
    from: email,
    to: user?.email,
    subject: 'Email verification',
    text: `your verification code is ${user?.verificationCode}.User this code to verify your identity.This code will expired after 2 minutes`,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email sent');
    }
  });
};
