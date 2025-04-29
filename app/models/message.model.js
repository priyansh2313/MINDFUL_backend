const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		conversation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		fileUrl: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
