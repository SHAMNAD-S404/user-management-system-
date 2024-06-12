const  express = require ('express');
const admin_route = express ();


//importing session 
const session = require ('express-session');
const config = require  ('../config/config');

admin_route.use (session({secret:config.sessionSecret ,
                        saveUninitialized : true ,
                        resave : false}));


//setting bodyparser middleware session
const bodyParser = require ('body-parser');
admin_route.use (bodyParser.json());
admin_route.use (bodyParser.urlencoded({extended:true}));


//setting up views to view the content in which format
admin_route.set ('view engine','ejs');
admin_route.set ('views','./views/admin');

//AUTHORIZATION CHECKING FOR LOG IN AND LOGOUT IN ADMIN
const auth = require ("../middleware/adminAuth");

//IMPORTING ADMIN CONTROLLER 
const adminController = require ("../controllers/adminController");


//admin login route path
admin_route.get  ('/',auth.isLogout,adminController.loadLogin)          
           .get  ('/home',auth.isLogin,adminController.loadDashboard)
           .get  ('/logout',auth.isLogin,adminController.logout)        
           .get  ('/dashboard',auth.isLogin,adminController.adminDashboard)
           .post ('/',auth.isLogout,adminController.verifyLogin)

//USER MANAGEMENT
admin_route.get  ('/new-user',auth.isLogin,adminController.newUserLoad)        
           .get  ('/edit-user',auth.isLogin,adminController.editUserLoad)          
           .get  ('/delete-user',auth.isLogin,adminController.deleteUser)
           .get  ('/search',auth.isLogin,adminController.searchUser)
           .post ('/edit-user',auth.isLogin,adminController.updateUsers)
           .post ('/new-user',auth.isLogin,adminController.addUser)


admin_route.get ('*',(req,res) => {  //redirecting
    res.redirect('/admin');
});



module.exports= admin_route;