const jwt = require("jsonwebtoken");

const expiresAccessToken = 60 * 60 * 24 * 1000; // in milliseconds => 1 day

function getAccessTokenByIdUser(idUser) {
  const accessToken = jwt.sign({ idUser }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresAccessToken / 1000, // It has to be in seconds
  });
  return {
    accessToken: accessToken,
    expiresAccessToken: Date.now() + expiresAccessToken,
  };
}

module.exports = { getAccessTokenByIdUser };
