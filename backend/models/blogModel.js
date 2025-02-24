const { Schema, model } = require('../connection')

const mySchema = new Schema({
    title: String,
    cover: {type: String, unique: true, default: "unknown"},
    description: {type: String, required: true},
    content: {type: String, required: true},
    publishedBy: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
    email: {type: String, required: true},
    src: {type: String, default: "unknown"}
    
})

module.exports = model('blogs', mySchema)