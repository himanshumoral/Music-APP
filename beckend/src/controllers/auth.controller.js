const usermodel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(req, res){
const {username, email, password, role = 'user'} = req.body;


const isuserexist = await usermodel.findOne({
    $or:[
        {email},
        {username}
    ]
});
  if(isuserexist){
    return res.status(400).json({message: 'email alredy exists'})
  }

const hash = await bcrypt.hash(password, 10);

const user = await usermodel.create({
    username,
    email,
    password: hash,
    role
})

const token = jwt.sign({
    id: user._id
}, process.env.JWT_SECRET)

res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
});

res.status(200).json({
    message: 'User register successfully',
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
})


}

async function loginUser(req, res){
    const {email, username, password} = req.body;

    const user = await usermodel.findOne({
        $or:[
            {email},
            {username}
        ]
    });

    if(!user){
        return res.status(401).json({message: 'Invalid credentials'});
    }

    const ispasswordmatch = await bcrypt.compare(password, user.password);

    if(!ispasswordmatch){
        return res.status(401).json({ message: 'Invalid credentials'})
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)
    
   res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false  // localhost pe false rakhna
});

    res.status(200).json({
        message: 'User login successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

module.exports = {registerUser, loginUser};