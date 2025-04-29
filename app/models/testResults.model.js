const mongoose = require('mongoose');

const testResultsSchema = new mongoose.Schema({
    anxiety: { type: Number, required: true },
    stress: { type: Number, required: true },
    insomnia: { type: Number, required: true },
    depression: { type: Number, required: true },
    selfEsteem: { type: Number, required: true },
    score : { type: Number, required: true },
});

module.exports = mongoose.model('TestResults', testResultsSchema);