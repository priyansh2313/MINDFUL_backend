const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	],
});

module.exports = mongoose.model("Conversation", ConversationSchema);