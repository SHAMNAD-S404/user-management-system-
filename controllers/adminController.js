//importing mongodb database
const User=require('../models/userModel');
const bcrypt=require('bcrypt');

//Importing randomstring for randomely generate string 
const randomstring=require('randomstring');

//For hash password

const securePassword=async (password) => {
    try {

        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;

    } catch(error) {
        console.log(error.message);
    }

}

//ADMIN LOGIN PAGE
const loadLogin=async (req,res) => {
    try {
        res.render('login');
    } catch(error) {
        console.log(error.message)
    }
}

const verifyLogin=async (req,res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email: email});  

        if(userData) {  
            const passwordMatch=await bcrypt.compare(password,userData.password); 

            if(passwordMatch) {
                if(userData.is_admin===0) {
                    res.render('login',{message: "Not authorized check your credentials"});
                }
                else {
                    req.session.user_id=userData._id;
                    res.redirect('/admin/home');
                }
            }
            else {
                res.render('login',{message: "Email and Password is incorrect"});
            }

        }
        else {
            res.render('login',{message: "YOUT NOT AUTHORIZED TO VISIT "});
        }


    } catch(error) {
        console.log(error.message);
    }
}

//FOR ADMIN DASHBOARD  

const loadDashboard=async (req,res) => {
    try {
        const userData=await User.findById({_id: req.session.user_id});
        res.render('home',{admin: userData});
    } catch(error) {
        console.log(error.message);

    }
}


//PATH FOR LOGOUT IN ADMIN

const logout=async (req,res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch(error) {
        console.log(error.message);
    }
}

//PATH FOR ADMIN DASHBOARD
const adminDashboard=async (req,res) => {
    try {
        const usersData=await User.find({is_admin: 0})
        res.render('dashboard',{users: usersData});
    } catch(error) {
        console.log(error.message);
    }
}

//PATH FOR ADD NEW USER

const newUserLoad=async (req,res) => {

    try {
        res.render('new-user');

    } catch(error) {
        console.log(error.message);
    }
}

const addUser=async (req,res) => {
    try {
        const name=req.body.name;
        const email=req.body.email;
        const mno=req.body.mno;
        const password=randomstring.generate(8);

        //calling securePassword for generating hash pass
        const spassword=await securePassword(password);

        //ADDING NEW USER DATA IN MONGODB
        const user=new User({
            name: name,
            email: email,
            mobile: mno,
            password: spassword,
            is_admin: 0
        });

        //SAVING USERS DATA IN ANOTHER VARIABLE
        const userData=user.save();

        if(userData) {
            res.redirect('/admin/dashboard')
        }
        else {
            res.render('new-user',{message: "UserData side problem"});
        }

    } catch(error) {
        console.log(error.message)
    }
}

// ADMIN EDIT USER FUNCTIONS

const editUserLoad=async (req,res) => {
    try {
        const id=req.query.id;
        const userData=await User.findById({_id: id});
        if(userData) {
            res.render('edit-user',{user: userData});
        }
        else {

            res.redirect('/admin/dashboard');
        }

    } catch(error) {
        console.log(error.message);
    }
}

//ADMIN UPDATE USER THROUGH POST MTHOD

const updateUsers=async (req,res) => {
    try {

       
        await User.findByIdAndUpdate({_id: req.body.id},
            {$set: { name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno }});

        res.redirect('/admin/dashboard');

    } catch(error) {
        console.log(error.message);
    }
}

//DELETE USERDATA
const deleteUser=async (req,res) => {
    try {

        const id=req.query.id;  
        await User.deleteOne({_id: id});
        res.redirect('/admin/dashboard');

    } catch(error) {

        console.log(error.message);
    }
}

const searchUser=async (req,res) => {
    try {
        let users=[];
        if(req.query.search) {

            users=await User.find({name: 
                {$regex: req.query.search,$options: 'i'}});

        } else {
            users=await User.find();
        }
        res.render('dashboard',{users: users});
        
    } catch(error) {
        console.log(error.message);
        res.render('error');
    }
};


module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    searchUser
}