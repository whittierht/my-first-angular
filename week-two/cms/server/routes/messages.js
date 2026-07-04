var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Contact = require('../models/contact');
var Message = require('../models/message');
var sequenceGenerator = require('./sequenceGenerator');

function findSender(sender) {
  if (!sender) {
    return Promise.resolve(null);
  }

  if (sender._id && mongoose.Types.ObjectId.isValid(sender._id)) {
    return Promise.resolve(sender._id);
  }

  if (sender.id) {
    return Contact.findOne({ id: sender.id }).then(function(contact) {
      return contact ? contact._id : null;
    });
  }

  if (mongoose.Types.ObjectId.isValid(sender)) {
    return Promise.resolve(sender);
  }

  return Contact.findOne({ id: sender }).then(function(contact) {
    return contact ? contact._id : null;
  });
}

function cleanMessage(message) {
  return message.toObject();
}

router.get('/', function(req, res) {
  Message.find()
    .populate('sender')
    .then(function(messages) {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages.map(cleanMessage)
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.post('/', function(req, res) {
  Promise.all([
    sequenceGenerator.nextId('messages'),
    findSender(req.body.sender)
  ])
    .then(function(results) {
      var message = new Message({
        id: results[0],
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: results[1]
      });

      return message.save();
    })
    .then(function(createdMessage) {
      return createdMessage.populate('sender');
    })
    .then(function(createdMessage) {
      res.status(201).json({
        message: 'Message added successfully',
        newMessage: cleanMessage(createdMessage)
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', function(req, res) {
  Message.findOne({ id: req.params.id })
    .then(function(message) {
      if (!message) {
        throw { message: 'Message not found' };
      }

      return findSender(req.body.sender).then(function(sender) {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = sender;

        return Message.updateOne({ id: req.params.id }, message);
      });
    })
    .then(function() {
      res.status(204).json({
        message: 'Message updated successfully'
      });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Message not found.',
        error: error
      });
    });
});

router.delete('/:id', function(req, res) {
  Message.findOne({ id: req.params.id })
    .then(function(message) {
      if (!message) {
        return res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      Message.deleteOne({ id: req.params.id })
        .then(function() {
          res.status(204).json({
            message: 'Message deleted successfully'
          });
        })
        .catch(function(error) {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(function(error) {
      res.status(500).json({
        message: 'Message not found.',
        error: error
      });
    });
});

module.exports = router;
