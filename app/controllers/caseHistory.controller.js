const CaseHistory = require("../models/caseHistory.model");
const User = require("../models/user.model");
const caseHistoryController = {};

caseHistoryController.createCaseHistory = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const { data } = req.body;
		console.log(data);
		const newCaseHistory = new CaseHistory({ userId, ...data });
		await newCaseHistory.save();
		user.caseHistory = newCaseHistory._id;
		await user.save();
		res.status(201).json(newCaseHistory);
	} catch (error) {
		res.status(500).json({ message: "Error creating case history", error });
	}
};

caseHistoryController.getCaseHistoryByUserId = async (req, res) => {
	try {
		const userId = req.user._id;
		const caseHistory = await CaseHistory.findOne({ userId });
		if (!caseHistory) {
			return res.status(404).json({ message: "Case history not found" });
		}

		res.status(200).json(caseHistory);
	} catch (error) {
		res.status(500).json({ message: "Error retrieving case history", error });
	}
};

module.exports = caseHistoryController;
