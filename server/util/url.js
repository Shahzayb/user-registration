exports.getPasswordResetURL = (userId, token) => {
  return `${process.env.CLIENT_BASE_URL}/${userId}?token=${token}`;
};
