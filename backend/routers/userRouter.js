const express = require('express');
const Model = require('../models/UserModel');
const { models } = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config()

router.post('/add', (req, res) => {

    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            console.log(err);
            if (err.code === 11000) {
                res.status(500).json({ message: 'Email already exists' });
            }
            else {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });



})


router.get('/getbyemail/:email', (req, res) => {
    Model.find({ email: req.params.email })
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            res.status(500).json(err);
        });
})

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            res.status(500).json(err);
        });

})

router.get('/getuser', verifyToken, (req, res) => {
    Model.findById(req.user._id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });

})

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            res.status(500).json(err);
        });

})

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            res.status(500).json(err);
        });

})
router.put('/update', verifyToken, (req, res) => {
    Model.findByIdAndUpdate(req.user._id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

})

router.post('/authenticate', (req, res) => {
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                console.log(result)
                //email and password matched
                //generate token
                const { _id, email, password, name ,profileImage} = result
                const payload = { _id, email, password, name, profileImage }
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '6h' },
                    (err, token) => {
                        if (err) {
                            res.status(500).json(err)
                            console.log(err)
                        }
                        else {
                            res.status(200).json({ token, name, email: email, profileImage: profileImage})

                        }
                    }
                )
            }
            else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ err });
        });
})

module.exports = router;