const config = require('../config');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Contact = require('../models/contact');
const Group = require('../models/group');

router.get('/', (req, res, next) => {
    Group.find().select('name _id')
        .then(groups => {
            res.status(200).json({
                message: 'Retrieved all groups',
                count: groups.length,
                groups: groups.map(group => {
                    return {
                        _id: group._id,
                        name: group.name,
                        request: {
                            type: 'GET',
                            url: 'http://' + config.IP_ADDRESS + ':' + config.PORT + '/groups/' + group._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Failed to get all groups'
            })
        })
});

router.get('/:groupId', (req, res, next) => {
    Group.find({ _id: req.params.groupId }).populate('members', 'name')
        .then(results => {
            if (results.length === 1) {
                res.status(200).json(results.map(group => {
                    return {
                        _id: group._id,
                        name: group.name,
                        membercount: group.members.length,
                        members: group.members.map(member =>{
                            return {
                                name: member.name.last + ', ' + member.name.first
                            }
                        })
                    }
                }));
            } else {
                res.status(404).json({
                    message: 'Group not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Failed to query database',
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const groupName = req.body.group_name;
    if (groupName === undefined) {
        res.status(400).send('Missing group_name');
    } else {

        Group.find({ name: groupName }).exec()
            .then(groups => {
                if (groups.length >= 1) {
                    res.status(409).json({
                        message: 'Group already exists',
                        _id: groups[0]._id
                    })
                } else {
                    const group = new Group({
                        _id: mongoose.Types.ObjectId(),
                        name: groupName
                    });

                    group.save()
                        .then(result => {
                            console.log(result);
                            res.status(200).json({
                                message: 'Successfully created a new group',
                                newGroup: result
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                message: "Failed to save new group to database"
                            })
                        });
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Unable to query database'
                });
            })
    }
});

router.patch('/:groupId', (req, res, next) => {

    // Get group
    Group.find({ _id: req.params.groupId })
        .then(groups => {
            const group = groups[0];
            const requestedAdditions = req.body.members;

            group.members = requestedAdditions;

            Group.updateOne({ _id: group._id }, group).exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Successfully updated group',
                        group: group
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Failed to update group',
                        error: err
                    })
                })

            // TODO Confirm contact exists before adding blindly
            // // Go through each addition and make sure we have a contact for it
            // var failedAdditions = [];
            // for (var index = 0; index < requestedAdditions.length; index++) {
            //     const activeId = requestedAdditions[index];
            //     console.log('Checking: ' + activeId);

            //     Contact.find({ _id: activeId })
            //         .then(contacts => {
            //             if (contacts.length >= 1) {
            //                 console.log('Before:');
            //                 console.log(group);
            //                 group.members.push(contacts[0]);
            //                 console.log('After:');
            //                 console.log(group);
            //             } else {
            //                 console.log('Contact does not exist: ' + activeId);
            //                 failedAdditions.push(activeId);
            //             }
            //         })
            //         .catch(err => {
            //             failedAdditions.push(activeId);
            //         })
            // }

            // if (failedAdditions.length > 0) {
            //     res.status(400).json({
            //         message: 'Failure adding contacts to group',
            //         failed_ids: failedAdditions
            //     })
            // } else {
            //     Group.updateOne({ _id: group._id }, group).exec()
            //         .then(result => {
            //             res.status(200).json({
            //                 message: 'Successfully updated group',
            //                 group: group
            //             })
            //         })
            //         .catch(err => {
            //             res.status(500).json({
            //                 message: 'Failed to update group',
            //                 error: err
            //             })
            //         })
            // }
        })
        .catch(err => {
            res.status(404).json({
                message: 'Unable to add members to a group which doesn\'t exist'
            })
        })
})

router.delete('/:groupId', (req, res, next) => {
    Group.findOneAndRemove(req.params.groupId).exec()
    .then(result => {
        res.status(200).json({
            message: 'Group Deleted',
            request: {
                type: 'POST',
                url: 'http://' + config.IP_ADDRESS + ':' + config.PORT + '/groups',
                params: {
                    groupId: 'Id'
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Failed to delete group'
        })
    })
});

module.exports = router;
