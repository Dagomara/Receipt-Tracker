const mongoose = require('mongoose');
mongoose.set('debug', true);

// Pricepoints for inflation tracking
const PriceSchema = new mongoose.Schema({
	date: {type: Date, required: true},
	price: {type: Number, required: true}
});

// Items for autofill/inflation tracking
const ItemSchema = new mongoose.Schema({
	company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
	name: {type: String, required: true},
	pricesSeen: {type: [{
		date: {type: Date, required: true},
		ppc: {type: Number, required: true}
	}], required: true} // TODO: hashmap (date -> price) instead of PriceSchema array
}, {collection: 'Items'});

// Receipts from some Company
const ReceiptSchema = new mongoose.Schema({
	company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
	date: {type: Date, required: true},
	subtotal: {type: Number, required: true},
	tips: {type: Number, required: true},
	tax: {type: Number, required: true},
	total: {type: Number, required: true},
	items: {type: [{
		item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
		count: {type: Number, required: true},
		ppc: {type: Number, required: true} // price per count
	}], required: true}
}, {collection: 'Receipts'});

// Companies user shops from
const CompanySchema = new mongoose.Schema({
	name: {type: String, required: true},
	stats: {}
}, {collection: 'Companies'});

// An abstraction of the user's miscellaneous/combined information/statistics
const SpenderSchema = new mongoose.Schema({
	name: {type: String, required: true},
	passwordHash: {type: String, required: true},
	stats: {}
}, {collection: 'Spenders'});

module.exports = {Item: mongoose.model('Item', ItemSchema),
									Company: mongoose.model('Company', CompanySchema),
								  Receipt: mongoose.model('Receipt', ReceiptSchema),
									Spender: mongoose.model('Spender', SpenderSchema)};

// Usage: const {Item, Company} = require('../db/MongooseSchemas');