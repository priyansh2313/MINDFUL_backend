const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    mood: { type: String, enum: ['happy', 'sad', 'angry', 'neutral'], default: 'neutral' },
});

module.exports = mongoose.model('Journal', journalSchema);