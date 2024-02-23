const mongoose = require('mongoose');

const schema = mongoose.Schema;

const itemSchema = new schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, min: 1, max: 999999, required: true },
    category: { type: schema.Types.ObjectId, ref: "category", required: true },
    amount: { type: Number, min: 0, max: 9999999999, required: true },
    imageUrl: { type: String },
    rating: { type: Number, min: 0, max: 5 }
});

// virtuals
itemSchema.virtual("url").get(function() {
    return `/items/${this._id}`;
});

itemSchema.virtual('short_desc').get(function() {
    if(this.description.length > 80)
    {
        return this.description.substring(0, 80) + "...";
    } else {
        return this.description;
    }
});

itemSchema.virtual('display_image').get(function() {
    return (this.imageUrl === '') ? 'images/default_image.svg' : this.imageUrl;
});

itemSchema.virtual('print_rating').get(function() {
    let ratingHTML = '';
    let starsCount = Math.round(this.rating);
    for(let i = 0; i < starsCount; i++)
    {
        ratingHTML += '<img src="images/filled_star.svg" />'
    }
    for(let i = 0; i < (5-starsCount); i++)
    {
        ratingHTML += '<img src="images/star.svg" />'
    }
    return ratingHTML;
})

module.exports = mongoose.model("item", itemSchema)