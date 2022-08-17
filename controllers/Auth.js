const jwt = require('jsonwebtoken')
const joi = require('joi');
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { User, userSchema, validationUser, validationLogin, validationResetPassword } = require('../modal/User')

// @desc    Register new urser
// @route   POST/api/auth/register
// @access  PUBLIC
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phoneNumber } = req.body

        // check for validation
        const { error } = ValidateUser(req.body);
        if (!error) return next(new ErrorResponse(error.details[0].message, 400));


        console.log(req.body);
        // check if user email address already exists
        console.log(email);
        let user = await User.findOne({ email });
        console.log(user);
        if (user) {
            return next(
                new ErrorResponse("The user email address already exists", 400)
            );
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        // create new user
        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            accountCode: accountCode,
            role: role,
        });

        // create JWT token
        function generateToken() {
            return jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE,
                }
            );
        }
        const token = generateToken();

        res.status(200).json({
            success: true,
            data: user,
            token: token,
        });
    } catch (error) {
        next(error.message, 500)
    }
}