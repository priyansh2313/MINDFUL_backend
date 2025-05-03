const mongoose = require('mongoose');

const caseHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    q1: {
        type: String,
        required: true
    },
    q2: {
        type: String,
        required: true
    },
    q3: {
        type: String,
        required: true
    },
    q4: {
        type: String,
        required: true
    },
    q5: {
        type: String,
        required: true
    },
    q6: {
        type: String,
        required: true
    },
    q7: {
        type: String,
        required: true
    },
    q8: {
        type: String,
        required: true
    },
    q9: {
        type: String,
        required: true
    },
    q10: {
        type: String,
        required: true
    },
    q11: {
        type: String,
        required: true
    },
    q12: {
        type: String,
        required: true
    },
    q13: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('CaseHistory', caseHistorySchema);