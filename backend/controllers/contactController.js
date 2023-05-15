const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route Get /ap/contacts
//@access public

const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find();
	return res.status(200).json(contacts);
});

//@desc Create New contacts
//@route Get /ap/contacts
//@access public

const createContact = asyncHandler(async (req, res) => {
	const { name, email, phone } = req.body;

	if (!name || !email || !phone) {
		res.status(400);
		throw new Error("All Fields are mendatory");
	}
	const contact = Contact.create({
		name,
		email,
		phone,
	});

	return res.status(201).json(contact);
});

//@desc Get contacts
//@route Get /ap/contacts
//@access public

const getContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	return res.status(200).json(contact);
});

//@desc Get all contacts
//@route Get /ap/contacts
//@access public

const updateContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}

	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);

	return res.status(200).json(updatedContact);
});

//@desc Get all contacts
//@route Get /ap/contacts
//@access public

const deleteContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);

	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}

	await Contact.deleteOne({ _id: req.params.id });
	return res.status(200).json(contact.email);
});

module.exports = {
	getContact,
	createContact,
	getContacts,
	updateContact,
	deleteContact,
};
