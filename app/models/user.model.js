const mongoose = require("mongoose");

const schema = mongoose.Schema(
	{
		name: { type: String, require: true },
		phone: { type: String, require: true },
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
		gender: { type: String },
		dob: { type: Date, require: true },
		profession: { type: String },
		questionaire: { type: mongoose.Schema.Types.ObjectId, ref: "Questionaire" },
		caseHistory: { type: mongoose.Schema.Types.ObjectId, ref: "CaseHistory" },
		journalEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "JournalEntry" }],
		testResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestResults" }],
		anonymousUsername: { type: String },
		bio: { type: String },
	},
	{
		timestamps: true,
	}
);



module.exports = mongoose.model("User", schema);
