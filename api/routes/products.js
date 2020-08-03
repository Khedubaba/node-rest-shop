const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//Routes
//GET request
router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        // if (docs.length >= 0) {
        //     res.status(200).json(docs);
        // } else {
        //     res.status(404).json({
        //         message: 'No entries found'
        //     });
        // }
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//POST request
router.post('/', (req, res, next) => {
    //creating instance of the model(object)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    //saving in mongodb using mongoose method save()
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            });
        })
        .catch (err => {
            console.log(err);
            res.status(500).json({
                error: err
            }); 
        });
});

//GET request with specif product id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database: ", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry for proided ID'});
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).json({error: err});
        });
});

//PATCH request
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    //to keep updating dynamic as we don't know what or how many fields may be updated through payload
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(console.log(err));
    res.status(500).json({
        error: err
    });
});

//DELETE request
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;