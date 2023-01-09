const mongoose = require('mongoose');
mongoose.set('debug', true);

// Pricepoints for inflation tracking
const PriceSchema = new mongoose.Schema({
	date: {type: Date, required: true},
	price: {type: Number, required: true}
});

// Items for autofill/inflation tracking
const ItemSchema = new mongoose.Schema({
	name: {type: String, required: true},
	pricesSeen: {type: [PriceSchema], required: true} // TODO: hashmap (date -> price) instead of PriceSchema array
});

// Item entries in individual receipts
const EntrySchema = new mongoose.Schema({
	item: {type: ItemSchema, required: true},
	quantity: {type: Number, required: true},
	price: {type: Number, required: true}
});

// Receipts from some Company
const ReceiptSchema = new mongoose.Schema({
	date: {type: Date, required: true},
	subtotal: {type: Number, required: true},
	tips: {type: Number, required: true},
	tax: {type: Number, required: true},
	total: {type: Number, required: true},
	items: {type: [EntrySchema], required: true}
});

// Companies user shops from
const CompanySchema = new mongoose.Schema({
	name: {type: String, required: true},
	items: {type: [ItemSchema], required: true},
	receipts: {type: [ReceiptSchema], required: true},
	stats: {}
}, {collection: 'Companies'});

// An abstraction of the user's miscellaneous/combined information/statistics
const SpenderSchema = new mongoose.Schema({
	name: {type: String, required: true},
	passwordHash: {type: String, required: true},
	stats: {}
}, {collection: 'Spenders'});

module.exports = {Item: ItemSchema,
									Company: mongoose.model('Company', CompanySchema),
								  Receipt: ReceiptSchema,
									Spender: mongoose.model('Spender', SpenderSchema)};

// Usage: const {Item, Company} = require('../db/MongooseSchemas');