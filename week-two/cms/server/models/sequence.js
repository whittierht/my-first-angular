var mongoose = require('mongoose');

var sequenceSchema = mongoose.Schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
