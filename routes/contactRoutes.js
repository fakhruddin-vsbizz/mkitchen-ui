const express = require("express");
const {
  getContact,
  updateContact,
  getContacts,
  createContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// This ->
// router.route("/").get(getContacts);
// router.route("/").post(createContact);
// router.route("/:id").get(getContact);
// router.route("/:id").put(updateContact);
// router.route("/:id").delete(deleteContact);

// Or this ->
// router.use(validateToken);

router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
