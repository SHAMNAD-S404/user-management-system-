//REQUIRING UTILITIES
const express = require ('express');
const user_route = express ();
const session = require ('express-session');
const config = require ('../config/config');
const auth=require('../middleware/auth');
const userController = require('../controllers/userController');

//SETTING UP SESSION STORAGE
user_route.use (session({ secret: config.sessionSecret,
                    saveUninitialized : true,
                    resave : false}));

//SETTING STATIC FILES
user_route.set ('view engine','ejs');
user_route.set ('views','./views/users');


const bodyParser = require('body-parser');
user_route.use (bodyParser.json());
user_route.use (bodyParser.urlencoded({extended: true}));


//ROUTES
user_route.get  ('/register',auth.isLogout,userController.loadRegister)         
          .get  ('/',auth.isLogout,userController.loginLoad)
          .get  ('/login',auth.isLogout,userController.loginLoad)     
          .get  ('/home',auth.isLogin,userController.loadHome)
          .get  ('/logout',auth.isLogin,userController.userLogout)
          .get  ('/edit',auth.isLogin,userController.editLoad)
          .post ('/edit',auth.isLogin,userController.updateProfile)
          .post ('/register',auth.isLogout,userController.insertUser)
          .post ('/login',auth.isLogout,userController.verifyLogin)



module.exports=user_route;