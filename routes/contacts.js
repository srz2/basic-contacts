const express = require('express');
const hash = require('object-hash');
const mongoose = require('mongoose');
const router = express.Router();

const Contact = require('../models/contact');

router.get('/', (req, res, next) => {
    Contact.find()
    .select('_id name')
    .then(results => {
        console.log(results);
        res.status(200).json({
            count: results.length,
            message: 'All contacts retreived',
            contacts: results
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error retreiving contacts',
            error: err
        })
    })
});

router.post('/', (req, res, next) => {
    console.log(req.body);

    const contact = new Contact({
        _id: mongoose.Types.ObjectId(),
        hash: hash.MD5(req.body.name),
        name: req.body.name,
        birthday: req.body.birthday
    });

    Contact.find({hash: contact.hash}).exec()
    .then(results => {
        if (results.length >= 1){
            res.status(302).json({
                message: 'Contact already exists',
                _id: results[0]._id
            })
        } else {
            contact.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Succesfully Added New Contact',
                    newContact: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: 'Failed to add contact',
                    error: err
                })
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'Unable to query database',
            error: err
        })
    });
});

router.delete('/:contactId', (req, res, next) => {
    Contact.find({_id: req.params.contactId}).exec()
    .then(results => {
        if (results.length >= 1) {
            Contact.deleteOne({_id: req.params.contactId}).exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'Deleted Contact'
                });
            })
            .catch(err => {
                console.log(result);
                res.status(500).json({
                    message: 'Failed to Deleted Contact'
                });
            })
        } else {
            console.log(result);
            res.status(200).json({
                message: 'Contact Not Found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Unable to delete contact',
            contactId: req.params.contactId
        });
    })
});

module.exports = router;
