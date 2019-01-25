const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const router = express.Router();
router.get('/', (req, res, next)=>{
    Order.find()
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/"+doc._id
                    }
                }
            })
        });
    })
    .catch();
});
router.post('/', (req, res, next)=>{
    Product.findById(req.body.productId)
    .then(product =>{ 
        if(!product){
            res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order
        .save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order created successfully",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/"+result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
router.get('/:orderId', (req, res, next)=>{
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product', 'name price _id')
    .exec()
    .then(result =>{
        if(!result){
            res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: result,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders"
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
});
router.delete('/:orderId', (req, res, next)=>{
    Order.remove({ _id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: {
                    productId: "ID",
                    quantity: "Number"  
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;