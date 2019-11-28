const mongoose = require('mongoose');

const schemaGroup = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}]
});

module.exports = mongoose.model('Group', schemaGroup);
