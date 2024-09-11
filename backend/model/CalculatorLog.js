const mongoose = require('mongoose');

const calciSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expression: {
        type: String,
        required: true
    },
    is_valid: {
        type: Boolean,
        required: true
    },
    output: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    }
});

const Calci = mongoose.model('Calci', calciSchema);

module.exports = Calci;
