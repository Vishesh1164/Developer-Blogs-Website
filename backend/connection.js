const mongoose = require('mongoose');

const url ="mongodb+srv://srivastavavishesh59:Vishesh123@cluster0.oms1z.mongodb.net/mernproject?retryWrites=true&w=majority&appName=Cluster0";

// asynchronous function - returns promise
mongoose.connect(url)
.then((result) => {
    console.log('database connected')
    
}).catch((err) => {
    console.log('error connecting to database', err)
    
});

module.exports = mongoose;