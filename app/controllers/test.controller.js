const mongoose = require("mongoose");
const TestResults = require("../models/testResults.model");
const User = require("../models/user.model");

module.exports = testController = {
	createResult: async (req, res) => {
		const userId = req.user;

		if (!req.body.anxiety || !req.body.stress || !req.body.insomnia || !req.body.depression || !req.body.selfEsteem) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// find the user
		const user = await User.findById(userId);

		// create a new result document
		const testResults = new TestResults(req.body);
		await testResults.save();
		user.testResults.push(testResults._id);
		await user.save();
		return res.status(201).json({ message: "Test results created successfully", user, testResults });
	},

	getResults: async (req, res) => {
		const userId = req.user;
		const user = await User.findById(userId).populate("testResults");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ testResults: user.testResults });
	},
};
