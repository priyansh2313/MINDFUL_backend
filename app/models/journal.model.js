const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	date: { type: Date, default: Date.now },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	mood: {
		type: String,
		enum: ["happy", "sad", "angry", "tired", "crying", "anxious", "lonely", "depressed", "empty", "guilty"],
		default: "happy",
	},
});

module.exports = mongoose.model('Journal', journalSchema);