require('dotenv').config();

module.exports = {
    IP_ADDRESS: process.env.IP_ADDRESS,
    PORT: process.env.PORT,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_DATABASE: process.env.MONGO_DATABASE
}