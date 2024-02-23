const mongoose = require("mongoose");

const schema = mongoose.Schema;

const categorySchema = new schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
})

// virtual for category URL
categorySchema.virtual("url").get(function() {
    return `/categories/${this._id}`
});

module.exports = mongoose.model("category", categorySchema);