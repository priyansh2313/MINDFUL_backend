const mongoose = require("mongoose");
const Journal = require("../models/journal.model.js");
const User = require("../models/user.model.js");

module.exports = journalController = {
	createJournal: async (req, res) => {
		try {
			const { title, content, tags, mood } = req.body;
			if (!title || !content) {
				return res.status(400).json({ message: "Title and content are required" });
			}

			const userId = req.user._id; // Assuming you have user authentication middleware

			const newJournal = new Journal({
				title,
				content,
				tags,
				mood,
				userId,
			});

			await newJournal.save();
			res.status(201).json(newJournal);
		} catch (error) {
			res.status(500).json({ message: "Error creating journal entry", error });
		}
	},

	getJournals: async (req, res) => {
		try {
			const journals = await Journal.find({ userId: req.user._id });
			res.status(200).json(journals);
		} catch (error) {
			res.status(500).json({ message: "Error fetching journals", error });
		}
	},
};
