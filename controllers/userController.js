const User=require('../models/userModel');
const bcrypt=require('bcrypt');

const securePassword=async (password) => {
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch(error) {
        console.log(error.message);
    }
}



const loadRegister=async (req,res) => {
    try {
        res.render('registration')

    } catch(error) {
        console.log(error.message);

    }
}

const insertUser=async (req,res) => {
    try {
        const spassword=await securePassword(req.body.password);

        const user=new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword,
            is_admin: 0


        });
        const userData=await user.save();


        if(userData) {
            res.render('registration',{message: "Your registration has been sucessfull"});
        }
        else {
            res.render('registraton',{message: "Your registration has been failed"});
        }

    } catch(error) {
        console.log(error.message);
    }
}

//login user methods 
const loginLoad=async (req,res) => {
    try {
        res.render('login');
    } catch(error) {
        console.log(error.message);
    }
}

//password validation
const verifyLogin=async (req,res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email: email});

        if(userData) {
            const passwordMatch=bcrypt.compare(password,userData.password)
            if(passwordMatch) {

                req.session.user_id=userData._id;
                res.redirect('/home');

            }


        }
        else {
            res.render('login',{message: "Email and password is incorrect"});
        }

    } catch(error) {
        console.log(error.message);

    }
}


const loadHome=async (req,res) => {
    try {
        const userData=await User.findById({_id: req.session.user_id});
        res.render('home',{user: userData});
    } catch(error) {
        console.log(error.message);
    }
}

//CREATING CONTROL FOR LOGOUT SESSION 
const userLogout=async (req,res) => {
    try {

        req.session.destroy(); 
        res.redirect("/"); 

    } catch(error) {
        console.log(error.message);

    }
}

//USER PROFILE EDIT AND UPLOAD
const editLoad=async (req,res) => {
    try {
        const id=req.query.id;

        const userData=await User.findById({_id: id});  

        if(userData) {
            res.render('edit',{user: userData});  
        }
        else {
            res.redirect('/home');  
        }
    } catch(error) {
        console.log(error.message)
    }
}

//FOR PROFILE UPDATION
const updateProfile=async (req,res) => {
    try {
        if(req.file) {
            await User.findByIdAndUpdate({_id: req.body.user_id},
                {$set: { name: req.body.name,
                         email: req.body.email,
                         mobile: req.body.mno }});
        }
        else {
         await User.findByIdAndUpdate({_id: req.body.user_id},
            {$set: {name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno }});
        }
        res.redirect('/home');
    } catch(error) {
        console.log(error.message);
    }
}


module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}