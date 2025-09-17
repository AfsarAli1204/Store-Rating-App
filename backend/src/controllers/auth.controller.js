const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // This creates the new user in the database
        const newUser = await User.create({
            name,
            email,
            password,
            address,
            role: 'Normal User' // All public signups are Normal Users
        });

        res.status(201).send({ message: "User registered successfully!" });
    } catch (error) {
        // If there's an error (like a validation failure), send it back
        console.error("SIGNUP ERROR:", error);
        res.status(400).send({ message: error.message || "Signup failed due to a server error." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).send({ message: "An internal server error occurred during login." });
    }
};

