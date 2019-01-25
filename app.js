const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;

const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


//const uri = "mongodb+srv://node-app:"+MONGO_ATLAS_PW+"@my-node-app-3vzp4.mongodb.net/test?retryWrites=true";
//const client = new MongoClient(uri, { useNewUrlParser: true });

mongoose.connect('mongodb+srv://node-app:'+process.env.MONGO_ATLAS_PW+'@my-node-app-3vzp4.mongodb.net/test?retryWrites=true',{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not a valid url!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;