const express = require('express');
const Model = require('../models/blogModel');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/add', verifyToken, (req, res) => {
    req.body.publishedBy = req.user.name;
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            res.status(500).json(err);
        });



})
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);

        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

})

router.get('/getbycatagory/:catagory', (req, res) => {
    Model.find({ catagory: req.params.city })
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
router.get('/getbyemail/:email', async (req, res) => {
    Model.find({email:req.params.email})
    .then((result) => {
        res.status(200).json(result);

    }).catch((err) => {
        res.status(500).json(err);
    });
});

module.exports = router;