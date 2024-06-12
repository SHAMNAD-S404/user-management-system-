const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
const noCache = require('nocache');
const express = require("express");
const {dbURI} = require('./config/config')
const app     = express();


//THIS FOR INTERNAL CSS FILE LINKL
app.use (express.static('public'));
app.use (noCache());

//for user routes 
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);


//for Admin routes 
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);


mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:",err);
});


app.listen(3000, () => {
    console.log(`server is running on port http://localhost:3000`)
});

