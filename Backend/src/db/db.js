const mongoose = require('mongoose');



function connectDB() {
    mongoose.connect('mongodb://localhost:27017/food-view' )
        .then(() => {
            console.log('MongoDB Connected');
        })
        .catch((err) => {
            console.error('MongoDB connection Error', err);
        });
}

module.exports = connectDB;