var Sequence = require('../models/sequence');

function SequenceGenerator() {}

SequenceGenerator.prototype.nextId = function(collectionType) {
  var field;

  switch (collectionType) {
    case 'documents':
      field = 'maxDocumentId';
      break;
    case 'messages':
      field = 'maxMessageId';
      break;
    case 'contacts':
      field = 'maxContactId';
      break;
    default:
      return Promise.resolve(-1);
  }

  return Sequence.findOneAndUpdate(
    {},
    { $inc: { [field]: 1 } },
    { new: true }
  ).then(function(sequence) {
    return sequence ? sequence[field] : -1;
  });
};

module.exports = new SequenceGenerator();
