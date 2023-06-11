export const generateRandomNumber = () => {
  const minm = 100000;
  const maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
};

export const isVerificationCodeExpired = (user) => {
  return new Date() > user.verificationCodeExpiresAt;
};
