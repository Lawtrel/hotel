const mongoose = require('mongoose');

const ReservarSchema = new mongoose.Schema({
    name: { type: String, required: true},
    checkInData: {type: Date, required: true},
    checkOutData: {type: Date, required: true},
    guests: {type: Number, default: '1'},
});

module.exports = mongoose.model('Reservar',ReservarSchema);