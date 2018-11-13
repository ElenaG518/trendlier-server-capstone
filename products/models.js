"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent a product in the wishlist
const productSchema = mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    purchaseUrl: { type: String, required: true },
    regularPrice: { type: String, required: true },
    currentPrice: { type: String, required: true },
    rating: { type: String, required: true },
    reviewsCount: { type: String, required: true },
    description: { type: String, required: true },
    notes: String,
    created: { type: Date, default: Date.now, required: true },
    loggedInUserName: { type: String, required: true },

});

// how journey will be represented when method is called
productSchema.methods.serialize = function() {
    return {
        id: this._id,
        image: this.image,
        name: this.name,
        purchaseUrl: this.purchaseUrl,
        regularPrice: this.regularPrice,
        currentPrice: this.currentPrice,
        rating: this.rating,
        reviewsCount: this.reviewsCount,
        description: this.description,
        notes: this.notes,
        created: this.created,
        loggedInUserName: this.loggedInUserName
    }
}

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };