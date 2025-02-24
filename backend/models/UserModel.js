const { Schema, model } = require('../connection')

const mySchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: {type: String, required: true},
    profileImage: {type: String, default:'https://via.placeholder.com/150'},
    createdAt: {type: Date, default: Date.now()},
    bio: {type: String, default:'unknown'},
    

})

module.exports = model('users', mySchema)