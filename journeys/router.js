'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Journey, Image } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

// response for API call to get all journeys for user
router.get('/:username', (req, res) => {
    console.log('looking by username');

    console.log(req.params.username);
    Journey
        .find({ loggedInUserName: req.params.username })
        .sort({ title: 1 })
        // if successful, send back journeys
        .then(journeys => {
            // if (journey.loggedInUserName == req.params.user)
            res.json({
                journeys: journeys.map(journey => journey.serialize())
            });
        })
        // send error if call was not successful
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Could not retrieve journeys" });
        });
});

// response for API call to get  journey by Id
router.get('/id/:id', (req, res) => {
    console.log('looking by id');

    console.log(req.params.id);
    Journey
        .findById(req.params.id)
        .then(journey => res.json(journey.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not retrieve journeys" });
        });
});

// response for API call to get journey to edit by searching by journey Id
router.get('/edit/:id', (req, res) => {
    console.log('looking by id');

    console.log(req.params.id);
    Journey
        .findById(req.params.id)
        .then(journey => res.json(journey))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not retrieve journeys" });
        });
});

// response for API call to create a journey with information provided by user
router.post('/create', jsonParser, (req, res) => {
    console.log(req.body.title, req.body.location, req.body.startDates, req.body.endDates, req.body.description);
    const requiredFields = ['title', 'location', 'startDates', 'endDates', 'description', 'loggedInUserName'];
    // ensure we have values for all required fields, otherwise send an error
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    // create the journey with the information provided by user
    Journey
        .create({
            title: req.body.title,
            location: req.body.location,
            startDates: req.body.startDates,
            endDates: req.body.endDates,
            description: req.body.description,
            loggedInUserName: req.body.loggedInUserName

        })
        .then(journey => res.status(201).json(journey.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Journey failed to create' });
        });

});

// response to handle user request to edit journey
router.put('/update/:id', jsonParser, function(req, res) {
    console.log("call to put");
    console.log(req.params.id);
    console.log(req.body.id);
    // ensure we have the required fields and that they match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({ message: message });
    }
    // variables that are updatable
    const toUpdate = {};
    const updateableFields = ['title', 'location', 'startDates', 'endDates', 'description'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    // update information
    Journey
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(journey => res.status(204).json({ message: 'success' }).end())
        .catch(err => res.status(500).json({ message: 'couldn\'t update post' }));
});

// find journey by id and delete if from databasae
router.delete('/:id', (req, res) => {
    Journey
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted blog post with id \`${req.params.id}\``);
            res.status(204).end();
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});



// response for getting all images by journey Id
router.get('/images/:journeyId', (req, res) => {
    console.log('getting all images for username journey');
    console.log(req.params.journeyId);
    // look up images by journey id
    Image
        .find({ journeyId: req.params.journeyId })
        .then(images => {
            res.json({
                images: images.map(image => image)
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'couldnot retrieve images' });
        });
});

// response for getting one single image by journey Id
router.get('/images/single/:journeyId', (req, res) => {
    console.log('getting all images for username journey');
    console.log(req.params.journeyId);
    Image
        .findOne({ journeyId: req.params.journeyId })
        .then(image => res.json(image))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'couldnot retrieve images' });
        });
});

// response for API call to create image for journey
router.post('/add-img', jsonParser, (req, res) => {
    console.log(req.body.imgAddress, req.body.username, req.body.journeyId, req.body.journeyTitle);
    // ensure we have all the required fields
    const requiredFields = ['imgAddress', 'username', 'journeyId', 'journeyTitle'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    // create image with all the required fields
    Image
        .create({
            imgAddress: req.body.imgAddress,
            journeyId: req.body.journeyId,
            username: req.body.username,
            journeyTitle: req.body.journeyTitle
        })
        // ensure image was created successfully
        .then(image => res.status(201).json(image))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'image failed to create' });
        });

});

// response to handle user request to edit journey
router.put('/update-img/:journeyId', jsonParser, function(req, res) {
    console.log("call to put for image");
    console.log(req.params.journeyId);
    console.log(req.body.journeyId);
    // ensure we have the required fields and that they match
    if (!(req.params.journeyId && req.body.journeyId && req.params.journeyId === req.body.journeyId)) {
        const message = (
            `Request path journeyId (${req.params.journeyId}) and request body journeyId ` +
            `(${req.body.journeyId}) must match`);
        console.error(message);
        return res.status(400).json({ message: message });
    }
    // variables that are updatable
    const toUpdate = {};
    const updateableFields = ['journeyTitle'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    // update information
    Image
        .updateMany({ journeyId: req.body.journeyId }, { $set: toUpdate }, { new: true })
        .then(image => res.status(204).json({ message: 'success' }).end())
        .catch(err => res.status(500).json({ message: 'couldn\'t update image(s)' }));
});

module.exports = router;