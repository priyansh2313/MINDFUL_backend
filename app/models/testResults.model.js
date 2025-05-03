const mongoose = require('mongoose');

const testResultsSchema = new mongoose.Schema({
    anxiety: { type: String, required: true },
    stress: { type: String, required: true },
    insomnia: { type: String, required: true },
    depression: { type: String, required: true },
    selfEsteem: { type: String, required: true },
    score : { type: String, required: true },
});

module.exports = mongoose.model('TestResults', testResultsSchema);