require("dotenv").config();

module.exports = {
    mongodbUrl: process.env.MONGODB_URI,
    jwtSecret : process.env.JWT_SECRET,
    port: process.env.PORT,
};