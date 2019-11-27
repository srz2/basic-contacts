const mongoose = require('mongoose');

const schemaContact = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hash: {type: String, required: true},
    birthday: {type: String, required: true},
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    }
});

module.exports = mongoose.model('Contact', schemaContact)
