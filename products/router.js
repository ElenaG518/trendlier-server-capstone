'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { Product } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

// response for API call to get wishlist for user
router.get('/:username', (req, res) => {
    console.log('looking by username');

    console.log(req.params.username);
    Product
        .find({ loggedInUserName: req.params.username })
        .sort({ created: 1 })
        // if successful, send back journeys
        .then(products => {
            // if (products.loggedInUserName == req.params.user) {
                res.json({
                products: products.map(product => product.serialize())
            });
        // };
        })
        // send error if call was not successful
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Could not retrieve wishlist" });
        });
});

// response for API call to get  wishlist item by ID
router.get('/id/:id', (req, res) => {
    console.log('looking by id');

    console.log(req.params.id);
    Product
        .findById(req.params.id)
        .then(product => res.json(product.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not retrieve wishlist item" });
        });
});

// response for API call to get product to edit by searching by product Id
router.get('/edit/:id', (req, res) => {
    console.log('looking by id');

    console.log(req.params.id);
    Product
        .findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not retrieve wishlist item for editing" });
        });
});

// response for API call to create a product with information provided by user
router.post('/create', jsonParser, (req, res) => {
        console.log("this", req.body.image, req.body.name, req.body.purchaseUrl, req.body.regularPrice, req.body.currentPrice, req.body.rating, req.body.reviewsCount, req.body.description, req.body.notes, req.body.loggedInUserName);
    const requiredFields = ['image', 'name', 'regularPrice', 'currentPrice', 'rating', 'reviewsCount', 'description', 'notes', 'loggedInUserName'];
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
    Product
        .create({
            image: req.body.image,
            name: req.body.name,
            purchaseUrl: req.body.purchaseUrl,
            regularPrice: req.body.regularPrice,
            currentPrice: req.body.currentPrice,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            description: req.body.description,
            notes: req.body.notes,
            loggedInUserName: req.body.loggedInUserName

        })
        .then(product => res.status(201).json(product.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Product failed to create' });
        });

});

// response to handle user request to edit wishlist item note
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
    console.log("notes", req.body);
    if ('notes' in req.body) {
                    toUpdate.notes = req.body.notes;
                    console.log("toUpdate", toUpdate.notes);
        };
   
    // update information
    Product
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(() => res.status(204).json({ message: 'success' }).end())
        .catch(err => res.status(500).json({ message: 'couldn\'t update wishlist item' }));
});

// find journey by id and delete if from databasae
router.delete('/:id', (req, res) => {
    Product
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted wishlist item with id \`${req.params.id}\``);
            res.status(204).end();
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = {router};