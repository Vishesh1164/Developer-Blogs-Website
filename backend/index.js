// Impoorting express 
const express = require('express');
const userRouter = require('./routers/userRouter');
const blogRouter = require('./routers/blogRouter');
const contactRouter = require('./routers/contactRouter');
const thoughtRouter = require('./routers/thoughtRouter');
const cors = require('cors');
require('dotenv').config();

// Creating n express app

const app = express();

const port =process.env.PORT;


app.use(cors({
    origin:  ["https://developer-blogs-website-4tf9crwvp.vercel.app"]
}));
app.use(express.json());
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/contact', contactRouter);
app.use('/thought', thoughtRouter);

//route or endpoint
app.get('/', (req, res) => {
    res.send('response from express')
})




app.listen(port, ()=>{console.log('Server started')})
