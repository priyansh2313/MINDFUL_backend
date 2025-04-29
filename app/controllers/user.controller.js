const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userController = {};

userController.registerUser = async (req, res) => {
	console.log("got req");
	try {
        const { name, phone, email, password, dob } = req.body;
        
        // validating date of birth
		if (!dob || isNaN(Date.parse(dob))) {
			return res.status(400).send({
				status: false,
				message: "Invalid date of birth",
			});
		}
		
        // parsing the date
		const date = new Date(dob);
        let user = { ...req.body, dob: date };

        if(!name || !phone || !email || !password) {
            return res.status(400).send({
                status: false,
                message: "Name, phone, email and password are required",
            });
        }
        
        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({
                status: false,
                message: "Invalid email format",
            });
        }

        // validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                status: false,
                message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
            });
        }

		// check if user exists
		const existingUser = await User.findOne({ email: user.email });
		if (existingUser) {
			return res.status(400).send({
				status: false,
				message: "User already exists",
			});
        }
        
        // encrypting password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		user = { ...req.body, password: hash };

        // save new user
		const newUser = new User(user);
        await newUser.save();
        
        // generate JWT token
		const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
		
		res.cookie("authToken", token, {
			httpOnly: true, // Prevents JavaScript access to the cookie
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			sameSite: "strict", // Prevents CSRF attacks
			maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day in this example)
		});

		res.status(201).send({
			status: true,
			message: "User created successfully",
			data: newUser,
			token: token, 
		});
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).send({
			status: false,
			message: "Error creating user",
		});
	}
};

userController.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send({
				status: false,
				message: "Email and password are required",
			});
		}

		// check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).send({
				status: false,
				message: "Invalid email or password",
			});
		}

		// check password
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(401).send({
                status: false,
                message: "Invalid email or password",
            });
        }

		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
		
		res.cookie("authToken", token, {
			httpOnly: true, // Prevents JavaScript access to the cookie
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			sameSite: "strict", // Prevents CSRF attacks
			maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day in this example)
		});

		res.status(200).send({
			status: true,
			message: "User logged in successfully",
            data: user,
            token: token,
		});
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).send({
			status: false,
			message: "Error logging in user",
		});
	}
};

module.exports = userController;
