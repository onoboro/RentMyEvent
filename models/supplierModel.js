const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supplierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

supplierSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Supplier', supplierSchema);
