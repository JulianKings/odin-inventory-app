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

// virtual for item's url
itemSchema.virtual("url").get(function() {
    return `/items/${this._id}`;
});

module.export = mongoose.model("item", itemSchema);