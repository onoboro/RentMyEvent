const User = require('../models/userModel');
const Supplier = require('../models/supplierModel');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { accountType, email, username, password, companyName, companyEmail } = req.body;

    try {
        if (accountType === 'user') {
            const user = new User({ email, username, password });
            await user.save();
            return res.redirect('/login');
        } else if (accountType === 'supplier') {
            const supplier = new Supplier({ companyName, companyEmail, password });
            await supplier.save();
            return res.redirect('/login');
        }
    } catch (err) {
        res.status(500).send("Error during signup");
        console.log(err);
        
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }) || await Supplier.findOne({ companyEmail: email });
        if (!user) return res.status(400).send("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        // Determine the type of account and set it in the session
        req.session.user = {
            id: user._id,
            type: user instanceof User ? 'user' : 'supplier',
            name: user instanceof User ? user.username : user.companyName
        };

        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send("Error during login");
    }
};
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

exports.renderLogin = (req, res) => {
    res.render('login', { error: null });
};
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
