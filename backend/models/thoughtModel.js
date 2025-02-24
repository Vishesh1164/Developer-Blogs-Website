const { Schema, model } = require('../connection')

const mySchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    thought: {type: String, unique: true},
    createdAt: {type: Date, default: Date.now()},

    

})

module.exports = model('thoughts', mySchema)