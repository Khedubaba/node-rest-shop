const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://khedubaba:'+ process.env.MONGO_ATLAS_PASS +'@node-rest-shop-shard-00-00.bfdu1.mongodb.net:27017,node-rest-shop-shard-00-01.bfdu1.mongodb.net:27017,node-rest-shop-shard-00-02.bfdu1.mongodb.net:27017/node-rest-shop?ssl=true&replicaSet=atlas-w9fdhy-shard-0&authSource=admin&retryWrites=true&w=majority', 
    {
        // useMongoClient: true
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS headers to avoid CORS erros
//Appending headers to funnel every request throught it to avoid CORS errors
app.use((req, res, next) => {
    //defeining allow origin header to allow access from certain or all (*) origins
    res.header('Access-control-Allow-Origin', '*');

    //defining which kind of headers to be appende to incoming requests *-all headers type
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Error handling
app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;