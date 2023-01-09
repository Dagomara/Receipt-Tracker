const mongoose = require('mongoose');
//mongoose.set('debug', true);

// names of receipt items just so it's easy to search and track
const itemSchema = new mongoose.Schema({
	name: {type: String, required: true}
});

// the amount/cost of items on a receipt
const receiptItemReferenceSchema = new mongoose.Schema({
	id: {type: String, required: true},
	quantity: {type: Number, required: true},
	cumCost: {type: Number, required: true}
});

const receiptSchema = new mongoose.Schema({
	date: {type: String, required: true},
	subtotal: {type: Number, required: true},
	tax: {type: Number, required: true},
	total: {type: Number, required: true},
	tips: {type: Number, required: false},
	items: [receiptItemReferenceSchema] // receipt item tracking
});

const companySchema = new mongoose.Schema({
	name: {type: String, required: true},
	receiptList: [receiptSchema],
	items: [itemSchema] // track items this store sells
});

const UserSchema = new mongoose.Schema({
	username: {type: String, required: true},
	name: {type: String, required: true},
	companies: [companySchema]
}, { collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);