"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// this is our schema to represent an image
const journeyImageSchema = mongoose.Schema({
    imgAddress: { type: String, required: true },
    journeyId: { type: String, required: true },
    username: { type: String, required: true },
    journeyTitle: { type: String, required: true }
});

// this is our schema to represent a journey
const journeySchema = mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    startDates: { type: String, required: true },
    endDates: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now, required: true },
    loggedInUserName: { type: String, required: true },

});

// how image will be represented when method is called
journeyImageSchema.methods.serialize = function() {
    return {
        journeyId: this.journeyId,
        imgAddress: this.imgAddress,
        journeyTitle: this.journeyTitle
    }
}

// combined both dates
journeySchema.virtual('dates').get(function() {
    return `${this.startDates} - ${this.endDates}`.trim();
});

// how journey will be represented when method is called
journeySchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        location: this.location,
        dates: this.dates,
        description: this.description,
        created: this.created,
        loggedInUserName: this.loggedInUserName
    }
}

const Journey = mongoose.model('Journey', journeySchema);
const Image = mongoose.model('Image', journeyImageSchema);

module.exports = { Journey, Image };