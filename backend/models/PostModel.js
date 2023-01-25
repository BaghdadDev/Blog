const {Schema, models, model} = require("mongoose");

const ObjectId = Schema.Types.ObjectId;

const PortSchema = new Schema(
    {
        title: {type: String, required: true},
        story: {type: String, required: true},
        keyWords: {type: [String], required: true},
        user: {type: ObjectId, ref: "users", required: true},
        thumbnail: {type: String, required: false},
    },
    {timestamps: true}
);

module.exports = models.posts || model("posts", PortSchema);
