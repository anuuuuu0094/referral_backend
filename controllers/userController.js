const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
       const exixtingUser = await user.findOne({ $or: [{ username }, { email }] });
       if (exixtingUser) {
           return res.status(400).json({ message: 'Username or Email already exists' });
       }    
         const hashedPassword = await bcrypt.hash(password, 10);
            
         const user = await user.create({
                username,
                email,
                password: hashedPassword
         });
         res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const {email , password } = req.body;

        const user = await user.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};