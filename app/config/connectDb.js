const config = require("./config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
	mongoose
		.connect(config.mongodbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((err) => {
			console.error("Error connecting to MongoDB", err);
		});
};

module.exports = connectDB;
