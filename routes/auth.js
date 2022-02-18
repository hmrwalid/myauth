const dotenv = require("dotenv");
const express =require('express');
 
 
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const router =express.Router();
const User = require("../model/user");
const { registerValidation, loginValidation } = require('./validtion');
dotenv.config();


//REGISTER
router.post("/register", async(req,res)=>{
   const {name , email, password} = req.body
//  register validtion
   const { error } = registerValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)
   //validate email exist
   const emailExist = await User.findOne({email}).exec();
      if(emailExist){
        return res.status(400).json({msg:'user already exists'})    
      }
      //hach password
      const hachPassword = await bcrypt.hash(password, 10);
// create new user
   const user = new User({name,email, password: hachPassword })
   try {
       const response = user.save()
       res.status(200).json({user, message:"user is saved"} )   } 
       catch (error) {
       res.status(400).send(error)
   }
});

//LOGIN
router.post('/login', async(req, res)=>{
  const {email, password} = req.body;
    //  login validtion
   const { error } = loginValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)
   //validate user in database
   const user = await User.findOne({email}).exec();
      if(!user){ 
        return res.status(400).json({msg:'Email does not exist'})    
      }
      //valid passowrd
      const validPass = await bcrypt.compare(password, user.password)
      if(!validPass) return res.status(400).send('invalid password')
      //  res.status(200).json({msg:'login succeeded'})
     // sing user 
     const payload={
       id :user._id
     }
      // Create and assing token
      const token = jwt.sign((payload,  process.env.secretOrPrivateKey , { expiresIn: '1h' }));
          res.status(200).json({user,token}) 

})





module.exports =router;