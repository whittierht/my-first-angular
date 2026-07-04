var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Contact = require('../models/contact');
var sequenceGenerator = require('./sequenceGenerator');

function getContactIds(contacts) {
  if (!contacts || contacts.length === 0) {
    return [];
  }

  return contacts
    .map(function(contact) {
      return contact._id || contact;
    })
    .filter(function(id) {
      return mongoose.Types.ObjectId.isValid(id);
    });
}

router.get('/', function(req, res) {
  Contact.find()
    .populate('group')
    .then(function(contacts) {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
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
  sequenceGenerator.nextId('contacts')
    .then(function(maxContactId) {
      var contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: getContactIds(req.body.group)
      });

      return contact.save();
    })
    .then(function(createdContact) {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
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
  Contact.findOne({ id: req.params.id })
    .then(function(contact) {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = getContactIds(req.body.group);

      Contact.updateOne({ id: req.params.id }, contact)
        .then(function() {
          res.status(204).json({
            message: 'Contact updated successfully'
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
        message: 'Contact not found.',
        error: error
      });
    });
});

router.delete('/:id', function(req, res) {
  Contact.findOne({ id: req.params.id })
    .then(function(contact) {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      Contact.deleteOne({ id: req.params.id })
        .then(function() {
          res.status(204).json({
            message: 'Contact deleted successfully'
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
        message: 'Contact not found.',
        error: error
      });
    });
});

module.exports = router;
